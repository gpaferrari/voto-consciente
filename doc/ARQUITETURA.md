# Documentação de Arquitetura do Sistema: Voto Consciente

Plataforma cívica, apartidária e baseada em evidências para avaliação analítica de candidatos aos poderes Executivo e Legislativo (Federal e Estadual), acompanhamento do **2º Turno Presidencial 2026** e consulta aos **Eleitos nas 27 Unidades Federativas**.

---

## 1. Departamentalização da Arquitetura

A aplicação é dividida em departamentos arquiteturais independentes, permitindo manutenção desacoplada, auditoria de fontes e escala nacional.

```
.github/
└── workflows/
    └── update-news.yml              # Automação CI/CD (Scraping diário & Keep-alive Supabase)
doc/
├── ARQUITETURA.md
├── CHANGELOG.md
├── COMPLIANCE_E_AVISO_LEGAL.md
├── DIRETRIZES_IA_ATUALIDADE.md
└── MANUAL_DE_EXPANSAO_ESTADOS.md
scripts/
├── scrape-news.ts                   # Pipeline de ingestão com filtro estrito TSE/IFCN
├── seed-supabase.ts                 # Sincronização inicial e atualização do PostgreSQL/Supabase
├── generate-elected-data.ts         # Gerador estruturado dos eleitos nas 27 UFs
├── sync-tse.ts                      # Validador de schemas territoriais
└── test-scoring.ts                  # Testes unitários do motor matemático
src/
├── types/                           # 1. Departamento de Modelagem & Contratos TypeScript
│   ├── candidate.ts                 #    - Contratos de Candidato, Score e Homologação TSE
│   ├── elected.ts                   #    - Contratos de Eleitos 2026 (27 UFs) e Propostas
│   ├── secondRound.ts               #    - Contratos de 2º Turno, Pesquisas e Apoios de Governadores
│   └── polls.ts                     #    - Contratos do Agregador Histórico de Pesquisas
├── services/                        # 2. Departamento de Regras de Negócio, Validação & APIs
│   ├── sourceValidator.ts           #    - Motor de Validação de Fontes Confiáveis (TSE, IFCN, Imprensa)
│   ├── scoringEngine.ts             #    - Motor matemático auditável do Score (0-100)
│   ├── supabaseClient.ts            #    - Cliente híbrido Supabase com Fallback Offline (Zero Downtime)
│   └── publicDataApis.ts            #    - Conectores com APIs abertas (TSE, IBGE, Câmara, Senado)
├── data/                            # 3. Departamento de Dados Federativos & Eleitorais
│   ├── registry.ts                  #    - Registro e indexador central
│   ├── second-round-2026.json       #    - Dados oficiais do 2º Turno, pesquisas TSE e apoios estaduais
│   ├── elected-2026.json            #    - Base nacional dos 109 eleitos nas 27 UFs e compromissos
│   ├── live-news.json               #    - Feed de notícias purificado por whitelist de confiabilidade
│   ├── polls/
│   │   └── presidential-polls.json  #    - Séries históricas registradas no PesqEle/TSE
│   ├── federal/
│   │   └── presidente.json          #    - Candidaturas presidenciais homologadas no DivulgaCandContas
│   └── estados/
│       └── sp/                      #    - Esfera Estadual (Governador, Senador e Deputados Bauru/SP)
├── stores/                          # 4. Departamento de Estado Reativo (Pinia)
│   └── candidateStore.ts
├── components/                      # 5. Departamento de Apresentação (Design System)
│   ├── common/
│   │   └── TrustedSourcesModal.vue  #    - Central Interativa de Validação de Fontes & Auditoria TSE
│   ├── layout/                      #    - Navbar, Footer
│   ├── shared/                      #    - Modais, Gráficos SVG, Medidores de Score
│   └── candidate/                   #    - CandidateCard (com Selo TSE), Planos, Feed de Notícias
└── views/                           # 6. Departamento de Rotas & Telas Principais
    ├── HomeView.vue                 #    - Dashboard Inicial com Destaques de 2º Turno e Eleitos
    ├── SecondRoundView.vue          #    - Módulo Especial: 2º Turno Presidencial 2026 (/segundo-turno)
    ├── ElectedCandidatesView.vue    #    - Painel Nacional: Eleitos 2026 nas 27 UFs (/eleitos)
    ├── CandidatesListView.vue       #    - Listagem e Filtro de Candidatos Homologados
    ├── CandidateProfileView.vue     #    - Dossiê Individual, Ficha Limpa e Propostas
    ├── PollsAggregatorView.vue      #    - Agregador Oficial de Pesquisas TSE (/pesquisas)
    ├── MandateAuditView.vue         #    - Auditoria do Mandato Atual (/mandato-atual)
    └── ComparatorView.vue           #    - Comparador Lado a Lado (/comparador)
```

---

## 2. Departamento de Validação de Fontes Confiáveis (`src/services/sourceValidator.ts`)

Para blindar a plataforma contra desinformação, especulações políticas e fontes sem credibilidade, todas as entradas passam pelo motor `sourceValidator.ts`:

### 2.1. Os Quatro Níveis de Whitelist Homologada
1. **Órgãos Oficiais da República e Justiça Eleitoral (Score de Confiança: 100/100):**
   - `tse.jus.br`, `divulgacandcontas.tse.jus.br`, `pesqele.tse.jus.br`, `stf.jus.br`, `stj.jus.br`, `tcu.gov.br`, `ibge.gov.br`, `in.gov.br` (DOU), `camara.leg.br`, `senado.leg.br`.
