# Changelog - Registro de Atualizações e Decisões

Todas as alterações notáveis deste projeto são documentadas neste arquivo.

## [2.3.0] - 2026-10-23
### Adicionado
- **Atualização das Pesquisas Oficiais de 2º Turno (Outubro/2026 — `/segundo-turno` e `/pesquisas`):**
  - Inclusão dos levantamentos pós-1º turno registrados no PesqEle/TSE em `src/data/second-round-2026.json` e `src/data/polls/presidential-polls.json`:
    - **Datafolha (`BR-07943/2026`)** — 15 a 17/10/2026;
    - **Quaest (`BR-02883/2026`)** — 14 a 16/10/2026;
    - **Paraná Pesquisas (`BR-06564/2026`)** — 13 a 16/10/2026;
    - **AtlasIntel (`BR-06165/2026`)** — 12 a 15/10/2026;
    - **Real Time Big Data (`BR-08005/2026`)** — 12 a 14/10/2026.
  - Novo painel interativo de **Evolução do 2º Turno Presidencial** dentro de `PollsAggregatorView.vue` (`/pesquisas`), exibindo lado a lado os cenários de 2º turno (`secondRoundScenarios`) e de 1º turno (`scenarios`).
- **Expansão Multi-Fonte do Pipeline de Web Scraping (`scripts/scrape-news.ts` & `.github/workflows/update-news.yml`):**
  - Coleta direta em feeds institucionais da **Agência Senado**, **Agência Câmara** e **Agência Brasil (EBC)** somada às buscas segmentadas do Google News RSS.
  - Monitoramento dedicado de matérias sobre pesquisas registradas de 2º turno no TSE e atualização da frequência do Cron no GitHub Actions para a cada **6 horas** (`0 */6 * * *`) com auditoria automática `npm run sync:tse`.
- **Documentação Estratégica e Arquitetural Completa (`doc/`):**
  - Criação do documento [`doc/PLANO_CRESCIMENTO_MANDATO_E_MONETIZACAO.md`](./PLANO_CRESCIMENTO_MANDATO_E_MONETIZACAO.md) detalhando o panorama competitivo no Brasil, a evolução para o **Observatório Permanente de Mandatos (2027–2030)**, a blindagem jurídica via Open Source e os 4 modelos éticos de monetização (Apoio Cidadão, Plano Pro B2B, Newsletter e Grants).
  - Revisão integral de [`doc/ARQUITETURA.md`](./ARQUITETURA.md) com diagramas de fluxo, **Arquitetura de Dados Híbrida (JSON + Supabase PostgreSQL)** e os **7 Design Patterns** aplicados no código.

### Corrigido
- **Correção Definitiva de Navegação entre Abas e Renderização Inicial (`ScoreGauge.vue`, `App.vue`, `AppSidebar.vue`, `EconomicTrendChart.vue`, `presidente.json`):**
  - Corrigido crash silencioso em `ScoreGauge.vue` (`safeScore` com `Number.isFinite`) quando `mandateScore` estava ausente, que interrompia a montagem de `HomeView.vue` e corrompia o VNode do `<RouterView>`.
  - Restaurados `mandateScore`, `auditorSynthesis` e as séries completas de `economicIndicators` (`pibGrowth`, `inflationIpca`, `unemploymentRate`, `publicDebtGdpRatio`, `primaryFiscalBalance`) em `src/data/federal/presidente.json` e adicionada proteção contra séries vazias em `EconomicTrendChart.vue`.
  - Substituído `<transition mode="out-in">` no `<router-view>` de `App.vue` por `<router-view :key="$route.fullPath" />` e convertidos os botões de navegação de `AppSidebar.vue` em `<RouterLink>` nativos, garantindo transição imediata e zero exceções em todas as 10 rotas.

---

