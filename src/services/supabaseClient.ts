import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Candidate } from '../types/candidate';
import type { PollSurvey } from '../types/polling';
import { ALL_CANDIDATES } from '../data/registry';
import { validateCandidacyRole, validateNewsArticle } from './sourceValidator';
import presidentialPollsData from '../data/polls/presidential-polls.json';
import spPollsData from '../data/polls/sp-polls.json';
import liveNewsData from '../data/live-news.json';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface LiveNewsItem {
  id: string;
  candidateId: string;
  candidateName: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'proposta' | 'gestao' | 'juridico' | 'declaracao' | 'pesquisa';
  summary?: string;
}

const VALID_CANDIDATE_IDS = new Set(ALL_CANDIDATES.map(c => c.id));

/**
 * Helper genérico para carregar dados do Supabase com fallback garantido para os JSONs locais
 */
export async function fetchWithFallback<T>(
  supabaseQuery: () => Promise<{ data: T | null; error: any }>,
  fallbackData: T
): Promise<T> {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackData;
  }

  try {
    const { data, error } = await supabaseQuery();
    if (error || !data) {
      console.warn('[Supabase] Erro ao carregar dados remotos, utilizando fallback local:', error?.message);
      return fallbackData;
    }
    return data;
  } catch (err: any) {
    console.warn('[Supabase] Falha de conexão, utilizando fallback local:', err?.message);
    return fallbackData;
  }
}

/**
 * Carrega notícias monitoradas em tempo real do Supabase (com filtro estrito de fontes confiáveis e fallback local)
 */
export async function getLiveNews(limit = 100, candidateId?: string): Promise<LiveNewsItem[]> {
  const rawFallback = liveNewsData as unknown as LiveNewsItem[];
  const filteredFallback = rawFallback.filter(item =>
    (!candidateId || item.candidateId === candidateId) &&
    VALID_CANDIDATE_IDS.has(item.candidateId) &&
    validateNewsArticle(item).isApproved
  );

  return fetchWithFallback(async () => {
    let query = supabase!
      .from('noticias_monitoradas')
      .select('*')
      .order('data_publicacao', { ascending: false });

    if (candidateId) {
      query = query.eq('candidato_id', candidateId);
    }
    if (limit) {
      query = query.limit(limit * 2);
    }

    const { data, error } = await query;
    if (error) return { data: null, error };
    if (!data || data.length === 0) return { data: null, error: new Error('Nenhum dado retornado') };

    const mapped: LiveNewsItem[] = data
      .map((item: any) => ({
        id: item.id,
        candidateId: item.candidato_id,
        candidateName: item.nome_candidato,
        title: item.titulo,
        source: item.veiculo,
        url: item.url_noticia,
        publishedAt: item.data_publicacao,
        category: item.categoria,
        summary: item.resumo || undefined
      }))
      // Guardrail: só aceita candidatos homologados ativos e fontes confiáveis aprovadas
      .filter((item: LiveNewsItem) =>
        VALID_CANDIDATE_IDS.has(item.candidateId) &&
        validateNewsArticle(item).isApproved
      )
      .slice(0, limit);

    if (mapped.length === 0) {
      return { data: filteredFallback.slice(0, limit), error: null };
    }

    return { data: mapped, error: null };
  }, filteredFallback.slice(0, limit));
}

/**
 * Carrega pesquisas eleitorais registradas no TSE do Supabase (com cenários e resultados detalhados)
 */
export async function getPolls(targetOffice: 'presidente' | 'governador'): Promise<PollSurvey[]> {
  const fallback = (targetOffice === 'presidente' ? presidentialPollsData : spPollsData) as unknown as PollSurvey[];
  return fetchWithFallback(async () => {
    const { data, error } = await supabase!
      .from('pesquisas_eleitorais')
      .select(`
        *,
        scenarios:pesquisas_cenarios (
          *,
          results:pesquisas_resultados (*)
        )
      `)
      .eq('cargo_alvo', targetOffice)
      .order('data_divulgacao', { ascending: false });

    if (error) return { data: null, error };
    if (!data || data.length === 0) return { data: null, error: new Error('Nenhuma pesquisa encontrada') };

    const mapped: PollSurvey[] = data.map((p: any) => ({
      id: p.id,
      tseRegistration: p.registro_tse,
      institute: p.instituto,
      fieldStartDate: p.data_campo_inicio,
      fieldEndDate: p.data_campo_fim,
      releaseDate: p.data_divulgacao,
      sampleSize: p.amostra,
      marginOfError: Number(p.margem_erro),
      confidenceLevel: p.nivel_confianca || 95,
      contractor: p.contratante,
      methodology: p.metodologia,
      targetOffice: p.cargo_alvo,
      state: p.estado,
      sourceUrl: p.url_fonte,
      scenarios: (p.scenarios || []).map((sc: any) => ({
        id: sc.id,
        title: sc.titulo,
        type: sc.tipo,
        blankNull: Number(sc.votos_brancos_nulos || 0),
        undecided: Number(sc.indecisos || 0),
        results: (sc.results || []).map((r: any) => ({
          candidateId: r.candidato_id,
          candidateName: r.nome_candidato,
          party: r.partido,
          percentage: Number(r.percentual),
          color: r.cor_hex || '#3b82f6'
        }))
      }))
    }));

    // Garantir que as pesquisas de 2º Turno locais também estejam presentes se o banco remoto ainda não as tiver sincronizado
    const existingIds = new Set(mapped.map(m => m.id));
    for (const localPoll of fallback) {
      if (!existingIds.has(localPoll.id)) {
        mapped.unshift(localPoll);
      }
    }

    return { data: mapped, error: null };
  }, fallback);
}

