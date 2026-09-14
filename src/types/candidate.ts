export type RoleType = 'presidente' | 'governador_sp' | 'senador' | 'deputado_federal_bauru';

export type EducationLevel = 
  | 'fundamental'
  | 'medio'
  | 'superior_incompleto'
  | 'superior_completo'
  | 'pos_graduacao'
  | 'mestrado'
  | 'doutorado';

export type FactCategory = 
  | 'comprovado_positivo'
  | 'condenacao_judicial'
  | 'investigacao_em_curso'
  | 'boato_desmentido'
  | 'arquivado';

export interface FactCheckItem {
  id: string;
  title: string;
  description: string;
  vehicleOrOrgan: string;
  category: FactCategory;
  date: string;
  sourceUrl: string;
  judicialLevel?: string;
}

export interface GovPlanPillar {
  key: 'economia' | 'educacao' | 'saude' | 'seguranca' | 'social' | 'infraestrutura' | 'meio_ambiente';
  title: string;
  icon: string;
  mainGoal: string;
  proposals: string[];
  budgetSource: string;
  feasibilityScore: number; // 0 a 100
}

export interface PromiseItem {
  id: string;
  title: string;
  category: string;
  status: 'cumprida' | 'em_andamento' | 'nao_cumprida';
  details: string;
  sourceUrl: string;
}

export interface MandateEvaluation {
  mandatePeriod: string;
  promisesStats: {
    total: number;
    fulfilled: number;
    inProgress: number;
    notFulfilled: number;
  };
  promisesList: PromiseItem[];
  economicIndicators: {
    pibGrowth: { year: number; value: number; benchmark?: number }[];
    inflationIpca: { year: number; value: number; target: number }[];
    unemploymentRate: { year: number; value: number }[];
    primaryFiscalBalance: { year: number; value: number; label: string }[];
    publicDebtGdpRatio: { year: number; value: number }[];
  };
  socialAndEducationIndicators: {
    idebScore: { year: number; value: number; target: number }[];
    socialProgramsInvestment: { year: number; valueInBillions: number; beneficiariesMillions: number }[];
  };
  mandateScore: number; // 0-100
  auditorSynthesis: string;
}

export interface Candidate {
  id: string;
  name: string;
  popularName: string;
  photoUrl: string;
  role: RoleType;
  party: string;
  ballotNumber: string;
  coalition: string;
  age: number;
  cityOrigin?: string;
  state?: string;
  currentOfficeNote?: string;
  declaredAssets: number; // R$
  education: {
    level: EducationLevel;
    institution: string;
    course: string;
    details: string;
    complementaryCourses: string[];
  };
  experience: {
    yearsInPublicService: number;
    summary: string;
    roles: {
      title: string;
      period: string;
      level: 'municipal' | 'estadual' | 'federal';
      achievements: string[];
    }[];
    legislativeStats?: {
      billsProposed: number;
      billsApproved: number;
      attendanceRate: number; // %
      parliamentaryQuotaSpentYearlyAvg: number; // R$
    };
  };
  debatesAndInterviews: {
    averageScore: number; // 0-100
    events: {
      title: string;
      date: string;
      vehicle: string;
      score: number;
      notes: string;
      factCheckingAccuracy: number; // %
    }[];
  };
  integrityAndFacts: {
    cleanRecordCertificates: {
      court: string;
      status: 'nada_consta' | 'regular' | 'com_apontamentos';
    }[];
    factChecks: FactCheckItem[];
  };
  governmentPlan: {
    summary: string;
    pdfUrl: string;
    pillars: GovPlanPillar[];
  };
  mandateEvaluation?: MandateEvaluation;
}

export interface ScoreWeights {
  education: number;      // Padrão: 20
  experience: number;     // Padrão: 25
  debates: number;        // Padrão: 15
  integrity: number;      // Padrão: 20
  governmentPlan: number; // Padrão: 20
}

export interface ScoreBreakdown {
  educationScore: number;
  experienceScore: number;
  debatesScore: number;
  integrityScore: number;
  governmentPlanScore: number;
  mandateScore?: number;
  finalScore: number;
}
