/**
 * scripts/seed-supabase.ts
 * 
 * Script de Migração / Seed para popular o banco de dados do Supabase
 * a partir das bases locais em JSON (Candidatos, Histórico, Certidões, Fatos, Pilares, Pesquisas e Notícias).
 * 
 * Execução: npx tsx scripts/seed-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente de .env se existir
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

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ ERRO: VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (ou VITE_SUPABASE_ANON_KEY) são obrigatórios no arquivo .env.');
  console.log('\nCrie um arquivo .env na raiz do projeto com o seguinte formato:');
  console.log('VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co');
  console.log('SUPABASE_SERVICE_ROLE_KEY=<sua-chave-service-role-ou-anon>\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function loadJson(relPath: string) {
  const fullPath = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) return [];
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
}

async function seed() {
  console.log('='.repeat(70));
  console.log('🚀 INICIANDO MIGRAÇÃO DE DADOS LOCAIS PARA O SUPABASE');
  console.log('='.repeat(70));

  // 1. Candidatos
  const presidente = loadJson('src/data/federal/presidente.json');
  const governadorSP = loadJson('src/data/estados/sp/governador.json');
  const senadorSP = loadJson('src/data/estados/sp/senador.json');
  const deputadosSP = loadJson('src/data/estados/sp/deputados.json');

  const allCandidates = [...presidente, ...governadorSP, ...senadorSP, ...deputadosSP];
  console.log(`📦 Encontrados ${allCandidates.length} candidatos para migrar...`);

  for (const cand of allCandidates) {
    // Upsert Candidato
    const { error: candErr } = await supabase.from('candidatos').upsert({
      id: cand.id,
      nome_completo: cand.name,
      nome_popular: cand.popularName,
      foto_url: cand.photoUrl,
      cargo: cand.role,
      estado: cand.state || 'BR',
      partido: cand.party,
      numero_urna: cand.ballotNumber,
      coligacao: cand.coalition,
      idade: cand.age,
      cidade_origem: cand.cityOrigin,
      patrimonio_declarado: cand.declaredAssets || 0,
      nota_institucional: cand.currentOfficeNote || null,
      escolaridade_nivel: cand.education.level,
      escolaridade_instituicao: cand.education.institution,
      escolaridade_curso: cand.education.course,
      escolaridade_detalhes: cand.education.details,
      escolaridade_cursos_complementares: cand.education.complementaryCourses || [],
      anos_vida_publica: cand.experience.yearsInPublicService || 0,
      resumo_experiencia: cand.experience.summary,
      projetos_apresentados: cand.experience.legislativeStats?.billsProposed || 0,
      projetos_aprovados: cand.experience.legislativeStats?.billsApproved || 0,
      assiduidade_plenario: cand.experience.legislativeStats?.attendanceRate || 0,
      cota_parlamentar_anual: cand.experience.legislativeStats?.parliamentaryQuotaSpentYearlyAvg || 0,
      sabatinas_media_score: cand.debatesAndInterviews?.averageScore || 0,
      plano_resumo: cand.governmentPlan?.summary,
      plano_pdf_url: cand.governmentPlan?.pdfUrl
    });

    if (candErr) {
      console.error(`❌ Erro ao salvar candidato ${cand.popularName}:`, candErr.message);
      continue;
    }

    // Cargos Anteriores
    if (cand.experience?.roles?.length) {
      for (const r of cand.experience.roles) {
        await supabase.from('candidatos_cargos_historico').insert({
          candidato_id: cand.id,
          titulo: r.title,
          periodo: r.period,
          esfera: r.level || 'federal',
          entregas: r.achievements || []
        });
      }
    }

    // Fatos Checados
    if (cand.integrityAndFacts?.factChecks?.length) {
      for (const fc of cand.integrityAndFacts.factChecks) {
        await supabase.from('fatos_checados').upsert({
          id: fc.id,
          candidato_id: cand.id,
          titulo: fc.title,
          descricao: fc.description,
          veiculo_ou_orgao: fc.vehicleOrOrgan,
          categoria: fc.category,
          data_fato: fc.date,
          url_fonte: fc.sourceUrl,
          numero_processo: fc.courtCaseNumber || null
        });
      }
    }

    // Pilares do Plano de Governo
    if (cand.governmentPlan?.pillars?.length) {
      for (const p of cand.governmentPlan.pillars) {
        await supabase.from('planos_governo_pilares').insert({
          candidato_id: cand.id,
          chave: p.key,
          titulo: p.title,
          icone: p.icon,
          meta_principal: p.mainGoal,
          propostas: p.proposals || [],
          fonte_orcamento: p.budgetSource,
          viabilidade_score: p.feasibilityScore || 0
        });
      }
    }
  }
  console.log('✅ Candidatos e sub-estruturas migrados com sucesso!');

  // 2. Pesquisas Eleitorais TSE
  const presPolls = loadJson('src/data/polls/presidential-polls.json');
  const spPolls = loadJson('src/data/polls/sp-polls.json');
  const allPolls = [...presPolls, ...spPolls];
  console.log(`📊 Encontradas ${allPolls.length} pesquisas eleitorais registradas...`);

  for (const poll of allPolls) {
    await supabase.from('pesquisas_eleitorais').upsert({
      id: poll.id,
      registro_tse: poll.tseRegistration,
      instituto: poll.institute,
      cargo_alvo: poll.targetOffice,
      estado: poll.state || 'BR',
      data_campo_inicio: poll.fieldStartDate,
      data_campo_fim: poll.fieldEndDate,
      data_divulgacao: poll.releaseDate,
      amostra: poll.sampleSize,
      margem_erro: poll.marginOfError,
      nivel_confianca: poll.confidenceLevel,
      contratante: poll.contractor,
      metodologia: poll.methodology,
      url_fonte: poll.sourceUrl
    });

    for (const sc of poll.scenarios) {
      await supabase.from('pesquisas_cenarios').upsert({
        id: sc.id,
        pesquisa_id: poll.id,
        titulo: sc.title,
        tipo: sc.type,
        votos_brancos_nulos: sc.blankNull || 0,
        indecisos: sc.undecided || 0
      });

      for (const res of sc.results) {
        await supabase.from('pesquisas_resultados').insert({
          cenario_id: sc.id,
          candidato_id: res.candidateId,
          nome_candidato: res.candidateName,
          partido: res.party,
          percentual: res.percentage,
          cor_hex: res.color || '#3b82f6'
        });
      }
    }
  }
  console.log('✅ Pesquisas eleitorais e cenários migrados com sucesso!');

  // 3. Notícias Monitoradas
  const news = loadJson('src/data/live-news.json');
  console.log(`📰 Encontradas ${news.length} notícias para migrar...`);
  for (const item of news) {
    await supabase.from('noticias_monitoradas').upsert({
      id: item.id,
      candidato_id: item.candidateId,
      nome_candidato: item.candidateName,
      titulo: item.title,
      veiculo: item.source,
      url_noticia: item.url,
      data_publicacao: item.publishedAt,
      categoria: item.category,
      resumo: item.summary || null
    });
  }
  console.log('✅ Notícias em tempo real migradas com sucesso!');

  console.log('='.repeat(70));
  console.log('🎉 MIGRAÇÃO COMPLETA COM SUCESSO NO SUPABASE!');
  console.log('='.repeat(70));
}

seed().catch(err => {
  console.error('Erro fatal no seed:', err);
  process.exit(1);
});
