import { Candidate, RoleType } from '../types/candidate';

import presidenteData from './federal/presidente.json';
import spGovernadorData from './estados/sp/governador.json';
import spSenadorData from './estados/sp/senador.json';
import spDeputadosData from './estados/sp/deputados.json';

export interface StateInfo {
  uf: string;
  name: string;
  available: boolean;
  notes?: string;
}

export const SUPPORTED_STATES: StateInfo[] = [
  { uf: 'SP', name: 'São Paulo', available: true },
  { uf: 'RJ', name: 'Rio de Janeiro', available: false, notes: 'Em cadastramento' },
  { uf: 'MG', name: 'Minas Gerais', available: false, notes: 'Em cadastramento' },
  { uf: 'PR', name: 'Paraná', available: false, notes: 'Em cadastramento' },
  { uf: 'GO', name: 'Goiás', available: false, notes: 'Em cadastramento' }
];

export const ALL_CANDIDATES: Candidate[] = [
  ...(presidenteData as unknown as Candidate[]),
  ...(spGovernadorData as unknown as Candidate[]),
  ...(spSenadorData as unknown as Candidate[]),
  ...(spDeputadosData as unknown as Candidate[])
];

export function getAllCandidates(): Candidate[] {
  return ALL_CANDIDATES;
}

export function getCandidatesByRole(role: RoleType): Candidate[] {
  return ALL_CANDIDATES.filter(c => c.role === role);
}

export function getCandidatesByState(stateUf: string): Candidate[] {
  return ALL_CANDIDATES.filter(c => c.state?.toUpperCase() === stateUf.toUpperCase());
}

export function getPresidentCandidates(): Candidate[] {
  return ALL_CANDIDATES.filter(c => c.role === 'presidente');
}
