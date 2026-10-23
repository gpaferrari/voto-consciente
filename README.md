# Voto Consciente | Plataforma Apartidária de Dados Oficiais, Eleitos 2026, Auditoria de Mandato & Score de Candidatos

Plataforma web moderna, minimalista, open-source e apartidária para avaliação, acompanhamento do **2º Turno Presidencial 2026**, consulta aos **Candidatos Eleitos nas 27 UFs**, **Auditoria Contínua de Mandatos** e comparação analítica de candidatos aos poderes Executivo e Legislativo, orientada estritamente por **dados oficiais da República** (TSE DivulgaCandContas, PesqEle, IBGE, Banco Central, STF, TCU, Câmara e Senado) e agências de checagem certificadas pela **IFCN** (International Fact-Checking Network).

---

## 🏛️ Características e Módulos Principais

1. **Módulo Especial: 2º Turno Presidencial 2026 (`/segundo-turno`):**
   - Placar agregado de intenção de **Votos Válidos** e **Votos Totais** com base nas pesquisas oficiais registradas no TSE pós-1º turno (Datafolha `BR-07943/2026`, Quaest `BR-02883/2026`, Paraná Pesquisas `BR-06564/2026`, AtlasIntel `BR-06165/2026` e Real Time Big Data `BR-08005/2026`).
   - Monitoramento de taxas de rejeição, resultado oficial proclamado do 1º turno (04/10/2026) e **Painel de Apoios Políticos Declarados** por governadores estaduais e lideranças.
   - **Comparativo Frente a Frente de Propostas:** Análise lado a lado dos planos registrados no TSE em 6 eixos estratégicos (Economia, Segurança Pública, Saúde, Educação, Reforma Tributária e Meio Ambiente).

2. **Candidatos Eleitos 2026 em Todos os 27 Estados (`/eleitos`):**
   - Cobertura nacional completa das **27 Unidades Federativas** (26 Estados + Distrito Federal) com **109 mandatários eleitos**.
   - Consulta aos Governadores eleitos, Senadores da República (54 vagas renovadas em 04/10/2026 para o mandato 2027–2035) e Deputados Federais de destaque, incluindo suas propostas e compromissos registrados na Justiça Eleitoral.
   - Filtros rápidos por Região (Sudeste, Sul, Nordeste, Centro-Oeste, Norte), UF, Cargo e busca textual por propostas.

3. **Central de Validação de Fontes Confiáveis (`sourceValidator.ts` & Modal Interativo):**
   - **Validador Estrito de Candidaturas (`validateCandidacyRole`):** Garante que apenas candidatos com registro formal homologado no **DivulgaCandContas/TSE** figurem na disputa. Bloqueia candidaturas especulativas e sinaliza inelegibilidades proclamadas pelo TSE.
   - **Validador de Pesquisas (`validateTseRegistration`):** Verifica o padrão oficial `BR-XXXXX/2026` ou `UF-XXXXX/2026` (Resolução TSE nº 23.600/2019) com link direto ao sistema **PesqEle/TSE**.
   - **Validador de URLs e Notícias (`validateSourceUrl` & `validateNewsArticle`):** Whitelist rigorosa de órgãos oficiais, agências IFCN (*Agência Lupa, Aos Fatos, Comprova, Estadão Verifica, G1 Fato ou Fake*) e imprensa profissional, bloqueando blogs anônimos e clickbait.
   - **Testador Interativo na UI:** Qualquer eleitor pode clicar em **"Fontes Oficiais"** no cabeçalho ou na barra lateral e testar links ou códigos TSE em tempo real.

4. **Índice de Aptidão Eleitoral (Score 0-100 Personalizável):**
   - **Escolaridade & Formação Acadêmica:** Dados cadastrais oficiais do TSE e pós-graduações.
   - **Experiência de Gestão:** Histórico de mandatos, cargos públicos e assiduidade parlamentar.
   - **Sabatinas & Debates:** Avaliação analítica e precisão factual verificada em entrevistas.
   - **Integridade & Ficha Limpa:** Certidões negativas de tribunais superiores e ausência de condenações colegiadas.
   - **Viabilidade do Plano de Governo:** Metas claras, fontes de financiamento declaradas e coerência fiscal.

