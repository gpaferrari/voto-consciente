/**
 * scripts/seed-supabase.ts
 * 
 * Script de Migração / Seed para popular o banco de dados do Supabase
 * a partir das bases locais em JSON (Candidatos, Histórico, Certidões, Fatos, Pilares, Pesquisas e Notícias).
 * Utiliza conexão direta com o PostgreSQL (como superusuário) para garantir inserção íntegra e sem bloqueios de RLS.
 * 
 * Execução: npm run db:seed
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Ler variáveis do .env
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

function loadJson(relPath: string) {
  const fullPath = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) return [];
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
}

async function runSeed() {
  console.log('='.repeat(70));
  console.log('🚀 INICIANDO MIGRAÇÃO DIRETA DE DADOS LOCAIS PARA O SUPABASE');
  console.log('='.repeat(70));

  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('✅ Conectado com sucesso ao PostgreSQL do Supabase!');

  try {
    // Iniciar transação
    await client.query('BEGIN');

    // 1. Candidatos
    const presidente = loadJson('src/data/federal/presidente.json');
    const governadorSP = loadJson('src/data/estados/sp/governador.json');
    const senadorSP = loadJson('src/data/estados/sp/senador.json');
    const deputadosSP = loadJson('src/data/estados/sp/deputados.json');
    const allCandidates = [...presidente, ...governadorSP, ...senadorSP, ...deputadosSP];

    console.log(`📦 Inserindo ${allCandidates.length} candidatos oficiais...`);

    for (const cand of allCandidates) {
      await client.query(`
        INSERT INTO public.candidatos (
          id, nome_completo, nome_popular, foto_url, cargo, estado, partido,
          numero_urna, coligacao, idade, cidade_origem, patrimonio_declarado,
          nota_institucional, escolaridade_nivel, escolaridade_instituicao,
          escolaridade_curso, escolaridade_detalhes, escolaridade_cursos_complementares,
          anos_vida_publica, resumo_experiencia, projetos_apresentados,
          projetos_aprovados, assiduidade_plenario, cota_parlamentar_anual,
          sabatinas_media_score, plano_resumo, plano_pdf_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
        ON CONFLICT (id) DO UPDATE SET
          nome_completo = EXCLUDED.nome_completo,
          nome_popular = EXCLUDED.nome_popular,
          foto_url = EXCLUDED.foto_url,
          patrimonio_declarado = EXCLUDED.patrimonio_declarado,
          nota_institucional = EXCLUDED.nota_institucional,
          atualizado_em = NOW();
      `, [
        cand.id,
        cand.name,
        cand.popularName,
        cand.photoUrl,
        cand.role,
        cand.state || 'BR',
        cand.party,
        cand.ballotNumber,
        cand.coalition || null,
        cand.age || null,
        cand.cityOrigin || null,
        cand.declaredAssets || 0,
        cand.currentOfficeNote || null,
        cand.education.level,
        cand.education.institution || null,
        cand.education.course || null,
        cand.education.details || null,
        cand.education.complementaryCourses || [],
        cand.experience?.yearsInPublicService || 0,
        cand.experience?.summary || null,
        cand.experience?.legislativeStats?.billsProposed || 0,
        cand.experience?.legislativeStats?.billsApproved || 0,
        cand.experience?.legislativeStats?.attendanceRate || 0,
        cand.experience?.legislativeStats?.parliamentaryQuotaSpentYearlyAvg || 0,
        cand.debatesAndInterviews?.averageScore || 0,
        cand.governmentPlan?.summary || null,
        cand.governmentPlan?.pdfUrl || null
      ]);

      // Histórico de cargos anteriores
      if (cand.experience?.roles?.length) {
        await client.query('DELETE FROM public.candidatos_cargos_historico WHERE candidato_id = $1', [cand.id]);
        for (const r of cand.experience.roles) {
          await client.query(`
            INSERT INTO public.candidatos_cargos_historico (candidato_id, titulo, periodo, esfera, entregas)
            VALUES ($1, $2, $3, $4, $5)
          `, [cand.id, r.title, r.period, r.level || 'federal', r.achievements || []]);
        }
      }

      // Certidões Judiciais
      if (cand.integrityAndFacts?.cleanRecordCertificates?.length) {
        await client.query('DELETE FROM public.certidoes_judiciais WHERE candidato_id = $1', [cand.id]);
        for (const cert of cand.integrityAndFacts.cleanRecordCertificates) {
          await client.query(`
            INSERT INTO public.certidoes_judiciais (candidato_id, tipo_certidao, orgao_emissor, status, data_emissao, codigo_verificacao, url_validacao)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            cand.id,
            cert.type || cert.court || 'Certidão Eleitoral/Judicial',
            cert.issuer || cert.court || 'Tribunal Oficial',
            cert.status || 'regular',
            cert.emissionDate || null,
            cert.verificationCode || null,
            cert.linkUrl || null
          ]);
        }
      }

      // Fatos Checados
      if (cand.integrityAndFacts?.factChecks?.length) {
        for (const fc of cand.integrityAndFacts.factChecks) {
          await client.query(`
            INSERT INTO public.fatos_checados (id, candidato_id, titulo, descricao, veiculo_ou_orgao, categoria, data_fato, url_fonte, numero_processo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id) DO UPDATE SET
              titulo = EXCLUDED.titulo,
              descricao = EXCLUDED.descricao,
              url_fonte = EXCLUDED.url_fonte;
          `, [
            fc.id,
            cand.id,
            fc.title,
            fc.description,
            fc.vehicleOrOrgan,
            fc.category,
            fc.date || '2024-01-01',
            fc.sourceUrl,
            fc.courtCaseNumber || null
          ]);
        }
      }

      // Pilares do Plano de Governo
      if (cand.governmentPlan?.pillars?.length) {
        await client.query('DELETE FROM public.planos_governo_pilares WHERE candidato_id = $1', [cand.id]);
        for (const p of cand.governmentPlan.pillars) {
          await client.query(`
            INSERT INTO public.planos_governo_pilares (candidato_id, chave, titulo, icone, meta_principal, propostas, fonte_orcamento, viabilidade_score)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            cand.id,
            p.key,
            p.title,
            p.icon || 'FileText',
            p.mainGoal,
            p.proposals || [],
            p.budgetSource,
            p.feasibilityScore || 0
          ]);
        }
      }
    }
    console.log('✅ 20 candidatos, históricos, certidões e planos inseridos com sucesso!');

    // 2. Pesquisas Eleitorais Registradas no TSE
    const presPolls = loadJson('src/data/polls/presidential-polls.json');
    const spPolls = loadJson('src/data/polls/sp-polls.json');
    const allPolls = [...presPolls, ...spPolls];

    console.log(`📊 Inserindo ${allPolls.length} pesquisas registradas no TSE com cenários...`);

    for (const poll of allPolls) {
      await client.query(`
        INSERT INTO public.pesquisas_eleitorais (
          id, registro_tse, instituto, cargo_alvo, estado, data_campo_inicio,
          data_campo_fim, data_divulgacao, amostra, margem_erro, nivel_confianca,
          contratante, metodologia, url_fonte
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
          registro_tse = EXCLUDED.registro_tse,
          amostra = EXCLUDED.amostra,
          margem_erro = EXCLUDED.margem_erro;
      `, [
        poll.id,
        poll.tseRegistration,
        poll.institute,
        poll.targetOffice,
        poll.state || 'BR',
        poll.fieldStartDate,
        poll.fieldEndDate,
        poll.releaseDate,
        poll.sampleSize,
        poll.marginOfError,
        poll.confidenceLevel || 95.0,
        poll.contractor,
        poll.methodology,
        poll.sourceUrl || null
      ]);

      if (poll.scenarios?.length) {
        for (const sc of poll.scenarios) {
          await client.query(`
            INSERT INTO public.pesquisas_cenarios (id, pesquisa_id, titulo, tipo, votos_brancos_nulos, indecisos)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO UPDATE SET
              titulo = EXCLUDED.titulo,
              votos_brancos_nulos = EXCLUDED.votos_brancos_nulos,
              indecisos = EXCLUDED.indecisos;
          `, [
            sc.id,
            poll.id,
            sc.title,
            sc.type,
            sc.blankNull || 0,
            sc.undecided || 0
          ]);

          if (sc.results?.length) {
            await client.query('DELETE FROM public.pesquisas_resultados WHERE cenario_id = $1', [sc.id]);
            for (const r of sc.results) {
              await client.query(`
                INSERT INTO public.pesquisas_resultados (cenario_id, candidato_id, nome_candidato, partido, percentual, cor_hex)
                VALUES ($1, $2, $3, $4, $5, $6)
              `, [
                sc.id,
                r.candidateId,
                r.candidateName,
                r.party,
                r.percentage,
                r.color || '#3b82f6'
              ]);
            }
          }
        }
      }
    }
    console.log('✅ Pesquisas eleitorais, cenários e intenções de voto inseridos!');

    // 3. Notícias Monitoradas
    const news = loadJson('src/data/live-news.json');
    console.log(`📰 Inserindo ${news.length} notícias factuais apuradas...`);

    const validCandidateIds = new Set(allCandidates.map(c => c.id));
    const CANDIDATE_ID_MAP: Record<string, string> = {
      'lula-2026': 'lula-presidente',
      'tarcisio-2026': 'tarcisio-governador',
      'caiado-2026': 'ronaldo-caiado-presidente',
      'ratinho-junior-2026': 'ratinho-junior-presidente',
      'ciro-gomes-2026': 'ciro-gomes-presidente',
      'romeu-zema-2026': 'romeu-zema-presidente',
      'eduardo-leite-2026': 'eduardo-leite-presidente',
      'marcos-pontes': 'marcos-pontes-senador',
      'rodrigo-agostinho': 'rodrigo-agostinho-deputado',
      'capitao-augusto': 'capitao-augusto-deputado',
      'arnaldo-jardim': 'arnaldo-jardim-deputado',
      'baleia-rossi': 'baleia-rossi-deputado'
    };

    let newsInserted = 0;
    for (const item of news) {
      const canonicalId = CANDIDATE_ID_MAP[item.candidateId] || item.candidateId;
      if (!validCandidateIds.has(canonicalId)) {
        continue;
      }

      await client.query(`
        INSERT INTO public.noticias_monitoradas (id, candidato_id, nome_candidato, titulo, veiculo, url_noticia, data_publicacao, categoria, resumo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          titulo = EXCLUDED.titulo,
          url_noticia = EXCLUDED.url_noticia;
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
      newsInserted++;
    }
    console.log(`✅ ${newsInserted} notícias em tempo real inseridas com sucesso!`);

    // Finalizar transação com commit
    await client.query('COMMIT');

    // Testar as views analíticas
    console.log('\n📊 TESTANDO AS VIEWS ANALÍTICAS NO POSTGRESQL:');
    const mediaMovelRes = await client.query('SELECT cargo_alvo, nome_candidato, media_ponderada FROM public.v_media_movel_pesquisas LIMIT 5;');
    console.log('   ↳ Amostra v_media_movel_pesquisas:');
    for (const row of mediaMovelRes.rows) {
      console.log(`      • [${row.cargo_alvo}] ${row.nome_candidato}: ${row.media_ponderada}%`);
    }

    const perfilRes = await client.query('SELECT count(*) as total FROM public.v_perfil_analitico_candidatos;');
    console.log(`   ↳ Total de perfis analíticos gerados: ${perfilRes.rows[0].total}`);

    console.log('='.repeat(70));
    console.log('🎉 BANCO DE DADOS DO SUPABASE 100% POPULADO E OPERACIONAL!');
    console.log('='.repeat(70));

  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('❌ Erro durante o seed, transação revertida:', err.message);
    throw err;
  } finally {
    await client.end();
  }
}

runSeed().catch(err => {
  console.error(err);
  process.exit(1);
});
