import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Candidate } from '../types/candidate';
import type { PollSurvey } from '../types/polling';
import { ALL_CANDIDATES } from '../data/registry';
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
 * Carrega notícias monitoradas em tempo real do Supabase (com fallback para live-news.json)
 */
export async function getLiveNews(limit = 100, candidateId?: string): Promise<LiveNewsItem[]> {
  const fallback = liveNewsData as unknown as LiveNewsItem[];
  return fetchWithFallback(async () => {
    let query = supabase!
      .from('noticias_monitoradas')
      .select('*')
      .order('data_publicacao', { ascending: false });

    if (candidateId) {
      query = query.eq('candidato_id', candidateId);
    }
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) return { data: null, error };
    if (!data) return { data: null, error: new Error('Nenhum dado retornado') };

    const mapped: LiveNewsItem[] = data.map((item: any) => ({
      id: item.id,
      candidateId: item.candidato_id,
      candidateName: item.nome_candidato,
      title: item.titulo,
      source: item.veiculo,
      url: item.url_noticia,
      publishedAt: item.data_publicacao,
      category: item.categoria,
      summary: item.resumo || undefined
    }));

    return { data: mapped, error: null };
  }, fallback);
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

    return { data: mapped, error: null };
  }, fallback);
}

/**
 * Carrega a base completa de candidatos do Supabase com suas tabelas filhas relacionais
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

    const mapped: Candidate[] = data.map((cand: any) => {
      const local = localMap.get(cand.id);

      return {
        id: cand.id,
        name: cand.nome_completo,
        popularName: cand.nome_popular,
        photoUrl: cand.foto_url || local?.photoUrl || '',
        role: cand.cargo,
        party: cand.partido,
        ballotNumber: cand.numero_urna,
        coalition: cand.coligacao || '',
        age: cand.idade,
        cityOrigin: cand.cidade_origem || local?.cityOrigin,
        state: cand.estado,
        currentOfficeNote: cand.nota_institucional || local?.currentOfficeNote,
        declaredAssets: Number(cand.patrimonio_declarado || 0),
        education: {
          level: cand.escolaridade_nivel,
          institution: cand.escolaridade_instituicao || '',
          course: cand.escolaridade_curso || '',
          details: cand.escolaridade_detalhes || '',
          complementaryCourses: cand.escolaridade_cursos_complementares || []
        },
        experience: {
          yearsInPublicService: cand.anos_vida_publica || 0,
          summary: cand.resumo_experiencia || '',
          roles: (cand.candidatos_cargos_historico && cand.candidatos_cargos_historico.length > 0)
            ? cand.candidatos_cargos_historico.map((h: any) => ({
                title: h.titulo,
                period: h.periodo,
                level: h.esfera,
                achievements: h.entregas || []
              }))
            : (local?.experience?.roles || []),
          legislativeStats: (cand.projetos_apresentados > 0 || cand.projetos_aprovados > 0) ? {
            billsProposed: cand.projetos_apresentados || 0,
            billsApproved: cand.projetos_aprovados || 0,
            attendanceRate: Number(cand.assiduidade_plenario || 0),
            parliamentaryQuotaSpentYearlyAvg: Number(cand.cota_parlamentar_anual || 0)
          } : local?.experience?.legislativeStats
        },
        debatesAndInterviews: {
          averageScore: Number(cand.sabatinas_media_score || local?.debatesAndInterviews?.averageScore || 80),
          events: local?.debatesAndInterviews?.events || []
        },
        integrityAndFacts: {
          cleanRecordCertificates: (cand.certidoes_judiciais && cand.certidoes_judiciais.length > 0)
            ? cand.certidoes_judiciais.map((cert: any) => ({
                court: cert.orgao_emissor || cert.tipo_certidao,
                status: cert.status
              }))
            : (local?.integrityAndFacts?.cleanRecordCertificates || []),
          factChecks: (cand.fatos_checados && cand.fatos_checados.length > 0)
            ? cand.fatos_checados.map((f: any) => ({
                id: f.id,
                title: f.titulo,
                description: f.descricao,
                vehicleOrOrgan: f.veiculo_ou_orgao,
                category: f.categoria,
                date: f.data_fato,
                sourceUrl: f.url_fonte,
                judicialLevel: f.numero_processo || undefined
              }))
            : (local?.integrityAndFacts?.factChecks || [])
        },
        governmentPlan: {
          summary: cand.plano_resumo || local?.governmentPlan?.summary || '',
          pdfUrl: cand.plano_pdf_url || local?.governmentPlan?.pdfUrl || '',
          pillars: (cand.planos_governo_pilares && cand.planos_governo_pilares.length > 0)
            ? cand.planos_governo_pilares.map((p: any) => ({
                key: p.chave,
                title: p.titulo,
                icon: p.icone || 'FileText',
                mainGoal: p.meta_principal,
                proposals: p.propostas || [],
                budgetSource: p.fonte_orcamento,
                feasibilityScore: Number(p.viabilidade_score || 0)
              }))
            : (local?.governmentPlan?.pillars || [])
        },
        mandateEvaluation: local?.mandateEvaluation
      };
    });

    return { data: mapped, error: null };
  }, fallback);
}
