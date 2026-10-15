export type RegionType = 'Sudeste' | 'Sul' | 'Nordeste' | 'Centro-Oeste' | 'Norte';
export type OfficeType = 'governador' | 'senador' | 'deputado_federal';
export type ElectionStatus = 'eleito_1_turno' | 'disputa_2_turno';

export interface ElectedProposal {
  category: 'economia' | 'saude' | 'educacao' | 'seguranca' | 'infraestrutura' | 'social' | 'meio_ambiente' | 'reformas';
  categoryLabel: string;
  title: string;
  description: string;
}

export interface ElectedOfficial {
  id: string;
  name: string;
  popularName: string;
  photoUrl: string;
  office: OfficeType;
  officeLabel: string;
  state: string; // UF (SP, RJ, MG, etc.)
  stateName: string;
  region: RegionType;
  party: string;
  ballotNumber: string;
  votes: number;
  votePercentage: number;
  status: ElectionStatus;
  statusLabel: string;
  keyCommitmentSummary: string;
  proposals: ElectedProposal[];
  cleanRecordStatus: 'regular' | 'nada_consta' | 'com_apontamentos';
  cleanRecordNote?: string;
}

export interface StateSummary {
  uf: string;
  name: string;
  region: RegionType;
  governorStatus: ElectionStatus;
  totalVoters: number;
  officials: ElectedOfficial[];
}