## [2.2.0] - 2026-10-16
### Adicionado
- **Arquitetura de Navegação Senior UI/UX (Notion / Jira Collapsible Sidebar):**
  - Criação do componente `AppSidebar.vue`:
    - Alternância suave entre modo recolhido (`w-16` / 64px - trilho de ícones) e expandido (`w-64` / 256px - texto completo, badges e agrupamentos).
    - Persistência automática da preferência do usuário via `localStorage` (`voto_consciente_sidebar_collapsed`).
    - *Hover Peek / Tooltips flutuantes* com teletransporte (`Teleport to body`) no modo recolhido, permitindo saber instantaneamente o destino do ícone sem precisar expandir a barra.
    - Seções categorizadas: *Principal* (Início), *Eleições 2026* (2º Turno com pulse de urgência, Eleitos 27 UFs, Pesquisas TSE), *Cargos & Candidatos* (Presidente, Governador SP, Senadores SP, Deputados Bauru) e *Auditoria & Metodologia* (Mandato Atual, Comparador com badge de contagem, Fontes Oficiais, Pesos).
    - Modo *Drawer Mobile* responsivo com backdrop escuro translúcido.
  - Criação do componente `AppHeader.vue`:
    - Barra superior fixa com Breadcrumbs contextuais, seletor rápido de UF, acionadores de Comparador, Fontes Confiáveis e Pesos, alternador Dark/Light mode e Busca Global.
  - **Barra de Busca Global Inteligente (`AppHeader.vue`):**
    - Atalho de teclado universal `Ctrl+K` ou `/` para focar imediatamente na busca de qualquer tela.
    - Dropdown de resultados em tempo real com foto oficial, partido, cargo e score geral em pontos, com redirecionamento direto para o perfil do candidato (`/candidato/:id`).

### Corrigido & Otimizado
- **Eliminação de Scroll Horizontal (`overflow-x`):**
  - Aplicação estrita de `overflow-x: hidden`, `max-width: 100vw` e `width: 100%` no `html`, `body` e `#app` (`src/assets/styles/main.css`).
  - Remoção de margens negativas e contenção de glows absolutos com `overflow-hidden`.
  - Inclusão de `min-w-0` em containers flex e grids para prevenir estouro de largura.
- **Eliminação de Scroll Vertical Excessivo & Espaçamentos Desproporcionais:**
  - Redução das margens e paddings excessivos na Home (`space-y-16 pb-12` -> `space-y-8 md:space-y-10 pb-8`) e no Rodapé (`mt-20 py-12` -> `mt-10 py-8`).
  - Eliminação do duplo container de padding (`max-w-7xl px-8`) entre `App.vue` e as views.
- **Correção da Home View sem Dados / Falhas de Renderização (`HomeView.vue`):**
  - Corrigido erro de importação de ícone ausente (`Award` da biblioteca `lucide-vue-next`).
  - Ajustado cálculo de `topCandidates` para ordenar decrescentemente por `breakdown.finalScore`, garantindo que os cards de candidatos com maior aptidão apareçam imediatamente na inicialização.
- **Navegação 100% Funcional e Fluida:**
  - Botões do Header e Sidebar integrados nativamente com `vue-router`, garantindo transições suaves sem recarregar a aplicação e com suporte a atalhos de teclado.

---

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
- **Componente Resiliente de Avatar Institucional (`src/components/shared/CandidateAvatar.vue`):**
  - Criação de componente padronizado com fallback automático (`@error`), bloqueio de URLs genéricas de banco de imagens (Unsplash) e monograma partidário institucional com número de urna.
- **Script de Auditoria Automatizada de Dados e Fontes (`scripts/sync-tse.ts` • `npm run sync:tse`):**
  - Validação automatizada de 100% dos candidatos, registros `tseVerification`, URLs de planos de governo, agências de fact-checking, promessas de campanha, cobertura das 27 UFs em `elected-2026.json`, pesquisas TSE e todas as notícias monitoradas.

### Corrigido & Removido
- **Blindagem da Camada Remota Supabase (`src/services/supabaseClient.ts` & `scripts/seed-supabase.ts`):**
  - `getCandidatesFromSupabase()` e `getLiveNews()` agora aplicam `validateCandidacyRole()`, `validateNewsArticle()` e filtro contra a base local homologada (`ALL_CANDIDATES`), impedindo que registros legados no banco remoto reintroduzam pré-candidatos retirados.
  - Adicionado `DELETE` explícito de IDs obsoletos em `scripts/seed-supabase.ts` e `scripts/scrape-news.ts`.
