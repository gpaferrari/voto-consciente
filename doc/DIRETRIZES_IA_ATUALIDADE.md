# Diretrizes Mandatórias para Agentes e Inteligência Artificial (Protocolo de Atualidade & Validação TSE)

> **Objetivo:** Garantir que todo agente ou modelo de IA que realize ingestão, edição ou pesquisa de dados nesta plataforma apresente informações **estritamente comprovadas, homologadas pelo TSE e atualizadas no ciclo eleitoral corrente (Outubro de 2026 - 2º Turno e Eleitos)**, impedindo anacronismos, candidaturas especulativas ou fontes não verificadas.

---

## 1. Regras de Ouro Inegociáveis

### Regra de Ouro 1: Vedação Absoluta de Governadores / Pré-Candidatos Especulativos na Presidência
> **É terminantemente proibido listar governadores estaduais em exercício (como Ratinho Júnior no PR, Ronaldo Caiado em GO, Romeu Zema em MG ou Eduardo Leite no RS) como candidatos a Presidente da República (`role: "presidente"`).**
> - Nenhum desses governadores registrou candidatura presidencial no DivulgaCandContas do TSE.
> - Eles devem constar **exclusivamente** em suas respectivas esferas estaduais (`/eleitos` sob sua UF) ou na seção de **Apoios Políticos Declarados no 2º Turno** (`/segundo-turno`).
> - Qualquer tentativa de inseri-los como `presidente` é bloqueada pela função `validateCandidacyRole()` em `src/services/sourceValidator.ts`.

### Regra de Ouro 2: Pessoas Inelegíveis pelo TSE
> **Políticos com inelegibilidade decretada por decisão colegiada ou plenária do TSE (ex: Jair Bolsonaro, inelegível até 2030 nos autos da AIJE 0600814-85.2022.6.00.0000) NÃO podem ser listados como candidatos ativos na aba de concorrentes.**
> - Seu posicionamento político e apoio a candidatos no 2º turno deve ser registrado apenas na seção de articulação e apoios políticos, com nota expressa sobre sua condição jurídica.

### Regra de Ouro 3: Caso Ministérios / Situação (Ex: Simone Tebet / Fernando Haddad)
> **Nunca cadastrar figuras públicas que ocupam ministérios no Governo Federal como adversários presidenciais do Presidente em exercício**, e sempre explicitar o cargo atual no campo `currentOfficeNote` (usando o caractere `•` e nunca a entidade HTML literal `&bull;`).

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
