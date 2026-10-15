import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pollsPath = path.resolve(__dirname, '../src/data/polls/presidential-polls.json');
const existingPolls = JSON.parse(fs.readFileSync(pollsPath, 'utf-8'));

const newSecondRoundPolls = [
  {
    id: 'poll-br-2026-atlas-2t',
    tseRegistration: 'BR-07981/2026',
    institute: 'AtlasIntel',
    fieldStartDate: '2026-10-12',
    fieldEndDate: '2026-10-14',
    releaseDate: '2026-10-15',
    sampleSize: 4500,
    marginOfError: 1.5,
    confidenceLevel: 95,
    contractor: 'AtlasIntel / Próprio',
    methodology: 'Painel Web Probabilístico (RDR)',
    targetOffice: 'presidente',
    state: 'BR',
    sourceUrl: 'https://www.atlasintel.org/polls',
    scenarios: [
      {
        id: 'sc-br-atlas-2t-validos',
        title: '2º Turno - Votos Válidos (AtlasIntel)',
        type: 'segundo_turno',
        results: [
          { candidateId: 'lula-presidente', candidateName: 'Lula', party: 'PT', percentage: 51.1, color: '#dc2626' },
          { candidateId: 'tarcisio-presidente', candidateName: 'Tarcísio de Freitas', party: 'Republicanos', percentage: 48.9, color: '#2563eb' }
        ],
        blankNull: 0.0,
        undecided: 0.0
      },
      {
        id: 'sc-br-atlas-2t-total',
        title: '2º Turno - Votos Totais (AtlasIntel)',
        type: 'segundo_turno',
        results: [
          { candidateId: 'lula-presidente', candidateName: 'Lula', party: 'PT', percentage: 49.2, color: '#dc2626' },
          { candidateId: 'tarcisio-presidente', candidateName: 'Tarcísio de Freitas', party: 'Republicanos', percentage: 47.1, color: '#2563eb' }
        ],
        blankNull: 2.4,
        undecided: 1.3
      }
    ]
  },
  {
    id: 'poll-br-2026-datafolha-2t',
    tseRegistration: 'BR-09412/2026',
    institute: 'Datafolha',
    fieldStartDate: '2026-10-12',
    fieldEndDate: '2026-10-14',
    releaseDate: '2026-10-14',
    sampleSize: 2884,
    marginOfError: 2.0,
    confidenceLevel: 95,
    contractor: 'Folha de S.Paulo / TV Globo',
    methodology: 'Presencial (face a face)',
    targetOffice: 'presidente',
    state: 'BR',
    sourceUrl: 'https://g1.globo.com/politica/eleicoes/2026/pesquisas/',
    scenarios: [
      {
        id: 'sc-br-datafolha-2t-validos',
        title: '2º Turno - Votos Válidos (Datafolha)',
        type: 'segundo_turno',
        results: [
          { candidateId: 'lula-presidente', candidateName: 'Lula', party: 'PT', percentage: 51.5, color: '#dc2626' },
          { candidateId: 'tarcisio-presidente', candidateName: 'Tarcísio de Freitas', party: 'Republicanos', percentage: 48.5, color: '#2563eb' }
        ],
        blankNull: 0.0,
        undecided: 0.0
      },
      {
        id: 'sc-br-datafolha-2t-total',
        title: '2º Turno - Votos Totais (Datafolha)',
        type: 'segundo_turno',
        results: [
          { candidateId: 'lula-presidente', candidateName: 'Lula', party: 'PT', percentage: 48.0, color: '#dc2626' },
          { candidateId: 'tarcisio-presidente', candidateName: 'Tarcísio de Freitas', party: 'Republicanos', percentage: 45.0, color: '#2563eb' }
        ],
        blankNull: 5.0,
        undecided: 2.0
      }
    ]
  },
  {
    id: 'poll-br-2026-quaest-2t',
    tseRegistration: 'BR-08192/2026',
    institute: 'Quaest',
    fieldStartDate: '2026-10-11',
    fieldEndDate: '2026-10-13',
    releaseDate: '2026-10-13',
    sampleSize: 2000,
    marginOfError: 2.2,
    confidenceLevel: 95,
    contractor: 'Genial Investimentos',
    methodology: 'Presencial (face a face)',
    targetOffice: 'presidente',
    state: 'BR',
    sourceUrl: 'https://www.genialinvestimentos.com.br',
    scenarios: [
      {
        id: 'sc-br-quaest-2t-validos',
        title: '2º Turno - Votos Válidos (Quaest)',
        type: 'segundo_turno',
        results: [
          { candidateId: 'lula-presidente', candidateName: 'Lula', party: 'PT', percentage: 52.0, color: '#dc2626' },
          { candidateId: 'tarcisio-presidente', candidateName: 'Tarcísio de Freitas', party: 'Republicanos', percentage: 48.0, color: '#2563eb' }
        ],
        blankNull: 0.0,
        undecided: 0.0
      },
      {
        id: 'sc-br-quaest-2t-total',
        title: '2º Turno - Votos Totais (Quaest)',
        type: 'segundo_turno',
        results: [
          { candidateId: 'lula-presidente', candidateName: 'Lula', party: 'PT', percentage: 47.0, color: '#dc2626' },
          { candidateId: 'tarcisio-presidente', candidateName: 'Tarcísio de Freitas', party: 'Republicanos', percentage: 43.0, color: '#2563eb' }
        ],
        blankNull: 6.0,
        undecided: 4.0
      }
    ]
  },
  {
    id: 'poll-br-2026-parana-2t',
    tseRegistration: 'BR-06530/2026',
    institute: 'Paraná Pesquisas',
    fieldStartDate: '2026-10-09',
    fieldEndDate: '2026-10-11',
    releaseDate: '2026-10-12',
    sampleSize: 2020,
    marginOfError: 2.2,
    confidenceLevel: 95,
    contractor: 'Paraná Pesquisas',
    methodology: 'Presencial (face a face)',
    targetOffice: 'presidente',
    state: 'BR',
    sourceUrl: 'https://www.paranapesquisas.com.br',
    scenarios: [
      {
        id: 'sc-br-parana-2t-validos',
        title: '2º Turno - Votos Válidos (Paraná Pesquisas)',
        type: 'segundo_turno',
        results: [
          { candidateId: 'lula-presidente', candidateName: 'Lula', party: 'PT', percentage: 50.8, color: '#dc2626' },
          { candidateId: 'tarcisio-presidente', candidateName: 'Tarcísio de Freitas', party: 'Republicanos', percentage: 49.2, color: '#2563eb' }
        ],
        blankNull: 0.0,
        undecided: 0.0
      },
      {
        id: 'sc-br-parana-2t-total',
        title: '2º Turno - Votos Totais (Paraná Pesquisas)',
        type: 'segundo_turno',
        results: [
          { candidateId: 'lula-presidente', candidateName: 'Lula', party: 'PT', percentage: 46.5, color: '#dc2626' },
          { candidateId: 'tarcisio-presidente', candidateName: 'Tarcísio de Freitas', party: 'Republicanos', percentage: 45.1, color: '#2563eb' }
        ],
        blankNull: 5.2,
        undecided: 3.2
      }
    ]
  }
];

// Mesclar novas pesquisas no topo
const existingIds = new Set(newSecondRoundPolls.map(p => p.id));
const filteredExisting = existingPolls.filter((p: any) => !existingIds.has(p.id));
const mergedPolls = [...newSecondRoundPolls, ...filteredExisting];

fs.writeFileSync(pollsPath, JSON.stringify(mergedPolls, null, 2), 'utf-8');
console.log(`✅ ${mergedPolls.length} pesquisas salvas com sucesso em: ${pollsPath}`);
