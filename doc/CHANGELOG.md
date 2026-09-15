# Changelog - Registro de Atualizações e Decisões

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.

## [1.2.0] - 2026-09-14
### Adicionado
- **Agregador Oficial de Pesquisas Eleitorais TSE (`/pesquisas`):**
  - Módulo completo de compilação de pesquisas registradas no TSE (Datafolha, Quaest, Paraná Pesquisas e AtlasIntel).
  - Componente `PollingTrackerChart.vue` com gráficos interativos de linhas temporais, alternância entre cenários (Estimulada 1º Turno, Espontânea e Simulações de 2º Turno) e destaque por candidato.
  - Tabela detalhada com número de registro TSE auditável perante o sistema PesqEle, período de campo, contratante, metodologia e margem de erro $\pm 2\%$.
  - Callouts informativos sobre empate técnico e compliance com o Art. 33 da Lei 9.504/97 e Resolução TSE nº 23.600/2019.
- **Pipeline de Web Scraping & Ingestão de Notícias em Tempo Real:**
  - Script `scripts/scrape-news.ts` executável via `npm run scrape:news`.
  - Scraping automatizado de feeds RSS do Google News Brasil com filtros rigorosos por candidato, além de agências oficiais de imprensa.
  - Geração de `src/data/live-news.json` com 70 matérias apuradas e links diretos para a reportagem original.
  - Componente `LiveNewsFeed.vue` com badges de veículos, classificação automática por categoria (*Proposta, Gestão, Jurídico, Pesquisa, Geral*), busca textual e integração na Home e nos perfis dos candidatos.
- **Ampliação Expressiva da Base de Candidatos Reais:**
  - **Presidência da República:** Inclusão de Romeu Zema (Novo), Ciro Gomes (PDT), Eduardo Leite (PSDB) e Jair Bolsonaro (PL - com nota institucional mandatória de inelegibilidade até 2030 decretada pelo TSE nos autos da AIJE 0600814-85.2022.6.00.0000).
  - **Governo do Estado de SP:** Inclusão de Guilherme Boulos (PSOL), Márcio França (PSB) e Ricardo Nunes (MDB).
  - **Senado por SP:** Inclusão de Mara Gabrilli (PSD), Eduardo Suplicy (PT) e Janaína Paschoal (PP).
  - **Deputados Federais (Foco Bauru e Região Central de SP):** Inclusão de Arnaldo Jardim (Cidadania - Bioeconomia e Combustível do Futuro) e Baleia Rossi (MDB - Autor da PEC da Reforma Tributária).
- **Scripts de Automação no `package.json`:**
  - `"scrape:news"`: Ingestão de notícias.
  - `"test:scoring"`: Testes unitários do motor de pontuação.
  - `"sync:tse"`: Validação de schemas e integridade federativa.

## [1.1.0] - 2026-09-14
### Adicionado
- **Documentação de Arquitetura (`doc/`):** Criada a pasta `doc/` com separação por departamentos arquiteturais (`ARQUITETURA.md`) e manual de expansão de estados (`MANUAL_DE_EXPANSAO_ESTADOS.md`).
- **Segregação Territorial Federativa:** Separação dos dados em `src/data/federal/` e `src/data/estados/sp/`, orquestrados por `registry.ts`.
- **Cenário Presidencial 2026 Atualizado:** Inclusão dos governadores Ronaldo Caiado (União Brasil - GO) e Ratinho Júnior (PSD - PR) como pré-candidatos cotados para 2026.
- **Observação Institucional sobre Fernando Haddad:** Nota explícita no perfil sobre sua atuação simultânea como Ministro da Fazenda/Economia do Brasil e candidato ao Governo de SP.
- **Modal Reutilizável & Aviso Apartidário:** Criação de `BaseModal.vue` e `DisclaimerModal.vue`, disparado na abertura com verificação em `localStorage` para reforçar a isenção política.
- **Links Diretos:** Substituição de links genéricos por URLs diretas para decisões judiciais (STF, TSE, TCU, TRE-SP) e reportagens de agências certificadas (Lupa, Aos Fatos, G1).
- **Design Minimalista:** Redesign dos cards, gráficos, barras e navegação adotando estética nórdica/suíça com tipografia refinada e linhas finas.

## [1.0.0] - 2026-09-14
### Adicionado
- Versão inicial da plataforma Voto Consciente com Vue 3, TypeScript, Tailwind CSS e Pinia.
- Motor de Scoring de 5 dimensões (Escolaridade, Experiência, Sabatinas, Integridade e Plano de Governo).
- Gráficos interativos SVG (Radar de Habilidades e Tendências Macroeconômicas de Mandato).
- Painel de auditoria do mandato atual com 60 promessas monitoradas e indicadores oficiais do IBGE e Banco Central.
- Comparador lado a lado de candidatos com sobreposição de radar.