2. **Agências de Fact-Checking Certificadas pela IFCN (Score de Confiança: 95/100):**
   - `lupa.uol.com.br` (Agência Lupa), `aosfatos.org` (Aos Fatos), `projetocomprova.com.br` (Comprova), `estadao.com.br/politica/estadao-verifica`, `g1.globo.com/fato-ou-fake`, `noticias.uol.com.br/confere`.
3. **Institutos de Pesquisa com Registro Regular no TSE - Res. 23.600/2019 (Score: 90/100):**
   - Datafolha, Quaest, AtlasIntel, Ipec, Paraná Pesquisas e MDA/CNT.
4. **Imprensa Profissional com Expediente Público (Score: 85/100):**
   - Agência Brasil (EBC), G1, Folha de S.Paulo, O Estado de S. Paulo, Valor Econômico, CNN Brasil, BBC News Brasil, Poder360, Nexo Jornal.

### 2.2. Guardrails de Integridade Eleitoral
- **`validateCandidacyRole(candidateName, claimedRole)`:**
  - Bloqueia sumariamente que governadores estaduais em exercício sem candidatura presidencial registrada (ex: Ratinho Júnior no PR, Ronaldo Caiado em GO, Romeu Zema em MG, Eduardo Leite no RS) sejam listados como candidatos a Presidente da República.
  - Bloqueia políticos com inelegibilidade proclamada pelo TSE (ex: Jair Bolsonaro, inelegível até 2030 conforme Acórdão no REspe nº 0600814-85.2022.6.00.0000).
- **`validateTseRegistration(regCode)`:**
  - Valida via expressão regular estrita `/^(BR|[A-Z]{2})-(\d{4,6})\/(\d{4})$/` qualquer pesquisa eleitoral e gera automaticamente o link de auditoria pública no sistema **PesqEle/TSE**.
- **`validateNewsArticle(article)`:**
  - Utilizado tanto no frontend quanto no pipeline `scripts/scrape-news.ts` para descartar domínios desconhecidos, blogs sem expediente e manchetes com *clickbait*.

---

## 3. Departamento de Módulos Eleitorais Pós-1º Turno

### 3.1. Módulo de 2º Turno Presidencial (`SecondRoundView.vue` • `/segundo-turno`)
- Apresenta a disputa de 2º turno entre **Luiz Inácio Lula da Silva (PT - 13)** e **Tarcísio de Freitas (Republicanos - 10)**.
- Exibe o termômetro de **Votos Válidos**, **Votos Totais** e **Taxas de Rejeição** das pesquisas pós-1º turno registradas no TSE.
- Separa com rigor técnico o **Resultado Oficial do 1º Turno** do painel de **Apoios Declarados por Governadores Estaduais e Lideranças**, evitando confundir apoios políticos com candidaturas presidenciais.
- Permite comparar lado a lado as propostas dos dois finalistas em 6 temas estruturantes.

### 3.2. Painel Nacional de Candidatos Eleitos (`ElectedCandidatesView.vue` • `/eleitos`)
- Consolida os **109 mandatários eleitos** nas **27 Unidades Federativas** (Governadores, as 2 cadeiras do Senado renovadas por estado e Deputados Federais de destaque).
- Cada cartão apresenta o status proclamado pelo TSE e permite expandir as propostas temáticas registradas para o mandato 2027–2030/2034.

---

## 4. Departamento do Motor de Pontuação (Scoring Engine)

O **Índice de Aptidão Eleitoral (IAE)** é uma escala de 0 a 100 pontos calculada por:

$$\text{Score Final} = \frac{\sum (S_i \times W_i)}{\sum W_i}$$

| Dimensão | Peso Padrão | Critérios Objetivos |
|---|---|---|
| **1. Escolaridade & Formação** | 20% | Nível formal no TSE + Especializações em Gestão Pública / Economia / Direito. |
| **2. Experiência de Gestão** | 25% | Anos no serviço público, mandatos anteriores, aprovação de leis e assiduidade parlamentar. |
| **3. Sabatinas & Debates** | 15% | Desempenho analítico e acurácia factual das afirmações checadas em sabatinas. |
| **4. Integridade & Ficha Limpa** | 20% | Certidões negativas de tribunais superiores, ausência de condenações colegiadas e transparência. |
| **5. Plano de Governo** | 20% | Coerência fiscal, clareza das metas e viabilidade dos pilares registrados perante o TSE. |

---

## 5. Departamento de Backend Híbrido & Automação Contínua (Supabase + GitHub Actions)

1. **Banco de Dados PostgreSQL (Supabase):**
   - Esquema versionado em `supabase/migrations/20260915000000_voto_consciente_schema.sql` com Row-Level Security (RLS) ativo e `GRANT SELECT` explícito para leitura anônima segura.
2. **Arquitetura Offline-First (`fetchWithFallback`):**
   - Caso o Supabase esteja inacessível ou sem rede, `src/services/supabaseClient.ts` realiza fallback imediato e transparente para os datasets JSON locais validados (`presidente.json`, `second-round-2026.json`, `elected-2026.json`, `live-news.json`).
3. **Pipeline Automatizado (`.github/workflows/update-news.yml`):**
   - Executa diariamente via GitHub Actions, consultando fontes confiáveis, filtrando por `isSourceTrusted()`, atualizando o repositório e sincronizando com o Supabase (evitando também a pausa por inatividade do plano gratuito).
