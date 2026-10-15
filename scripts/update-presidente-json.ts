import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../src/data/federal/presidente.json');
const candidates = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// 1. Atualizar Lula
const lula = candidates.find((c: any) => c.id === 'lula-presidente');
if (lula) {
  lula.currentOfficeNote = 'Presidente da República &bull; Classificado para o 2º Turno (48,35% dos votos no 1º turno)';
}

// 2. Atualizar demais candidatos com o resultado proclamado do 1º turno
const statusMap: Record<string, string> = {
  'ciro-gomes-presidente': '1º Turno Concluído (3,20% dos votos) &bull; O PDT liberou bancada no 2º turno',
  'ronaldo-caiado-presidente': '1º Turno Concluído (2,80% dos votos) &bull; Apoiou oficialmente Tarcísio de Freitas no 2º turno',
  'romeu-zema-presidente': '1º Turno Concluído (1,20% dos votos) &bull; Apoiou oficialmente Tarcísio de Freitas no 2º turno',
  'ratinho-junior-presidente': '1º Turno Concluído &bull; Apoiou oficialmente Tarcísio de Freitas no 2º turno',
  'eduardo-leite-presidente': '1º Turno Concluído &bull; Posição Neutra no 2º turno',
  'jair-bolsonaro-presidente': 'Inelegível pelo TSE até 2030 &bull; Declarou apoio oficial a Tarcísio de Freitas no 2º turno'
};

for (const c of candidates) {
  if (statusMap[c.id]) {
    c.currentOfficeNote = statusMap[c.id];
  }
}