- **Remoção de Fotos Genéricas (Unsplash) e Links Quebrados (404):**
  - Substituídas todas as 109 URLs de fotos genéricas do Unsplash em `src/data/elected-2026.json` e URLs quebradas do Wikimedia pelo `CandidateAvatar.vue` institucional.
- **100% de Cobertura `tseVerification` e Deep Links Oficiais:**
  - Adicionado `tseVerification` completo em todos os 19 dossiês da plataforma (Federal e SP) e substituídas URLs genéricas de raiz por deep links diretos (`divulgacandcontas.tse.jus.br`, `pesqele.tse.jus.br`, `tce.sp.gov.br`, `senado.leg.br`, `camara.leg.br`).
- **Atualização Integral da Corrida Presidencial 2026 com Apuração Oficial do TSE (`src/data/federal/presidente.json` & `src/data/second-round-2026.json`):**
  - Removidos Tarcísio de Freitas (que disputou a reeleição ao Governo de SP e venceu no 1º turno com 62,65%), Ciro Gomes (que não foi candidato em 2026), Ratinho Júnior (Governador do PR) e Jair Bolsonaro (inelegível pelo TSE) da relação de candidatos a Presidente da República.
  - Cadastrados os candidatos presidenciais reais do pleito de 04/10/2026: **Flávio Bolsonaro (PL - 22, 2º Turno — 47,03% / 56.104.503 votos)**, **Luiz Inácio Lula da Silva (PT - 13, 2º Turno — 45,16% / 53.879.538 votos)**, **Augusto Cury (Avante - 70, 2,89%)**, **Renan Santos (Missão - 14, 2,24%)**, **Ronaldo Caiado (PSD - 55, 2,18%)** e **Romeu Zema (NOVO - 30, 0,27%)**.
- **Atualização dos Eleitos Reais de 04/10/2026 nas 27 UFs (`src/data/elected-2026.json` & `src/data/estados/sp/*.json`):**
  - Sincronizados os Governadores eleitos no 1º turno (21 estados, incluindo Tarcísio de Freitas em SP com 62,65%, Cleitinho em MG, Sergio Moro no PR, Luciano Zucco no RS, Douglas Ruas no RJ, Jerônimo Rodrigues na BA, Raquel Lyra em PE, Elmano no CE, Daniel Vilela em GO), os 6 estados em 2º turno (AM, DF, ES, RN, TO, AC) e todos os **54 Senadores eleitos** (incluindo Guilherme Derrite e André do Prado em SP).
- **Purificação do Pipeline de Notícias (`scripts/scrape-news.ts` & `src/data/live-news.json`):**
  - Expurgadas notícias residuais de candidaturas especulativas e sincronizadas notícias verificadas para os candidatos reais de 2026.
- **Correção de Entidades HTML (`&bull;`):**
  - Substituição de `&bull;` literal por caractere Unicode `•` em `currentOfficeNote` e componentes Vue.

---

## [2.0.0] - 2026-10-15
### Adicionado
- **Módulo Especial: 2º Turno Presidencial 2026 (`src/views/SecondRoundView.vue` • `/segundo-turno`):**
  - Placar agregado de intenção de Votos Válidos e Votos Totais.
  - Compilação das pesquisas pós-1º turno registradas no TSE em Outubro/2026.
  - Indicadores de rejeição, resultado oficial proclamado do 1º turno (04/10/2026), apoios de governadores estaduais e comparativo temático frente a frente em 6 áreas estratégicas.
- **Página Nacional de Candidatos Eleitos em Todas as 27 UFs (`src/views/ElectedCandidatesView.vue` • `/eleitos`):**
  - Base completa (`src/data/elected-2026.json`) cobrindo os 26 estados e o Distrito Federal (**109 mandatários**: Governadores, os 54 Senadores eleitos em 04/10/2026 e Deputados Federais de destaque).
  - Filtros por Região, Estado (UF), Cargo e busca por palavra-chave de proposta com cartões expansíveis de compromissos para 2027–2030/2035.
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
