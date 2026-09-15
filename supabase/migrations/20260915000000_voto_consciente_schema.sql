-- ==============================================================================
-- VOTO CONSCIENTE - ESQUEMA DE BANCO DE DADOS & ANÁLISE DE DADOS ELEITORAIS
-- Supabase / PostgreSQL 15+
-- ==============================================================================

-- 1. Habilitar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABELAS PRINCIPAIS
-- ==============================================================================

-- Tabela de Candidatos Oficiais
CREATE TABLE IF NOT EXISTS public.candidatos (
    id TEXT PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    nome_popular TEXT NOT NULL,
    foto_url TEXT,
    cargo TEXT NOT NULL CHECK (cargo IN ('presidente', 'governador_sp', 'senador', 'deputado_federal_bauru')),
    estado TEXT DEFAULT 'BR',
    partido TEXT NOT NULL,
    numero_urna TEXT NOT NULL,
    coligacao TEXT,
    idade INTEGER,
    cidade_origem TEXT,
    patrimonio_declarado NUMERIC(15, 2) DEFAULT 0,
    nota_institucional TEXT,
    
    -- Escolaridade e Formação
    escolaridade_nivel TEXT NOT NULL,
    escolaridade_instituicao TEXT,
    escolaridade_curso TEXT,
    escolaridade_detalhes TEXT,
    escolaridade_cursos_complementares TEXT[] DEFAULT '{}',
    
    -- Experiência
    anos_vida_publica INTEGER DEFAULT 0,
    resumo_experiencia TEXT,
    
    -- Estatísticas Parlamentares (quando aplicável)
    projetos_apresentados INTEGER DEFAULT 0,
    projetos_aprovados INTEGER DEFAULT 0,
    assiduidade_plenario NUMERIC(5, 2) DEFAULT 0,
    cota_parlamentar_anual NUMERIC(12, 2) DEFAULT 0,
    
    -- Sabatinas e Entrevistas
    sabatinas_media_score NUMERIC(5, 2) DEFAULT 0,
    
    -- Plano de Governo
    plano_resumo TEXT,
    plano_pdf_url TEXT,
    
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Histórico de Cargos e Mandatos Anteriores
CREATE TABLE IF NOT EXISTS public.candidatos_cargos_historico (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    candidato_id TEXT NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    periodo TEXT NOT NULL,
    esfera TEXT NOT NULL CHECK (esfera IN ('federal', 'estadual', 'municipal')),
    entregas TEXT[] DEFAULT '{}',
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Certidões Judiciais e Ficha Limpa (TSE, STF, TJ, TRF, TCE)
CREATE TABLE IF NOT EXISTS public.certidoes_judiciais (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    candidato_id TEXT NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
    tipo_certidao TEXT NOT NULL,
    orgao_emissor TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('regular', 'nada_consta', 'com_apontamento', 'pendente')),
    data_emissao DATE,
    codigo_verificacao TEXT,
    url_validacao TEXT,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Fatos Verificados, Decisões Judiciais & Notícias Oficiais
CREATE TABLE IF NOT EXISTS public.fatos_checados (
    id TEXT PRIMARY KEY,
    candidato_id TEXT NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    veiculo_ou_orgao TEXT NOT NULL,
    categoria TEXT NOT NULL CHECK (categoria IN ('comprovado_positivo', 'esclarecido', 'comprovado_negativo', 'arquivado', 'boato_desmentido')),
    data_fato DATE NOT NULL,
    url_fonte TEXT NOT NULL,
    numero_processo TEXT,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Pilares Descomplicados do Plano de Governo
CREATE TABLE IF NOT EXISTS public.planos_governo_pilares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    candidato_id TEXT NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
    chave TEXT NOT NULL,
    titulo TEXT NOT NULL,
    icone TEXT DEFAULT 'FileText',
    meta_principal TEXT NOT NULL,
    propostas TEXT[] NOT NULL DEFAULT '{}',
    fonte_orcamento TEXT NOT NULL,
    viabilidade_score NUMERIC(5, 2) DEFAULT 0,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Pesquisas Eleitorais Registradas no TSE
CREATE TABLE IF NOT EXISTS public.pesquisas_eleitorais (
    id TEXT PRIMARY KEY,
    registro_tse TEXT NOT NULL UNIQUE,
    instituto TEXT NOT NULL CHECK (instituto IN ('Datafolha', 'Quaest', 'AtlasIntel', 'Paraná Pesquisas', 'Ipec', 'Futura')),
    cargo_alvo TEXT NOT NULL CHECK (cargo_alvo IN ('presidente', 'governador', 'senador')),
    estado TEXT DEFAULT 'BR',
    data_campo_inicio DATE NOT NULL,
    data_campo_fim DATE NOT NULL,
    data_divulgacao DATE NOT NULL,
    amostra INTEGER NOT NULL,
    margem_erro NUMERIC(4, 2) NOT NULL,
    nivel_confianca NUMERIC(4, 1) DEFAULT 95.0,
    contratante TEXT NOT NULL,
    metodologia TEXT NOT NULL,
    url_fonte TEXT,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Cenários de Pesquisas (Estimulada, Espontânea, 2º Turno)
CREATE TABLE IF NOT EXISTS public.pesquisas_cenarios (
    id TEXT PRIMARY KEY,
    pesquisa_id TEXT NOT NULL REFERENCES public.pesquisas_eleitorais(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('estimulada', 'espontanea', 'segundo_turno')),
    votos_brancos_nulos NUMERIC(5, 2) DEFAULT 0,
    indecisos NUMERIC(5, 2) DEFAULT 0,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Resultados Nominais por Candidato em cada Cenário
CREATE TABLE IF NOT EXISTS public.pesquisas_resultados (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cenario_id TEXT NOT NULL REFERENCES public.pesquisas_cenarios(id) ON DELETE CASCADE,
    candidato_id TEXT NOT NULL,
    nome_candidato TEXT NOT NULL,
    partido TEXT NOT NULL,
    percentual NUMERIC(5, 2) NOT NULL,
    cor_hex TEXT DEFAULT '#3b82f6',
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Notícias Ingeridas via Web Scraping em Tempo Real
CREATE TABLE IF NOT EXISTS public.noticias_monitoradas (
    id TEXT PRIMARY KEY,
    candidato_id TEXT NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
    nome_candidato TEXT NOT NULL,
    titulo TEXT NOT NULL,
    veiculo TEXT NOT NULL,
    url_noticia TEXT NOT NULL,
    data_publicacao DATE NOT NULL,
    categoria TEXT NOT NULL CHECK (categoria IN ('proposta', 'gestao', 'juridico', 'declaracao', 'pesquisa')),
    resumo TEXT,
    capturado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. ÍNDICES DE PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_candidatos_cargo ON public.candidatos(cargo);
CREATE INDEX IF NOT EXISTS idx_candidatos_partido ON public.candidatos(partido);
CREATE INDEX IF NOT EXISTS idx_fatos_candidato ON public.fatos_checados(candidato_id);
CREATE INDEX IF NOT EXISTS idx_fatos_categoria ON public.fatos_checados(categoria);
CREATE INDEX IF NOT EXISTS idx_pesquisas_data ON public.pesquisas_eleitorais(data_divulgacao DESC);
CREATE INDEX IF NOT EXISTS idx_pesquisas_cargo ON public.pesquisas_eleitorais(cargo_alvo);
CREATE INDEX IF NOT EXISTS idx_noticias_candidato ON public.noticias_monitoradas(candidato_id);
CREATE INDEX IF NOT EXISTS idx_noticias_data ON public.noticias_monitoradas(data_publicacao DESC);

-- ==============================================================================
-- 4. VIEWS ANALÍTICAS DE DADOS ELEITORAIS
-- ==============================================================================

-- A) Média Móvel Ponderada de Intenção de Voto (Poll of Polls)
-- Pondera cada pesquisa pelo inverso da sua margem de erro (1 / margem)
CREATE OR REPLACE VIEW public.v_media_movel_pesquisas AS
SELECT 
    p.cargo_alvo,
    c.tipo AS tipo_cenario,
    r.candidato_id,
    r.nome_candidato,
    r.partido,
    r.cor_hex,
    ROUND(
        SUM(r.percentual * (1.0 / NULLIF(p.margem_erro, 0))) / 
        SUM(1.0 / NULLIF(p.margem_erro, 0)), 
        2
    ) AS media_ponderada,
    ROUND(AVG(r.percentual), 2) AS media_simples,
    COUNT(DISTINCT p.id) AS total_pesquisas_computadas,
    MAX(p.data_divulgacao) AS data_pesquisa_mais_recente
FROM public.pesquisas_resultados r
JOIN public.pesquisas_cenarios c ON c.id = r.cenario_id
JOIN public.pesquisas_eleitorais p ON p.id = c.pesquisa_id
GROUP BY p.cargo_alvo, c.tipo, r.candidato_id, r.nome_candidato, r.partido, r.cor_hex
ORDER BY p.cargo_alvo, media_ponderada DESC;

-- B) Perfil Analítico Integrado de Candidatos
CREATE OR REPLACE VIEW public.v_perfil_analitico_candidatos AS
SELECT 
    c.id,
    c.nome_popular,
    c.cargo,
    c.partido,
    c.idade,
    c.patrimonio_declarado,
    c.escolaridade_nivel,
    c.anos_vida_publica,
    c.sabatinas_media_score,
    COUNT(DISTINCT f.id) FILTER (WHERE f.categoria = 'comprovado_positivo') AS fatos_positivos,
    COUNT(DISTINCT f.id) FILTER (WHERE f.categoria = 'comprovado_negativo') AS fatos_negativos,
    COUNT(DISTINCT f.id) FILTER (WHERE f.categoria = 'esclarecido') AS fatos_esclarecidos,
    COUNT(DISTINCT cert.id) AS total_certidoes_regularizadas,
    COUNT(DISTINCT pil.id) AS total_pilares_plano,
    ROUND(AVG(pil.viabilidade_score), 1) AS media_viabilidade_plano
FROM public.candidatos c
LEFT JOIN public.fatos_checados f ON f.candidato_id = c.id
LEFT JOIN public.certidoes_judiciais cert ON cert.candidato_id = c.id AND cert.status IN ('regular', 'nada_consta')
LEFT JOIN public.planos_governo_pilares pil ON pil.candidato_id = c.id
GROUP BY c.id, c.nome_popular, c.cargo, c.partido, c.idade, c.patrimonio_declarado, c.escolaridade_nivel, c.anos_vida_publica, c.sabatinas_media_score;

-- C) Estatísticas de Notícias e Exposição na Mídia
CREATE OR REPLACE VIEW public.v_cobertura_imprensa_stats AS
SELECT 
    n.candidato_id,
    n.nome_candidato,
    COUNT(n.id) AS total_noticias_coletadas,
    COUNT(n.id) FILTER (WHERE n.categoria = 'proposta') AS noticias_propostas,
    COUNT(n.id) FILTER (WHERE n.categoria = 'gestao') AS noticias_gestao,
    COUNT(n.id) FILTER (WHERE n.categoria = 'juridico') AS noticias_juridico,
    COUNT(n.id) FILTER (WHERE n.categoria = 'pesquisa') AS noticias_pesquisas,
    MAX(n.data_publicacao) AS ultima_materia_publicada
FROM public.noticias_monitoradas n
GROUP BY n.candidato_id, n.nome_candidato
ORDER BY total_noticias_coletadas DESC;

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) - SEGURANÇA TOTAL & LEITURA PÚBLICA
-- ==============================================================================
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidatos_cargos_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certidoes_judiciais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fatos_checados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_governo_pilares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesquisas_eleitorais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesquisas_cenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesquisas_resultados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticias_monitoradas ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública (Qualquer visitante pode ler todos os dados)
CREATE POLICY "Leitura pública permitida para candidatos" ON public.candidatos FOR SELECT USING (true);
CREATE POLICY "Leitura pública permitida para histórico de cargos" ON public.candidatos_cargos_historico FOR SELECT USING (true);
CREATE POLICY "Leitura pública permitida para certidões judiciais" ON public.certidoes_judiciais FOR SELECT USING (true);
CREATE POLICY "Leitura pública permitida para fatos checados" ON public.fatos_checados FOR SELECT USING (true);
CREATE POLICY "Leitura pública permitida para pilares de plano de governo" ON public.planos_governo_pilares FOR SELECT USING (true);
CREATE POLICY "Leitura pública permitida para pesquisas eleitorais" ON public.pesquisas_eleitorais FOR SELECT USING (true);
CREATE POLICY "Leitura pública permitida para cenários de pesquisas" ON public.pesquisas_cenarios FOR SELECT USING (true);
CREATE POLICY "Leitura pública permitida para resultados de pesquisas" ON public.pesquisas_resultados FOR SELECT USING (true);
CREATE POLICY "Leitura pública permitida para notícias monitoradas" ON public.noticias_monitoradas FOR SELECT USING (true);
