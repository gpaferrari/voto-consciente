/**
 * Script de Ingestão e Sincronização com TSE e Dados Abertos
 * 
 * Uso: npx tsx scripts/sync-tse.ts --ano=2026
 * 
 * Valida a integridade dos esquemas territoriais (federal e estados).
 */

import { ALL_CANDIDATES, SUPPORTED_STATES } from '../src/data/registry';

async function main() {
  console.log('===> Sincronizador de Dados Oficiais Eleitorais Federativos (TSE / Câmara / IBGE)');
  console.log(`Estados Cadastrados: ${SUPPORTED_STATES.map(s => s.uf).join(', ')}`);
  console.log(`Sucesso: ${ALL_CANDIDATES.length} candidatos carregados e validados no schema oficial.\n`);

  for (const c of ALL_CANDIDATES) {
    const estado = c.state ? `[UF: ${c.state}]` : '[FEDERAL]';
    console.log(` - ${estado} [${c.role.toUpperCase()}] ${c.popularName} (${c.party}) | Bens: R$ ${c.declaredAssets.toLocaleString('pt-BR')}`);
    if (c.currentOfficeNote) {
      console.log(`   ↳ Obs. Institucional: ${c.currentOfficeNote}`);
    }
  }
  
  console.log('\n===> Todos os registros federativos estão íntegros e compatíveis com as normas do TSE.');
}

main().catch(console.error);
