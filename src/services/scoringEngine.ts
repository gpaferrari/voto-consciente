import { Candidate, ScoreWeights, ScoreBreakdown, EducationLevel } from '../types/candidate';

export const DEFAULT_WEIGHTS: ScoreWeights = {
  education: 20,
  experience: 25,
  debates: 15,
  integrity: 20,
  governmentPlan: 20
};

export function calculateEducationScore(education: Candidate['education']): number {
  const baseMap: Record<EducationLevel, number> = {
    fundamental: 40,
    medio: 60,
    superior_incompleto: 72,
    superior_completo: 85,
    pos_graduacao: 90,
    mestrado: 95,
    doutorado: 100
  };

  let score = baseMap[education.level] || 60;
  
  // Bônus por cursos de capacitação técnica em gestão pública, finanças públicas e direito
  if (education.complementaryCourses && education.complementaryCourses.length > 0) {
    const bonus = Math.min(10, education.complementaryCourses.length * 3);
    score = Math.min(100, score + bonus);
  }

  return score;
}

export function calculateExperienceScore(experience: Candidate['experience']): number {
  let score = 0;
  
  // Anos de vida pública/gestão (até 45 pontos para 18+ anos)
  score += Math.min(45, experience.yearsInPublicService * 2.5);

  // Histórico de cargos relevantes (executivo/legislativo)
  const roleBonus = experience.roles.reduce((acc, r) => {
    let weight = 8;
    if (r.level === 'federal') weight = 12;
    else if (r.level === 'estadual') weight = 10;
    return acc + weight;
  }, 0);
  score += Math.min(40, roleBonus);

  // Produtividade parlamentar se houver
  if (experience.legislativeStats) {
    const stats = experience.legislativeStats;
    const attendanceScore = (stats.attendanceRate / 100) * 8; // até 8 pts
    const approvalBonus = Math.min(7, stats.billsApproved * 1.5); // até 7 pts
    score += attendanceScore + approvalBonus;
  } else {
    // Se não for parlamentar (ex: executivo puro), normaliza
    score += 15;
  }

  return Math.min(100, Math.round(score));
}

export function calculateDebatesScore(debates: Candidate['debatesAndInterviews']): number {
  if (!debates.events || debates.events.length === 0) {
    return debates.averageScore || 70;
  }

  // Média ponderada entre nota do debate e acurácia nas checagens factuais
  const total = debates.events.reduce((acc, item) => {
    const combined = (item.score * 0.6) + (item.factCheckingAccuracy * 0.4);
    return acc + combined;
  }, 0);

  return Math.round(total / debates.events.length);
}

export function calculateIntegrityScore(integrity: Candidate['integrityAndFacts']): number {
  let score = 100;

  for (const item of integrity.factChecks) {
    if (item.category === 'condenacao_judicial') {
      score -= 30;
    } else if (item.category === 'investigacao_em_curso') {
      // Pequeno desconto por cautela e transparência, mantendo presunção
      score -= 5;
    }
  }

  // Certidões negativas de tribunais superiores
  const issues = integrity.cleanRecordCertificates.filter(c => c.status === 'com_apontamentos').length;
  score -= issues * 10;

  return Math.max(0, Math.min(100, score));
}

export function calculateGovernmentPlanScore(plan: Candidate['governmentPlan']): number {
  if (!plan.pillars || plan.pillars.length === 0) return 60;
  
  const sum = plan.pillars.reduce((acc, p) => acc + (p.feasibilityScore || 70), 0);
  return Math.round(sum / plan.pillars.length);
}

export function calculateCandidateScore(
  candidate: Candidate, 
  weights: ScoreWeights = DEFAULT_WEIGHTS
): ScoreBreakdown {
  const educationScore = calculateEducationScore(candidate.education);
  const experienceScore = calculateExperienceScore(candidate.experience);
  const debatesScore = calculateDebatesScore(candidate.debatesAndInterviews);
  const integrityScore = calculateIntegrityScore(candidate.integrityAndFacts);
  const governmentPlanScore = calculateGovernmentPlanScore(candidate.governmentPlan);

  const totalWeight = weights.education + weights.experience + weights.debates + weights.integrity + weights.governmentPlan;

  const weightedSum = 
    (educationScore * weights.education) +
    (experienceScore * weights.experience) +
    (debatesScore * weights.debates) +
    (integrityScore * weights.integrity) +
    (governmentPlanScore * weights.governmentPlan);

  const finalScore = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 0;

  return {
    educationScore,
    experienceScore,
    debatesScore,
    integrityScore,
    governmentPlanScore,
    mandateScore: candidate.mandateEvaluation?.mandateScore,
    finalScore
  };
}