/**
 * Carrega a base completa de candidatos do Supabase com validação estrita TSE/IFCN e fallback local
 */
export async function getCandidatesFromSupabase(): Promise<Candidate[]> {
  const fallback = ALL_CANDIDATES;
  return fetchWithFallback(async () => {
    const { data, error } = await supabase!
      .from('candidatos')
      .select(`
        *,
        candidatos_cargos_historico (*),
        certidoes_judiciais (*),
        fatos_checados (*),
        planos_governo_pilares (*)
      `);

    if (error) return { data: null, error };
    if (!data || data.length === 0) return { data: null, error: new Error('Nenhum candidato retornado') };

    const localMap = new Map(ALL_CANDIDATES.map(c => [c.id, c]));

    // Guardrail Crítico: Filtrar apenas candidatos homologados presentes no registro local e aprovados pelo sourceValidator
    const validRemoteRows = data.filter((cand: any) => {
      if (!localMap.has(cand.id)) return false;
      const roleCheck = validateCandidacyRole(cand.nome_completo || cand.nome_popular, cand.cargo);
      return roleCheck.isValidForRole;
    });

    const mapped: Candidate[] = validRemoteRows.map((cand: any) => {
      const local = localMap.get(cand.id)!;
      const rawNote = local.currentOfficeNote || cand.nota_institucional || '';

      return {
        id: cand.id,
        name: cand.nome_completo || local.name,
        popularName: cand.nome_popular || local.popularName,
        photoUrl: local.photoUrl || cand.foto_url || '',
        role: local.role || cand.cargo,
        party: local.party || cand.partido,
        ballotNumber: local.ballotNumber || cand.numero_urna,
        coalition: local.coalition || cand.coligacao || '',
        age: local.age || cand.idade,
        cityOrigin: local.cityOrigin || cand.cidade_origem,
        state: local.state || cand.estado,
        currentOfficeNote: rawNote.replace(/&bull;/g, '•'),
        declaredAssets: Number(local.declaredAssets || cand.patrimonio_declarado || 0),
        education: local.education || {
          level: cand.escolaridade_nivel,
          institution: cand.escolaridade_instituicao || '',
          course: cand.escolaridade_curso || '',
          details: cand.escolaridade_detalhes || '',
          complementaryCourses: cand.escolaridade_cursos_complementares || []
        },
        experience: {
          yearsInPublicService: local.experience?.yearsInPublicService || cand.anos_vida_publica || 0,
          summary: local.experience?.summary || cand.resumo_experiencia || '',
          roles: (local.experience?.roles && local.experience.roles.length > 0)
            ? local.experience.roles
            : (cand.candidatos_cargos_historico || []).map((h: any) => ({
                title: h.titulo,
                period: h.periodo,
                level: h.esfera,
                achievements: h.entregas || []
              })),
          legislativeStats: local.experience?.legislativeStats || ((cand.projetos_apresentados > 0 || cand.projetos_aprovados > 0) ? {
            billsProposed: cand.projetos_apresentados || 0,
            billsApproved: cand.projetos_aprovados || 0,
            attendanceRate: Number(cand.assiduidade_plenario || 0),
            parliamentaryQuotaSpentYearlyAvg: Number(cand.cota_parlamentar_anual || 0)
          } : undefined)
        },
        debatesAndInterviews: local.debatesAndInterviews || {
          averageScore: Number(cand.sabatinas_media_score || 80),
          events: []
        },
        integrityAndFacts: local.integrityAndFacts || {
          cleanRecordCertificates: (cand.certidoes_judiciais || []).map((cert: any) => ({
            court: cert.orgao_emissor || cert.tipo_certidao,
            status: cert.status
          })),
          factChecks: (cand.fatos_checados || []).map((f: any) => ({
            id: f.id,
            title: f.titulo,
            description: f.descricao,
            vehicleOrOrgan: f.veiculo_ou_orgao,
            category: f.categoria,
            date: f.data_fato,
            sourceUrl: f.url_fonte,
            judicialLevel: f.numero_processo || undefined
          }))
        },
        governmentPlan: local.governmentPlan || {
          summary: cand.plano_resumo || '',
          pdfUrl: cand.plano_pdf_url || '',
          pillars: (cand.planos_governo_pilares || []).map((p: any) => ({
            key: p.chave,
            title: p.titulo,
            icon: p.icone || 'FileText',
            mainGoal: p.meta_principal,
            proposals: p.propostas || [],
            budgetSource: p.fonte_orcamento,
            feasibilityScore: Number(p.viabilidade_score || 0)
          }))
        },
        mandateEvaluation: local.mandateEvaluation,
        tseVerification: local.tseVerification
      };
    });

    // Garantir que candidatos locais recém-adicionados (como tarcisio-presidente) nunca fiquem de fora se ainda não estiverem no Supabase
    const mappedIds = new Set(mapped.map(c => c.id));
    for (const localCand of ALL_CANDIDATES) {
      if (!mappedIds.has(localCand.id)) {
        mapped.push(localCand);
      }
    }

    return { data: mapped, error: null };
  }, fallback);
}