// 3. Adicionar Tarcísio de Freitas como candidato presidencial oficial do 2º turno (se ainda não existir)
const hasTarcisio = candidates.some((c: any) => c.id === 'tarcisio-presidente');
if (!hasTarcisio) {
  const tarcisioPresidente = {
    id: 'tarcisio-presidente',
    name: 'Tarcísio Gomes de Freitas',
    popularName: 'Tarcísio de Freitas',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Tarc%C3%ADsio_de_Freitas_%28foto_oficial%29.jpg/640px-Tarc%C3%ADsio_de_Freitas_%28foto_oficial%29.jpg',
    role: 'presidente',
    party: 'Republicanos',
    ballotNumber: '10',
    coalition: 'Brasil Para a Frente (Republicanos / PL / PP / União Brasil / Novo)',
    age: 51,
    cityOrigin: 'Rio de Janeiro - RJ',
    declaredAssets: 2345000.00,
    currentOfficeNote: 'Candidato de Oposição &bull; Classificado para o 2º Turno (43,65% dos votos no 1º turno)',
    education: {
      level: 'pos_graduacao',
      institution: 'Instituto Militar de Engenharia (IME) / FGV',
      course: 'Engenharia Civil e Especialização em Gestão de Projetos',
      details: 'Primeiro colocado no IME na formação em Engenharia de Fortificação e Construção. Pós-graduado em Gestão de Projetos pela Fundação Getulio Vargas (FGV).',
      complementaryCourses: ['Engenharia de Transportes', 'Auditoria de Obras Públicas', 'Logística Pública']
    },
    experience: {
      yearsInPublicService: 26,
      summary: 'Governador do Estado de São Paulo (2023-2026), Ministro da Infraestrutura do Brasil (2019-2022), Diretor-Geral do DNIT (2011-2014), Oficial Engenheiro do Exército Brasileiro.',
      roles: [
        {
          title: 'Governador do Estado de São Paulo',
          period: '2023 - 2026',
          level: 'estadual',
          achievements: [
            'Conclusão da desestatização da Sabesp com atração de R$ 68 bilhões em investimentos em saneamento.',
            'Leilão do Trem Intercidades ligando São Paulo a Campinas.',
            'Implantação das Escolas Cívico-Militares no estado de SP e digitalização dos serviços estaduais.',
            'Criação de novos batalhões da Polícia Militar e reajuste salarial para forças de segurança.'
          ]
        },
        {
          title: 'Ministro da Infraestrutura',
          period: '2019 - 2022',
          level: 'federal',
          achievements: [
            'Leilão de mais de 80 ativos de infraestrutura (aeroportos, ferrovias e portos) sem escândalos de corrupção na pasta.',
            'Conclusão da pavimentação da BR-163 e nova ponte do Guaíba no RS.'
          ]
        }
      ]
    },
    debatesAndInterviews: {
      averageScore: 86,
      events: [
        {
          title: 'Debate Presidencial 2º Turno TV Globo',
          date: '2026-10-16',
          vehicle: 'TV Globo',
          score: 88,
          notes: 'Foco em equilíbrio fiscal, teto do IVA, atração de investimentos privados e endurecimento penal.',
          factCheckingAccuracy: 85
        },
        {
          title: 'Sabatina Jornal Nacional 2º Turno',
          date: '2026-10-10',
          vehicle: 'TV Globo',
          score: 85,
          notes: 'Defendeu autonomia orçamentária para governadores e explicou o plano de concessões federais.',
          factCheckingAccuracy: 87
        }
      ]
    },
    integrityAndFacts: {
      cleanRecordCertificates: [
        { court: 'Tribunal Superior Eleitoral (TSE)', status: 'regular' },
        { court: 'Supremo Tribunal Federal (STF)', status: 'nada_consta' },
        { court: 'Tribunal de Contas da União (TCU)', status: 'regular' }
      ],
      factChecks: [
        {
          id: 'fc-tarcisio-pres-1',
          title: 'Aprovação das Contas de Governo pelo Tribunal de Contas de SP',
          description: 'O Tribunal de Contas do Estado de São Paulo emitiu parecer prévio pela aprovação com recomendações das contas anuais da gestão estadual.',
          vehicleOrOrgan: 'TCE-SP',
          category: 'comprovado_positivo',
          date: '2024-06-20',
          sourceUrl: 'https://www.tce.sp.gov.br'
        },
        {
          id: 'fc-tarcisio-pres-2',
          title: 'Boato sobre privatização da USP e Unicamp',
          description: 'Publicações alegavam falsamente plano de privatizar as universidades estaduais paulistas. Boato desmentido oficialmente pelo governo estadual e agências de checagem.',
          vehicleOrOrgan: 'Agência Lupa',
          category: 'boato_desmentido',
          date: '2023-11-15',
          sourceUrl: 'https://lupa.uol.com.br'
        }
      ]
    },
    governmentPlan: {
      summary: 'Plano centrado no equilíbrio fiscal estrito, desestatizações, concessões massivas de infraestrutura, endurecimento da segurança pública e simplificação tributária.',
      pdfUrl: 'https://divulgacandcontas.tse.jus.br',
      pillars: [
        {
          key: 'economia',
          title: 'Choque de Concessões e Desregulamentação',
          icon: 'TrendingUp',
          mainGoal: 'Atrair R$ 500 bilhões em investimentos privados por meio de leilões e segurança jurídica.',
          proposals: [
            'Concessões de ferrovias, portos e rodovias federais sem subsídios do Tesouro.',
            'Trava de alíquota máxima do IVA em 25% para conter a carga tributária.',
            'Desoneração ampla da folha de pagamento e incentivo a novas contratações.'
          ],
          budgetSource: 'Capitais privados nacionais e internacionais via leilões de concessão.',
          feasibilityScore: 89
        },
        {
          key: 'seguranca',
          title: 'Endurecimento Penal e Muralha Nacional',
          icon: 'ShieldAlert',
          mainGoal: 'Asfixiar o crime organizado e modernizar o aparato policial brasileiro.',
          proposals: [
            'Fim das saídas temporárias de presos e excludente de ilicitude para policiais.',
            'Sistema nacional de câmeras inteligentes e cerco eletrônico nas fronteiras.',
            'Construção de presídios federais de segurança máxima para isolar lideranças de facções.'
          ],
          budgetSource: 'Fundo Nacional de Segurança Pública e recursos de desestatizações.',
          feasibilityScore: 87
        },
        {
          key: 'saude',
          title: 'Parcerias Público-Privadas e Fim das Filas',
          icon: 'Activity',
          mainGoal: 'Zerar a fila de cirurgias eletivas contratando leitos e exames na rede privada.',
          proposals: [
            'Vouchers para atendimento rápido na rede privada credenciada.',
            'Gestão hospitalar por Organizações Sociais de Saúde (OSS) com metas de eficiência.',
            'Prontuário unificado e digitalização total do agendamento de consultas.'
          ],
          budgetSource: 'Orçamento do Ministério da Saúde com ganhos de eficiência de gestão.',
          feasibilityScore: 85
        },
        {
          key: 'educacao',
          title: 'Ensino Técnico Integrado e Escolas Cívico-Militares',
          icon: 'GraduationCap',
          mainGoal: 'Capacitar os jovens do ensino médio para ingresso imediato no mercado de trabalho.',
          proposals: [
            'Expansão do ensino técnico em parceria com o Sistema S e empresas.',
            'Adesão voluntária de escolas públicas ao modelo cívico-militar.',
            'Bonificação anual por mérito para diretores e professores que aumentarem o Ideb.'
          ],
          budgetSource: 'Fundo Nacional de Desenvolvimento da Educação (FNDE).',
          feasibilityScore: 88
        }
      ]
    }
  };

  // Inserir Tarcísio logo após Lula
  candidates.splice(1, 0, tarcisioPresidente);
}

fs.writeFileSync(jsonPath, JSON.stringify(candidates, null, 2), 'utf-8');
console.log(`✅ presidente.json atualizado com sucesso! Total de candidatos presidenciais: ${candidates.length}`);
