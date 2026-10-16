export interface SecondRoundPoll {
  id: string;
  institute: 'Datafolha' | 'Quaest' | 'AtlasIntel' | 'Paraná Pesquisas' | 'CNT/MDA' | 'PoderData' | 'Futura';
  tseRegistration: string;
  releaseDate: string;
  fieldStartDate: string;
  fieldEndDate: string;
  sampleSize: number;
  marginOfError: number;
  contractor: string;
  methodology: string;
  validVotes: {
    flavio: number;
    lula: number;
  };
  totalVotes: {
    flavio: number;
    lula: number;
    blankNull: number;
    undecided: number;
  };
  rejection: {
    flavio: number;
    lula: number;
  };
  regionalBreakdown?: {
    region: 'Sudeste' | 'Nordeste' | 'Sul' | 'Norte' | 'Centro-Oeste';
    flavio: number;
    lula: number;
  }[];
  sourceUrl: string;
}

export interface ProposalComparison {
  theme: 'Economia & Renda' | 'Segurança Pública' | 'Saúde & SUS' | 'Educação' | 'Reforma Tributária & Fiscal' | 'Meio Ambiente';
  icon: string;
  flavioProposal: {
    title: string;
    description: string;
    keyPoints: string[];
  };
  lulaProposal: {
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
  endorsement?: string;
  color: string;
}

export interface GovernorEndorsement {
  governorName: string;
  state: string;
  party: string;
  position: string;
  declaredAt: string;
  pactThemes: string;
}
