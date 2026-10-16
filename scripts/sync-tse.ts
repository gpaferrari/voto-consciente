/**
 * scripts/sync-tse.ts
 * 
 * Auditoria Automatizada de Integridade Federativa, Registro TSE e Fontes Confiáveis (IFCN/Gov).
 * 
 * Uso: npm run sync:tse
 */

import { ALL_CANDIDATES, SUPPORTED_STATES } from '../src/data/registry';
import {
  validateSourceUrl,
  validateTseRegistration,
  validateCandidacyRole,
  validateNewsArticle
} from '../src/services/sourceValidator';
import secondRound from '../src/data/second-round-2026.json';
import electedData from '../src/data/elected-2026.json';
import presPolls from '../src/data/polls/presidential-polls.json';
import spPolls from '../src/data/polls/sp-polls.json';
import liveNews from '../src/data/live-news.json';

async function main() {
  console.log('='.repeat(70));
  console.log('🛡️ AUDITORIA OFICIAL DE INTEGRIDADE E FONTES CONFIÁVEIS (TSE / IFCN / IBGE)');
  console.log('='.repeat(70));

  let errors = 0;

  // 1. Validar todos os candidatos e dossiês
  console.log(`\n1. Auditando ${ALL_CANDIDATES.length} dossiês de candidatos (${SUPPORTED_STATES.map(s => s.uf).join(', ')})...`);
  for (const c of ALL_CANDIDATES) {
    const estado = c.state ? `[UF: ${c.state}]` : '[FEDERAL]';
    const roleCheck = validateCandidacyRole(c.name, c.role);

    if (!roleCheck.isValidForRole) {
      console.error(` ❌ [ERRO CANDIDATURA] ${c.id}: ${roleCheck.warningMessage}`);
      errors++;
    }

    if (!c.tseVerification?.isOfficial) {
      console.error(` ❌ [ERRO TSE VERIF AUSENTE] ${c.id}`);
      errors++;
    }

    const pdfCheck = validateSourceUrl(c.governmentPlan.pdfUrl);
    if (!pdfCheck.isValid) {
      console.error(` ❌ [ERRO PDF URL] ${c.id} -> ${c.governmentPlan.pdfUrl}: ${pdfCheck.reason}`);
      errors++;
    }

    for (const fc of c.integrityAndFacts.factChecks) {
      const fcCheck = validateSourceUrl(fc.sourceUrl);
      if (!fcCheck.isValid) {
        console.error(` ❌ [ERRO FACTCHECK URL] ${c.id} (${fc.id}) -> ${fc.sourceUrl}: ${fcCheck.reason}`);
        errors++;
      }
    }

    if (c.mandateEvaluation?.promisesList) {
      for (const pr of c.mandateEvaluation.promisesList) {
        const prCheck = validateSourceUrl(pr.sourceUrl);
        if (!prCheck.isValid) {
          console.error(` ❌ [ERRO PROMISE URL] ${c.id} (${pr.id}) -> ${pr.sourceUrl}: ${prCheck.reason}`);
          errors++;
        }
      }
    }

    console.log(` ✅ ${estado} [${c.role.toUpperCase()}] ${c.popularName} (${c.party} - ${c.ballotNumber}) | TSE: ${c.tseVerification?.status}`);
  }

  // 2. Validar cobertura nacional de eleitos (27 UFs)
  console.log(`\n2. Auditando Eleitos 2026 (${electedData.totalStates} UFs / ${electedData.totalOfficials} mandatários)...`);
  const statesSet = new Set(electedData.officials.map(o => o.state));
  if (statesSet.size !== 27) {
    console.error(` ❌ [ERRO COBERTURA UFs] Esperado 27 UFs, encontrado ${statesSet.size}`);
    errors++;
  } else {
    console.log(` ✅ Cobertura completa das 27 Unidades Federativas (26 Estados + DF) validada.`);
  }

  // 3. Validar pesquisas eleitorais registradas no PesqEle/TSE
  const allPolls = [...secondRound.pollsSecondRound, ...presPolls, ...spPolls];
  console.log(`\n3. Auditando ${allPolls.length} pesquisas eleitorais registradas no PesqEle/TSE...`);
  for (const p of allPolls) {
    const tseCheck = validateTseRegistration(p.tseRegistration);
    if (!tseCheck.isValid) {
      console.error(` ❌ [ERRO REGISTRO TSE PESQUISA] ${p.id} (${p.tseRegistration}): ${tseCheck.reason}`);
      errors++;
    }
    const urlCheck = validateSourceUrl(p.sourceUrl);
    if (!urlCheck.isValid) {
      console.error(` ❌ [ERRO URL PESQUISA] ${p.id} (${p.sourceUrl}): ${urlCheck.reason}`);
      errors++;
    }
  }
  console.log(` ✅ Todas as ${allPolls.length} pesquisas possuem registro válido no PesqEle/TSE e link oficial.`);

  // 4. Validar notícias monitoradas
  const newsList = liveNews as any[];
  let approvedNews = 0;
  for (const n of newsList) {
    const nCheck = validateNewsArticle(n);
    if (nCheck.isApproved) {
      approvedNews++;
    } else {
      console.error(` ❌ [ERRO NOTÍCIA NÃO HOMOLOGADA] ${n.id} (${n.source}): ${nCheck.reason}`);
      errors++;
    }
  }
  console.log(`\n4. Auditando ${newsList.length} notícias monitoradas: ${approvedNews}/${newsList.length} aprovadas por fontes confiáveis.`);

  console.log('\n' + '='.repeat(70));
  if (errors > 0) {
    console.error(`❌ AUDITORIA FALHOU COM ${errors} INCONSISTÊNCIA(S).`);
    process.exit(1);
  } else {
    console.log('🎯 RESULTADO FINAL: 0 INCONSISTÊNCIAS! 100% DOS DADOS E FONTES HOMOLOGADOS.');
  }
  console.log('='.repeat(70));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
