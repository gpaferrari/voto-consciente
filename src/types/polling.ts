export interface PollCandidateResult {
  candidateId: string;
  candidateName: string;
  party: string;
  percentage: number;
  color?: string;
}

export interface PollScenario {
  id: string;
  title: string; // Ex: "1º Turno - Cenário Estimulado Principal", "Espontânea", "2º Turno: Lula vs Tarcísio"
  type: 'estimulada' | 'espontanea' | 'segundo_turno';
  results: PollCandidateResult[];
  blankNull: number; // Brancos / Nulos
  undecided: number; // Não sabem / Não responderam
}

export interface PollSurvey {
  id: string;
  tseRegistration: string; // Ex: "BR-09823/2026" ou "SP-04128/2026"
  institute: 'Datafolha' | 'Quaest' | 'AtlasIntel' | 'Paraná Pesquisas' | 'Ipec' | 'Futura';
  fieldStartDate: string; // YYYY-MM-DD
  fieldEndDate: string; // YYYY-MM-DD
  releaseDate: string; // YYYY-MM-DD
  sampleSize: number; // Ex: 2004
  marginOfError: number; // Ex: 2.0 (± 2.0 p.p.)
  confidenceLevel: number; // Ex: 95 (%)
  contractor: string; // Ex: "Folha de S.Paulo / TV Globo" ou "Genial Investimentos"
  methodology: 'Presencial (face a face)' | 'Telefônica (CATI)' | 'Painel Web Probabilístico (RDR)';
  targetOffice: 'presidente' | 'governador' | 'senador';
  state?: string; // "SP" ou "BR"
  sourceUrl: string; // Link para a matéria / relatório original do instituto
  scenarios: PollScenario[];
}

export interface PollAggregatePoint {
  date: string;
  institute: string;
  tseRegistration: string;
  candidates: { [candidateId: string]: number };
  blankNull: number;
  undecided: number;
}
