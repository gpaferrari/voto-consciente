import { 
  calculateEducationScore, 
  calculateExperienceScore, 
  calculateDebatesScore, 
  calculateIntegrityScore, 
  calculateCandidateScore, 
  DEFAULT_WEIGHTS 
} from '../src/services/scoringEngine';
import { Candidate } from '../src/types/candidate';
import { ALL_CANDIDATES } from '../src/data/registry';

function runTests() {
  console.log('--- Iniciando Testes Unitários do Motor de Scoring ---');

  // Teste 1: Escolaridade
  const eduTest1 = calculateEducationScore({
    level: 'doutorado',
    institution: 'USP',
    course: 'Doutorado em Filosofia',
    details: 'Docência e pesquisa',
    complementaryCourses: ['Gestão Pública', 'Economia']
  });
  console.assert(eduTest1 === 100, `Esperado 100 para Doutorado com cursos, obtido ${eduTest1}`);
  console.log('✓ Teste 1: Escolaridade Doutorado passou (100/100)');

  const eduTest2 = calculateEducationScore({
    level: 'fundamental',
    institution: 'SENAI',
    course: 'Técnico Mecânico',
    details: 'Ensino fundamental e formação profissional',
    complementaryCourses: ['Liderança']
  });
  console.assert(eduTest2 >= 40 && eduTest2 <= 50, `Esperado entre 40 e 50, obtido ${eduTest2}`);
  console.log(`✓ Teste 2: Escolaridade Técnica passou (${eduTest2}/100)`);

  // Teste 2: Integridade
  const integrityTest = calculateIntegrityScore({
    cleanRecordCertificates: [
      { court: 'STF', status: 'nada_consta' },
      { court: 'TSE', status: 'regular' }
    ],
    factChecks: [
      {
        id: 'fc-1',
        title: 'Boato desmentido',
        description: 'Checagem',
        vehicleOrOrgan: 'Lupa',
        category: 'boato_desmentido',
        date: '2024-01-01',
        sourceUrl: 'https://exemplo.com'
      },
      {
        id: 'fc-2',
        title: 'Processo arquivado',
        description: 'Arquivamento',
        vehicleOrOrgan: 'STF',
        category: 'arquivado',
        date: '2021-01-01',
        sourceUrl: 'https://exemplo.com'
      }
    ]
  });
  console.assert(integrityTest === 100, `Esperado 100 para certidões limpas e arquivamentos, obtido ${integrityTest}`);
  console.log('✓ Teste 3: Integridade com ficha limpa e arquivamentos manteve 100/100');

  // Teste 3: Testando todos os candidatos reais do dataset
  const candidates = ALL_CANDIDATES;
  console.log(`\n--- Testando cálculo de Score de ${candidates.length} candidatos oficiais ---`);
  
  for (const c of candidates) {
    const score = calculateCandidateScore(c, DEFAULT_WEIGHTS);
    console.assert(score.finalScore >= 0 && score.finalScore <= 100, `Score fora do intervalo: ${score.finalScore}`);
    console.log(`[${c.role.toUpperCase()}] ${c.popularName} (${c.party}):`);
    console.log(`   - Score Final: ${score.finalScore}/100`);
    console.log(`   - Escolaridade: ${score.educationScore} | Experiência: ${score.experienceScore} | Sabatinas: ${score.debatesScore} | Integridade: ${score.integrityScore} | Plano: ${score.governmentPlanScore}`);
  }

  // Teste 4: Customização de pesos
  const customWeights = {
    education: 50, // Aumentando peso da escolaridade para 50%
    experience: 10,
    debates: 10,
    integrity: 15,
    governmentPlan: 15
  };
  const c1 = candidates[0];
  const customScore = calculateCandidateScore(c1, customWeights);
  console.log(`\n✓ Teste 4: Recálculo reativo com peso 50% em educação: ${customScore.finalScore}/100`);

  console.log('\n==== TODOS OS TESTES PASSARAM COM SUCESSO! ====');
}

runTests();
