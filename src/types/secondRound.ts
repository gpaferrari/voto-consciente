export interface SecondRoundPoll {
  id: string;
  institute: 'Datafolha' | 'Quaest' | 'AtlasIntel' | 'Paraná Pesquisas';
  tseRegistration: string;
  releaseDate: string;
  fieldStartDate: string;
  fieldEndDate: string;
  sampleSize: number;
  marginOfError: number;
  contractor: string;
  methodology: string;
  validVotes: {
    lula: number;
    tarcisio: number;
  };
  totalVotes: {
    lula: number;
    tarcisio: number;
    blankNull: number;
    undecided: number;
  };
  rejection: {
    lula: number;
    tarcisio: number;
  };
  regionalBreakdown?: {
    region: 'Sudeste' | 'Nordeste' | 'Sul' | 'Norte' | 'Centro-Oeste';
    lula: number;
    tarcisio: number;
  }[];
  sourceUrl: string;
}

export interface ProposalComparison {
  theme: 'Economia & Renda' | 'Segurança Pública' | 'Saúde & SUS' | 'Educação' | 'Reforma Tributária & Fiscal' | 'Meio Ambiente';
  icon: string;
  lulaProposal: {
    title: string;
    description: string;
    keyPoints: string[];
  };
  tarcisioProposal: {
    title: string;
    description: string;
    keyPoints: string[];
  };
}

export interface FirstRoundResult {
  candidateId: string;
  candidateName: string;
  popularName: string;
  party: string;
  votes: number;
  percentage: number;
  status: 'classificado_2_turno' | 'eliminado_1_turno';
  endorsement?: string; // Apoio declarado no 2º turno
  color: string;
}