5. **Auditoria do Mandato Atual (`/mandato-atual`) & Agregador de Pesquisas (`/pesquisas`):**
   - Acompanhamento de promessas de campanha e evolução de indicadores macroeconômicos oficiais (PIB/IBGE, IPCA/Bacen, Desemprego/PNAD Contínua, Dívida Bruta/PIB e Resultado Primário).
   - Séries históricas completas de pesquisas eleitorais de 1º e 2º turnos com margens de erro auditáveis.

6. **Navegação App Shell (Notion / Jira Collapsible Sidebar) & Busca Global (`Ctrl+K`):**
   - Barra lateral recolhível (`AppSidebar.vue`) com *Hover Peek* e *Drawer Mobile*, combinada com cabeçalho fixo (`AppHeader.vue`), busca instantânea de candidatos e transição determinística de rotas (`<router-view :key="$route.fullPath" />`).

7. **Automação Contínua (GitHub Actions a cada 6h) & Backend Híbrido (Supabase + Fallback Offline):**
   - Workflow automatizado (`.github/workflows/update-news.yml`) que coleta notícias verificadas (Google News RSS, Agência Senado, Agência Câmara e Agência Brasil/EBC), audita integridade via `npm run sync:tse`, atualiza o banco **Supabase (PostgreSQL)** e mantém fallback local instantâneo (`fetchWithFallback`) para disponibilidade de 100% (zero downtime).

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js v18+ (recomendado Node 20 ou 22+)
- npm

### Instalação e Desenvolvimento
```bash
# Instalar dependências
npm install

# Iniciar servidor local com hot-reload (http://localhost:5173)
npm run dev
```

### Scripts de Automação, Scraping e Validação
```bash
# Executar pipeline de ingestão de notícias com filtro de fontes confiáveis (TSE/IFCN/Agências Públicas)
npm run scrape:news

# Popular/sincronizar banco de dados Supabase
npm run db:seed

# Rodar testes do motor de pontuação
npm run test:scoring

# Validar integridade dos dossiês, links e esquemas territoriais TSE
npm run sync:tse

# Build de produção (TypeScript + Vite)
npm run build
```

---

## 📂 Documentação Técnica, Jurídica e Estratégica

Consulte a pasta [`doc/`](./doc/) para especificações detalhadas (atualizadas em 23 de Outubro de 2026):
- [`doc/ARQUITETURA.md`](./doc/ARQUITETURA.md): Arquitetura de software em camadas, **Arquitetura de Dados Híbrida (JSON + Supabase)**, **7 Design Patterns aplicados** e pipeline de scraping/CI-CD.
- [`doc/PLANO_CRESCIMENTO_MANDATO_E_MONETIZACAO.md`](./doc/PLANO_CRESCIMENTO_MANDATO_E_MONETIZACAO.md): Panorama competitivo no Brasil, roadmap do **Observatório Permanente de Mandatos (2027–2030)**, blindagem jurídica Open Source e modelos éticos de monetização (B2C e B2B).
- [`doc/FONTES_OFICIAIS_E_METODOLOGIA.md`](./doc/FONTES_OFICIAIS_E_METODOLOGIA.md): Catálogo completo de fontes oficiais, whitelists (TSE, IFCN, IBGE, Bacen) e metodologia de validação.
- [`doc/CHANGELOG.md`](./doc/CHANGELOG.md): Histórico completo de versões (`v1.0.0` a `v2.3.0`) e decisões técnicas.
- [`doc/DIRETRIZES_IA_ATUALIDADE.md`](./doc/DIRETRIZES_IA_ATUALIDADE.md): Protocolo mandatório de verificação no TSE e vedação absoluta de candidaturas especulativas.
- [`doc/COMPLIANCE_E_AVISO_LEGAL.md`](./doc/COMPLIANCE_E_AVISO_LEGAL.md): Termo de salvaguarda jurídica, CF/88, LAI (Lei 12.527/2011) e conformidade com o Art. 33 da Lei 9.504/97.
- [`doc/MANUAL_DE_EXPANSAO_ESTADOS.md`](./doc/MANUAL_DE_EXPANSAO_ESTADOS.md): Guia para expansão de dados estaduais e municipais nas 27 UFs.
