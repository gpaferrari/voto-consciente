/**
 * scripts/scrape-news.ts
 * 
 * Pipeline de Web Scraping & Ingestão de Notícias em Tempo Real
 * Consulta feeds RSS oficiais (Google News Brasil com filtros por candidato e Agência Brasil)
 * Extrai: Título, Veículo de Imprensa Confiável, Data de Publicação, Link Direto e Vinculação ao Candidato.
 * 
 * Execução: npm run scrape:news
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ScrapedNewsItem {
  id: string;
  candidateId: string;
  candidateName: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'proposta' | 'gestao' | 'juridico' | 'declaracao' | 'pesquisa';
  summary?: string;
}

// Candidatos monitorados e termos de busca com palavras-chave factuais
const CANDIDATE_TARGETS = [
  { id: 'lula-2026', name: 'Lula', query: 'Lula governo OR economia OR plano' },
  { id: 'tarcisio-2026', name: 'Tarcísio de Freitas', query: 'Tarcísio de Freitas governo SP OR obras' },
  { id: 'caiado-2026', name: 'Ronaldo Caiado', query: 'Ronaldo Caiado Goiás segurança OR governo' },
  { id: 'ciro-gomes-2026', name: 'Ciro Gomes', query: 'Ciro Gomes propostas OR economia' },
  { id: 'romeu-zema-2026', name: 'Romeu Zema', query: 'Romeu Zema Minas Gerais OR gestão' },
  { id: 'ratinho-junior-2026', name: 'Ratinho Júnior', query: 'Ratinho Júnior Paraná OR investimentos' },
  { id: 'eduardo-leite-2026', name: 'Eduardo Leite', query: 'Eduardo Leite Rio Grande do Sul OR gestão' },
  { id: 'fernando-haddad', name: 'Fernando Haddad', query: 'Fernando Haddad Fazenda OR reforma tributaria' },
  { id: 'guilherme-boulos', name: 'Guilherme Boulos', query: 'Guilherme Boulos projeto OR câmara' },
  { id: 'marcos-pontes', name: 'Marcos Pontes', query: 'Marcos Pontes Senado OR ciência' },
  { id: 'rodrigo-agostinho', name: 'Rodrigo Agostinho', query: 'Rodrigo Agostinho Ibama OR meio ambiente' },
  { id: 'capitao-augusto', name: 'Capitão Augusto', query: 'Capitão Augusto Câmara OR segurança' },
  { id: 'arnaldo-jardim', name: 'Arnaldo Jardim', query: 'Arnaldo Jardim bioeconomia OR reforma tributária' },
  { id: 'baleia-rossi', name: 'Baleia Rossi', query: 'Baleia Rossi PEC 45 OR reforma tributária' }
];

function determineCategory(title: string): ScrapedNewsItem['category'] {
  const lower = title.toLowerCase();
  if (lower.includes('pesquisa') || lower.includes('datafolha') || lower.includes('quaest') || lower.includes('pontos') || lower.includes('empate')) {
    return 'pesquisa';
  }
  if (lower.includes('processo') || lower.includes('tse') || lower.includes('stf') || lower.includes('tcu') || lower.includes('justiça') || lower.includes('decisão')) {
    return 'juridico';
  }
  if (lower.includes('proposta') || lower.includes('plano') || lower.includes('promete') || lower.includes('projeto') || lower.includes('reforma')) {
    return 'proposta';
  }
  if (lower.includes('obra') || lower.includes('gestão') || lower.includes('investimento') || lower.includes('pib') || lower.includes('meta')) {
    return 'gestao';
  }
  return 'declaracao';
}

function parseRssXml(xml: string, candidateId: string, candidateName: string): ScrapedNewsItem[] {
  const items: ScrapedNewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
    const itemContent = match[1];

    const titleMatch = /<title>(.*?)<\/title>/i.exec(itemContent);
    const linkMatch = /<link>(.*?)<\/link>/i.exec(itemContent);
    const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/i.exec(itemContent);
    const sourceMatch = /<source[^>]*>(.*?)<\/source>/i.exec(itemContent);

    if (titleMatch && linkMatch) {
      let rawTitle = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim();
      let sourceName = 'Imprensa Oficial';

      // Google News formats title as: "Headline - Source Name"
      if (rawTitle.includes(' - ')) {
        const parts = rawTitle.split(' - ');
        sourceName = parts.pop() || sourceName;
        rawTitle = parts.join(' - ');
      } else if (sourceMatch) {
        sourceName = sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim();
      }

      let dateIso = new Date().toISOString().split('T')[0];
      if (pubDateMatch) {
        try {
          const parsed = new Date(pubDateMatch[1]);
          if (!isNaN(parsed.getTime())) {
            dateIso = parsed.toISOString().split('T')[0];
          }
        } catch {
          // keep fallback
        }
      }

      const id = `news-${candidateId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      items.push({
        id,
        candidateId,
        candidateName,
        title: rawTitle,
        source: sourceName,
        url: linkMatch[1].trim(),
        publishedAt: dateIso,
        category: determineCategory(rawTitle)
      });
    }
  }

  return items;
}

async function fetchCandidateNews(target: typeof CANDIDATE_TARGETS[0]): Promise<ScrapedNewsItem[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(target.query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[Aviso] Falha ao consultar feed para ${target.name}: HTTP ${res.status}`);
      return [];
    }

    const xml = await res.text();
    return parseRssXml(xml, target.id, target.name);
  } catch (err: any) {
    console.warn(`[Aviso] Timeout ou erro ao consultar feed para ${target.name}: ${err?.message || err}`);
    return [];
  }
}

async function run() {
  console.log('='.repeat(65));
  console.log('📰 INICIANDO PIPELINE DE WEB SCRAPING & INGESTÃO DE NOTÍCIAS FACTUAIS');
  console.log('='.repeat(65));

  const allNews: ScrapedNewsItem[] = [];
  const outputPath = path.resolve(__dirname, '../src/data/live-news.json');

  // Load existing news to avoid clobbering high-quality verified items
  let existingNews: ScrapedNewsItem[] = [];
  if (fs.existsSync(outputPath)) {
    try {
      existingNews = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    } catch {
      existingNews = [];
    }
  }

  for (const target of CANDIDATE_TARGETS) {
    console.log(`🔎 Consultando fontes confiáveis para: ${target.name}...`);
    const fetched = await fetchCandidateNews(target);
    console.log(`   ↳ ${fetched.length} notícia(s) capturada(s).`);
    allNews.push(...fetched);
    // Be polite between queries
    await new Promise(r => setTimeout(r, 400));
  }

  // Merge unique by URL or title
  const mergedMap = new Map<string, ScrapedNewsItem>();
  
  // Prefer newly fetched, fallback to existing
  for (const item of allNews) {
    mergedMap.set(item.url || item.title, item);
  }
  for (const item of existingNews) {
    if (!mergedMap.has(item.url || item.title)) {
      mergedMap.set(item.url || item.title, item);
    }
  }

  const finalNews = Array.from(mergedMap.values()).sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  fs.writeFileSync(outputPath, JSON.stringify(finalNews, null, 2), 'utf-8');

  console.log('='.repeat(65));
  console.log(`✅ Sucesso! ${finalNews.length} notícias atualizadas em:`);
  console.log(`   ${outputPath}`);
  console.log('='.repeat(65));
}

run();
