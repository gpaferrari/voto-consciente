# Diretrizes Mandatórias para Agentes e Inteligência Artificial (Protocolo de Atualidade & Validação TSE)

> **Objetivo:** Garantir que todo agente ou modelo de IA que realize ingestão, edição ou pesquisa de dados nesta plataforma apresente informações **estritamente comprovadas, homologadas pelo TSE e atualizadas no ciclo eleitoral corrente (Outubro de 2026 - 2º Turno e Eleitos)**, impedindo anacronismos, candidaturas especulativas ou fontes não verificadas.

---

## 1. Regras de Ouro Inegociáveis

### Regra de Ouro 1: Vedação Absoluta de Governadores / Políticos sem Registro na Presidência
> **É terminantemente proibido listar governadores estaduais que disputaram reeleição estadual (como Tarcísio de Freitas em SP, reeleito no 1º turno com 62,65%, ou Ratinho Júnior no PR) ou políticos sem registro presidencial em 2026 (como Ciro Gomes) como candidatos a Presidente da República (`role: "presidente"`).**
> - Na eleição presidencial de 2026, avançaram ao **2º Turno (25/10/2026)**: **Flávio Bolsonaro (PL - 22, 47,03% no 1º turno)** e **Luiz Inácio Lula da Silva (PT - 13, 45,16% no 1º turno)**. Disputaram o 1º turno presidencial: **Augusto Cury (Avante - 70, 2,89%)**, **Renan Santos (Missão - 14, 2,24%)**, **Ronaldo Caiado (PSD - 55, 2,18%)** e **Romeu Zema (NOVO - 30, 0,27%)**.
> - Tarcísio de Freitas deve constar **exclusivamente** como Governador Reeleito de São Paulo (`/governador-sp` e `/eleitos`) e na seção de **Apoios Declarados de Governadores no 2º Turno** (`/segundo-turno`).
> - Qualquer tentativa de inserir Tarcísio de Freitas, Ciro Gomes, Ratinho Júnior ou Jair Bolsonaro como `presidente` é bloqueada pela função `validateCandidacyRole()` em `src/services/sourceValidator.ts`.

### Regra de Ouro 2: Pessoas Inelegíveis pelo TSE
> **Políticos com inelegibilidade decretada por decisão colegiada ou plenária do TSE (ex: Jair Bolsonaro, inelegível até 2030 nos autos da AIJE 0600814-85.2022.6.00.0000) NÃO podem ser listados como candidatos ativos na aba de concorrentes.**
> - Seu posicionamento político e apoio a candidatos no 2º turno deve ser registrado apenas na seção de articulação e apoios políticos, com nota expressa sobre sua condição jurídica.

### Regra de Ouro 3: Fidelidade Estrita à Apuração Oficial do TSE (04/10/2026)
> **Sempre consultar e refletir os números oficiais proclamados pelo TSE no 1º turno (04/10/2026) e as pesquisas registradas no PesqEle/TSE para o 2º turno (Outubro/2026)**, utilizando sempre o caractere `•` e nunca a entidade HTML literal `&bull;`.

---

## 2. Uso Obrigatório do Motor `src/services/sourceValidator.ts`

Qualquer dado inserido manual ou automaticamente (via `scripts/scrape-news.ts`) deve passar pelas funções de validação:

1. **`validateCandidacyRole(candidateName, claimedRole)`:**
   - Verifica se o político possui registro homologado no **DivulgaCandContas/TSE** para aquele cargo específico.
2. **`validateTseRegistration(regCode)`:**
   - Toda pesquisa eleitoral exibida deve conter código de registro válido no formato `BR-XXXXX/2026` ou `UF-XXXXX/2026`, auditável no **PesqEle/TSE** (Resolução TSE nº 23.600/2019).
3. **`validateSourceUrl(url)` & `validateNewsArticle(article)`:**
   - Aceita apenas:
     - **Órgãos Oficiais:** TSE, STF, STJ, TCU, IBGE, Câmara, Senado, DOU (`*.jus.br`, `*.gov.br`, `*.leg.br`).
     - **Agências Certificadas IFCN:** Agência Lupa, Aos Fatos, Projeto Comprova, Estadão Verifica, G1 Fato ou Fake, UOL Confere.
     - **Institutos Registrados no TSE:** Datafolha, Quaest, AtlasIntel, Ipec, Paraná Pesquisas, MDA.
     - **Imprensa Profissional:** Agência Brasil (EBC), G1, Folha de S.Paulo, Estadão, Valor Econômico, CNN Brasil, BBC News Brasil, Poder360, Nexo Jornal.
   - Rejeita blogs sem expediente editorial, redes sociais sem checagem e manchetes sensacionalistas (*clickbait*).

---

## 3. Checklist Antes de Qualquer Commit de Dados

- [ ] Os candidatos listados em `src/data/federal/presidente.json` possuem registro real para Presidente no TSE (`tseVerification.status`)?
- [ ] Nenhum governador estadual está misturado na lista de candidatos a Presidente?
- [ ] Não há entidades HTML escapadas literalmente (ex: `&bull;`) dentro de strings JSON renderizadas pelo Vue?
- [ ] Todas as pesquisas em `/segundo-turno` e `/pesquisas` exibem o número de registro `BR-XXXXX/2026`, margem de erro, amostra e contratante?
- [ ] O comando `npm run build` (`vue-tsc && vite build`) executa com zero erros?
