# Changelog - Registro de Atualizações e Decisões

Todas as alterações notáveis deste projeto são documentadas neste arquivo.

## [2.1.0] - 2026-10-16
### Adicionado
- **Motor de Validação de Fontes Confiáveis (`src/services/sourceValidator.ts`):**
  - Implementação de whitelist oficial dividida em 4 níveis de autoridade: Órgãos Oficiais da República/TSE (Score 100), Agências de Fact-Checking certificadas pela IFCN (Score 95), Institutos Registrados no PesqEle/TSE (Score 90) e Imprensa Profissional de Referência (Score 85).
  - Funções `validateSourceUrl()`, `validateTseRegistration()`, `validateCandidacyRole()` e `validateNewsArticle()`.
- **Central Interativa de Validação de Fontes Confiáveis (`src/components/common/TrustedSourcesModal.vue`):**
  - Modal acessível pelo botão **"🛡️ Fontes Confiáveis"** na Navbar e na listagem de candidatos.
  - Possui **Validador Interativo em Tempo Real**, permitindo ao eleitor colar qualquer URL ou número de registro TSE (ex: `BR-09412/2026`) para auditar sua autenticidade na hora.
- **Selo de Homologação TSE nos Cards (`CandidateCard.vue`):**
  - Exibição do selo `Registro TSE: 2º TURNO / DEFERIDO` com dados estruturados em `candidate.tseVerification`.
- **Painel de Apoios Declarados de Governadores no 2º Turno (`SecondRoundView.vue`):**
  - Nova seção dedicada exclusivamente à articulação federativa e apoios formais de governadores estaduais para o 2º turno presidencial.

### Corrigido & Removido
- **Expurgo de Governadores Estaduais da Lista de Candidatos a Presidente (`src/data/federal/presidente.json`):**
  - Removidos Ratinho Júnior (Governador do PR), Ronaldo Caiado (Governador de GO), Romeu Zema (Governador de MG), Eduardo Leite (Governador do RS) e Jair Bolsonaro (inelegível pelo TSE) da relação de candidatos a Presidente da República.
  - Mantidos exclusivamente os candidatos presidenciais com registro homologado no TSE: Luiz Inácio Lula da Silva (PT - 13), Tarcísio de Freitas (Republicanos - 10) e Ciro Gomes (PDT - 12, 1º turno).
- **Purificação do Pipeline de Notícias (`scripts/scrape-news.ts` & `src/data/live-news.json`):**
  - Expurgadas 211 notícias residuais que vinculavam governadores estaduais à corrida presidencial.
  - Adicionado filtro estrito `isSourceTrusted()` e bloqueio anti-clickbait durante o scraping.
- **Correção de Entidades HTML (`&bull;`):**
  - Substituição de `&bull;` literal por caractere Unicode `•` em `currentOfficeNote` e componentes Vue.

---

## [2.0.0] - 2026-10-15
### Adicionado
- **Módulo Especial: 2º Turno Presidencial 2026 (`src/views/SecondRoundView.vue` • `/segundo-turno`):**
  - Placar agregado de intenção de Votos Válidos (Lula 51,4% vs Tarcísio de Freitas 48,6% — empate técnico) e Votos Totais.
  - Compilação das pesquisas pós-1º turno registradas no TSE em Outubro/2026: Datafolha (`BR-09412/2026`), Quaest (`BR-08192/2026`), AtlasIntel (`BR-07981/2026`) e Paraná Pesquisas (`BR-06530/2026`).
  - Indicadores de rejeição, resultado oficial proclamado do 1º turno e comparativo temático frente a frente em 6 áreas estratégicas.
- **Página Nacional de Candidatos Eleitos em Todas as 27 UFs (`src/views/ElectedCandidatesView.vue` • `/eleitos`):**
  - Base completa (`src/data/elected-2026.json`) cobrindo os 26 estados e o Distrito Federal (**109 mandatários eleitos**: Governadores, os 2 Senadores eleitos por estado e Deputados Federais de destaque).
  - Filtros por Região, Estado (UF), Cargo e busca por palavra-chave de proposta com cartões expansíveis de compromissos para 2027–2030/2034.
- **Destaques na Home e Navegação (`HomeView.vue` & `Navbar.vue`):**
  - Cards de acesso rápido e botões destacados para o `2º Turno 2026` e `Eleitos 2026 (27 UFs)`.

---

## [1.3.0] - 2026-10-02
### Adicionado
- **Integração Full-Stack com Supabase (PostgreSQL) & Fallback Offline (`src/services/supabaseClient.ts`):**
  - Migração SQL completa (`supabase/migrations/20260915000000_voto_consciente_schema.sql`) com tabelas para candidatos, cargos, pesquisas, cenários e notícias monitoradas.
  - Configuração de Row-Level Security (RLS) e `GRANT SELECT` explícitos em conformidade com as políticas de segurança da Data API do Supabase.
  - Função `fetchWithFallback()` que garante disponibilidade de 100% mesmo se o banco remoto estiver offline.
- **Automação Contínua via GitHub Actions (`.github/workflows/update-news.yml`):**
  - Cron job automatizado para atualizar notícias, sincronizar com o Supabase e manter a instância ativa.

---

## [1.2.0] - 2026-09-14
### Adicionado
- **Agregador Oficial de Pesquisas Eleitorais TSE (`/pesquisas`):**
  - Módulo de séries históricas de pesquisas registradas no TSE (`PollingTrackerChart.vue`).
- **Pipeline Inicial de Web Scraping (`scripts/scrape-news.ts` & `LiveNewsFeed.vue`).**
- **Ampliação da Base de Candidatos Estaduais e Parlamentares (SP e Bauru).**

---

## [1.1.0] - 2026-09-14
### Adicionado
- **Documentação de Arquitetura (`doc/`):** Separação por departamentos arquiteturais (`ARQUITETURA.md`) e manual de expansão de estados (`MANUAL_DE_EXPANSAO_ESTADOS.md`).
- **Segregação Territorial Federativa:** Estrutura `src/data/federal/` e `src/data/estados/sp/`, orquestrada por `registry.ts`.
- **Modal Reutilizável & Aviso Apartidário (`BaseModal.vue` & `DisclaimerModal.vue`).**

---

## [1.0.0] - 2026-09-14
### Adicionado
- Versão inicial da plataforma Voto Consciente com Vue 3, TypeScript, Tailwind CSS e Pinia.
- Motor de Scoring de 5 dimensões (Escolaridade, Experiência, Sabatinas, Integridade e Plano de Governo).
- Painel de auditoria do mandato atual com 60 promessas monitoradas e indicadores oficiais do IBGE e Banco Central.
- Comparador lado a lado de candidatos com sobreposição de radar.
