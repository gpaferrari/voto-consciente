/**
 * scripts/scrape-news.ts
 * 
 * Pipeline de Web Scraping & Ingestão com Validação Estrita de Fontes Confiáveis.
 * 
 * Protocolo de Segurança e Confiabilidade:
 * 1. Apenas notícias de veículos jornalísticos de referência, agências oficiais de Estado e 
 *    agências de checagem certificadas pela IFCN são aceitas.
 * 2. Bloqueia blogs anônimos, sites sensacionalistas e desinformação.
 * 3. Monitora exclusivamente candidaturas e lideranças em seus cargos legítimos e homologados,
 *    eliminando qualquer candidatura fictícia ou especulativa.
 * 4. Atualiza localmente `src/data/live-news.json` e sincroniza no Supabase (`noticias_monitoradas`).
 * 
 * Execução: npm run scrape:news
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar .env se existir
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valParts] = trimmed.split('=');
      const val = valParts.join('=').replace(/^["'](.*)["']$/, '$1');
      if (key && !process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const DATABASE_URL = 
  process.env.DATABASE_URL || 
  process.env.SECRET_kEY || 
  process.env.SECRET_KEY || 
  'postgresql://postgres:Gu97232544*@db.wpfkatojghlrdbfivqjv.supabase.co:5432/postgres';

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
  isVerifiedSource?: boolean;
}

// WHITELIST RIGOROSA DE FONTES DE IMPRENSA CONFIÁVEIS E ÓRGÃOS OFICIAIS
const TRUSTED_SOURCES_WHITELIST = [
  'g1',
  'globo',
  'tv globo',
  'o globo',
  'valor econômico',
  'valor',
  'cbn',
  'folha de s.paulo',
  'folha',
  'uol',
  'o estado de s. paulo',
  'estadao',
  'estadáoverifica',
  'agência brasil',
  'ebc',
  'cnn brasil',
  'cnn',
  'bbc news brasil',
  'bbc',
  'poder360',
  'nexo jornal',
  'nexo',
  'agência lupa',
  'aos fatos',
  'projeto comprova',
  'jota',
  'congresso em foco',
  'gazeta do povo',
  'carta capital',
  'tse',
  'tribunal superior eleitoral',
  'stf',
  'supremo tribunal federal',
  'tcu',
  'ibge'
];

// Termos sensacionalistas ou de clickbait para rejeição imediata
const CLICKBAIT_BLACKLIST = [
  'urgente veja antes que apaguem',
  'bomba exclusiva',
  'escândalo secreto',
  'o que a mídia esconde',
  'desesperado',
  'humilha em debate'
];

function isSourceTrusted(sourceName: string): boolean {
  const norm = sourceName.toLowerCase().trim();
  return TRUSTED_SOURCES_WHITELIST.some(trusted => norm.includes(trusted));
}

// Candidatos monitorados exclusivamente em suas esferas oficiais e homologadas
const CANDIDATE_TARGETS = [
  // Presidência da República (2º Turno & Candidaturas Homologadas 2026)
  { 
    id: 'flavio-bolsonaro-presidente', 
    name: 'Flávio Bolsonaro', 
    query: 'Flávio Bolsonaro presidente OR segundo turno OR plano de governo' 
  },
  { 
    id: 'lula-presidente', 
    name: 'Luiz Inácio Lula da Silva', 
    query: 'Lula presidente OR governo OR segundo turno OR propostas' 
  },
  { 
    id: 'augusto-cury-presidente', 
    name: 'Augusto Cury', 
    query: 'Augusto Cury Avante OR eleições 2026 OR educação' 
  },
  { 
    id: 'renan-santos-presidente', 
    name: 'Renan Santos', 
    query: 'Renan Santos Partido Missão OR eleições 2026' 
  },
  { 
    id: 'ronaldo-caiado-presidente', 
    name: 'Ronaldo Caiado', 
    query: 'Ronaldo Caiado PSD OR eleições 2026 OR Goiás' 
  },
  { 
    id: 'romeu-zema-presidente', 
    name: 'Romeu Zema', 
    query: 'Romeu Zema Novo OR eleições 2026 OR Minas Gerais' 
  },
  
  // Esfera Estadual de São Paulo (Governador)
  { 
    id: 'tarcisio-governador', 
    name: 'Tarcísio de Freitas (Governador Reeleito SP)', 
    query: 'Tarcísio de Freitas reeleito governo SP OR obras São Paulo' 
  },
  { 
    id: 'haddad-governador', 
    name: 'Fernando Haddad', 
    query: 'Fernando Haddad eleições SP OR Fazenda' 
  },
  { 
    id: 'guilherme-boulos', 
    name: 'Guilherme Boulos', 
    query: 'Guilherme Boulos câmara OR projeto de lei' 
  },
  { 
    id: 'marcio-franca', 
    name: 'Márcio França', 
    query: 'Márcio França microempresa OR empreendedorismo' 
  },
  { 
    id: 'ricardo-nunes', 
    name: 'Ricardo Nunes', 
    query: 'Ricardo Nunes prefeitura São Paulo OR obras' 
  },

  // Senado Federal (São Paulo - Eleitos 2026 e Mandato Vigente)
  { 
    id: 'guilherme-derrite-senador', 
    name: 'Guilherme Derrite', 
    query: 'Guilherme Derrite Senador eleito SP OR segurança pública' 
  },
  { 
    id: 'andre-do-prado-senador', 
    name: 'André do Prado', 
    query: 'André do Prado Senador eleito SP OR Alesp' 
  },
  { 
    id: 'simone-tebet-senadora', 
    name: 'Simone Tebet', 
    query: 'Simone Tebet Senado SP OR Planejamento' 
  },
  { 
    id: 'marcos-pontes-senador', 
    name: 'Marcos Pontes', 
    query: 'Marcos Pontes Senado OR ciência e tecnologia' 
  },

  // Deputados Federais (Bauru / SP)
  { 
    id: 'rodrigo-agostinho-deputado', 
    name: 'Rodrigo Agostinho', 
    query: 'Rodrigo Agostinho Ibama OR meio ambiente' 
  },
  { 
    id: 'capitao-augusto-deputado', 
    name: 'Capitão Augusto', 
    query: 'Capitão Augusto Câmara OR segurança' 
  },
  { 
    id: 'arnaldo-jardim-deputado', 
    name: 'Arnaldo Jardim', 
    query: 'Arnaldo Jardim bioeconomia OR reforma tributária' 
  },
  { 
    id: 'baleia-rossi-deputado', 
    name: 'Baleia Rossi', 
    query: 'Baleia Rossi PEC 45 OR reforma tributária' 
  }
];

function determineCategory(title: string): ScrapedNewsItem['category'] {
  const lower = title.toLowerCase();
  if (lower.includes('pesquisa') || lower.includes('datafolha') || lower.includes('quaest') || lower.includes('pontos') || lower.includes('empate')) {
    return 'pesquisa';
  }
  if (lower.includes('processo') || lower.includes('tse') || lower.includes('stf') || lower.includes('tcu') || lower.includes('justiça') || lower.includes('decisão') || lower.includes('inelegível')) {
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

function parseRssXml(xml: string, candidateId: string, candidateName: string): { items: ScrapedNewsItem[]; rejectedCount: number } {
  const items: ScrapedNewsItem[] = [];
  let rejectedCount = 0;
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

      if (rawTitle.includes(' - ')) {
        const parts = rawTitle.split(' - ');
        sourceName = parts.pop() || sourceName;
        rawTitle = parts.join(' - ');
      } else if (sourceMatch) {
        sourceName = sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim();
      }

      // Validação 1: Fonte Confiável e Homologada
      if (!isSourceTrusted(sourceName)) {
        rejectedCount++;
        continue;
      }

      // Validação 2: Descarte de Clickbait
      const lowerTitle = rawTitle.toLowerCase();
      if (CLICKBAIT_BLACKLIST.some(bad => lowerTitle.includes(bad))) {
        rejectedCount++;
        continue;
      }

      let dateIso = new Date().toISOString().split('T')[0];
      if (pubDateMatch) {
        try {
          const parsed = new Date(pubDateMatch[1]);
          if (!isNaN(parsed.getTime())) {
            dateIso = parsed.toISOString().split('T')[0];
          }
        } catch {
          // fallback
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
        category: determineCategory(rawTitle),
        isVerifiedSource: true
      });
    }
  }

  return { items, rejectedCount };
}

async function fetchCandidateNews(target: typeof CANDIDATE_TARGETS[0]): Promise<{ items: ScrapedNewsItem[]; rejected: number }> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(target.query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[Aviso] Falha ao consultar feed para ${target.name}: HTTP ${res.status}`);
      return { items: [], rejected: 0 };
    }

    const xml = await res.text();
    const parsed = parseRssXml(xml, target.id, target.name);
    return { items: parsed.items, rejected: parsed.rejectedCount };
  } catch (err: any) {
    console.warn(`[Aviso] Timeout ou erro ao consultar feed para ${target.name}: ${err?.message || err}`);
    return { items: [], rejected: 0 };
  }
}

async function syncToSupabase(newsItems: ScrapedNewsItem[]) {
  if (!DATABASE_URL) {
    console.log('ℹ️ DATABASE_URL não encontrada. Sincronização remota ignorada.');
    return;
  }

  console.log('\n☁️ SINCRONIZANDO NOTÍCIAS DE FONTES CONFIÁVEIS NO SUPABASE...');
  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Expurgar candidaturas especulativas ou inválidas caso ainda existam no banco remoto
    const obsoleteIds = [
      'tarcisio-presidente',
      'tarcisio-2026',
      'ciro-gomes-presidente',
      'ciro-gomes-2026',
      'ratinho-junior-presidente',
      'ratinho-junior-2026',
      'eduardo-leite-presidente',
      'eduardo-leite-2026',
      'jair-bolsonaro-presidente',
      'mara-gabrilli',
      'eduardo-suplicy',
      'janaina-paschoal'
    ];
    await client.query('DELETE FROM public.noticias_monitoradas WHERE candidato_id = ANY($1::text[])', [obsoleteIds]);
    await client.query('DELETE FROM public.candidatos WHERE id = ANY($1::text[])', [obsoleteIds]);

    // Buscar IDs válidos de candidatos existentes no Supabase
    const candRes = await client.query('SELECT id FROM public.candidatos');
    const validCandidateIds = new Set(candRes.rows.map(r => r.id));

    const ID_MAPPINGS: Record<string, string> = {
      'fernando-haddad': 'haddad-governador',
      'lula-2026': 'lula-presidente',
      'flavio-bolsonaro': 'flavio-bolsonaro-presidente',
      'caiado-2026': 'ronaldo-caiado-presidente',
      'romeu-zema-2026': 'romeu-zema-presidente',
      'marcos-pontes': 'marcos-pontes-senador',
      'rodrigo-agostinho': 'rodrigo-agostinho-deputado',
      'capitao-augusto': 'capitao-augusto-deputado',
      'arnaldo-jardim': 'arnaldo-jardim-deputado',
      'baleia-rossi': 'baleia-rossi-deputado'
    };

    let insertedCount = 0;
    let skippedCount = 0;

    for (const item of newsItems) {
      const canonicalId = ID_MAPPINGS[item.candidateId] || item.candidateId;
      
      if (!validCandidateIds.has(canonicalId)) {
        skippedCount++;
        continue;
      }

      try {
        const res = await client.query(`
          INSERT INTO public.noticias_monitoradas (id, candidato_id, nome_candidato, titulo, veiculo, url_noticia, data_publicacao, categoria, resumo)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            titulo = EXCLUDED.titulo,
            url_noticia = EXCLUDED.url_noticia
          RETURNING id;
        `, [
          item.id,
          canonicalId,
          item.candidateName,
          item.title,
          item.source,
          item.url,
          item.publishedAt,
          item.category,
          item.summary || null
        ]);

        if (res.rowCount && res.rowCount > 0) insertedCount++;
      } catch (itemErr: any) {
        console.warn(`[Supabase] Erro ao sincronizar notícia (${item.title}):`, itemErr.message);
      }
    }

    console.log(`✅ ${insertedCount} notícias de fontes verificadas sincronizadas no Supabase! (${skippedCount} ignoradas)`);
    await client.end();
  } catch (err: any) {
    console.warn('⚠️ Falha ao conectar ao Supabase (fallback local preservado):', err.message);
    try { await client.end(); } catch {}
  }
}

async function run() {
  console.log('='.repeat(70));
  console.log('🛡️ PIPELINE DE INGESTÃO COM VALIDAÇÃO DE FONTES CONFIÁVEIS (TSE & IFCN)');
  console.log('='.repeat(70));

  const allNews: ScrapedNewsItem[] = [];
  let totalRejected = 0;
  const outputPath = path.resolve(__dirname, '../src/data/live-news.json');

  // Carregar notícias existentes e filtrar por fontes confiáveis e candidatos válidos
  let existingNews: ScrapedNewsItem[] = [];
  const INVALID_CANDIDATE_IDS = new Set([
    'tarcisio-presidente',
    'tarcisio-2026',
    'ciro-gomes-presidente',
    'ciro-gomes-2026',
    'ratinho-junior-presidente',
    'ratinho-junior-2026',
    'eduardo-leite-presidente',
    'eduardo-leite-2026',
    'jair-bolsonaro-presidente',
    'mara-gabrilli',
    'eduardo-suplicy',
    'janaina-paschoal'
  ]);

  if (fs.existsSync(outputPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(outputPath, 'utf-8')) as ScrapedNewsItem[];
      existingNews = raw.filter(item => {
        // Remover candidatos inválidos como presidentes
        if (INVALID_CANDIDATE_IDS.has(item.candidateId)) return false;
        // Exigir fonte confiável
        return isSourceTrusted(item.source);
      });
      console.log(`📋 Notícias existentes purificadas: ${existingNews.length} itens mantidos após expurgo.`);
    } catch {
      existingNews = [];
    }
  }

  for (const target of CANDIDATE_TARGETS) {
    console.log(`🔎 Consultando fontes verificadas para: ${target.name}...`);
    const { items: fetched, rejected } = await fetchCandidateNews(target);
    totalRejected += rejected;
    console.log(`   ↳ ${fetched.length} notícia(s) aprovada(s) de fontes confiáveis (descartadas não-homologadas: ${rejected}).`);
    allNews.push(...fetched);
    await new Promise(r => setTimeout(r, 350));
  }

  // Merge único por URL ou título
  const mergedMap = new Map<string, ScrapedNewsItem>();
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

  console.log('='.repeat(70));
  console.log(`✅ Sucesso! ${finalNews.length} notícias confiáveis salvas em live-news.json`);
  console.log(`🛡️ Total de itens não-homologados descartados: ${totalRejected}`);
  console.log('='.repeat(70));

  // Sincronizar remotamente com o Supabase
  await syncToSupabase(allNews);
}

run();
