# Catálogo de Fontes Oficiais, Metodologia de Validação e Transparência

Este documento descreve detalhadamente a procedência de **100% dos dados utilizados na plataforma Voto Consciente**, os critérios de admissibilidade e validação de fontes (TSE, Tribunais Superiores, IFCN, IBGE), a estrutura de whitelisting implementada no código e como cada eleitor ou auditor pode verificar a autenticidade de qualquer registro.

---

## 1. Classificação das Fontes e Níveis de Autoridade

Todas as informações cadastradas ou ingeridas automaticamente passam pelo motor [`src/services/sourceValidator.ts`](../src/services/sourceValidator.ts), que opera sob uma hierarquia estrita de autoridade dividida em 4 camadas:

| Nível | Categoria de Fonte | Autoridade | Finalidade na Plataforma | Exemplos de Domínios |
| :---: | :--- | :---: | :--- | :--- |
| **Nível 1** | **Órgãos Oficiais da República** | **Score 100** | Registros de candidatura, planos de governo, certidões negativas, acórdãos e dados estatísticos oficiais. | `divulgacandcontas.tse.jus.br`, `pesqele.tse.jus.br`, `stf.jus.br`, `tcu.gov.br`, `senado.leg.br`, `camara.leg.br`, `ibge.gov.br`, `tce.sp.gov.br` |
| **Nível 2** | **Agências de Fact-Checking (IFCN)** | **Score 95** | Checagem de declarações em debates, desmentido de boatos virais e contexto de processos arquivados. | `lupa.uol.com.br`, `aosfatos.org`, `projetocomprova.com.br`, `estadao.com.br/estadao-verifica`, `g1.globo.com/fato-ou-fake` |
| **Nível 3** | **Institutos Registrados no TSE** | **Score 90** | Séries históricas de pesquisas de intenção de voto cadastradas no sistema PesqEle. | `Datafolha`, `Quaest`, `AtlasIntel`, `Paraná Pesquisas`, `CNT/MDA`, `Futura Inteligência` |
| **Nível 4** | **Imprensa Profissional de Referência** | **Score 85** | Cobertura jornalística factualmente apurada, sabatinas e relatórios setoriais. | `agenciabrasil.ebc.com.br`, `g1.globo.com`, `folha.uol.com.br`, `estadao.com.br`, `valor.globo.com`, `cnnbrasil.com.br`, `poder360.com.br` |

---

## 2. Relação Detalhada por Tipo de Dado

### A. Dossiês dos Candidatos (Federal e Estadual)
* **Origem Primária:** Sistema **DivulgaCandContas** do Tribunal Superior Eleitoral.
* **Dados Extraídos:**
  - Nome completo, nome de urna, número de registro, partido e coligação.
  - Idade, município de origem e declaração detalhada de patrimônio.
  - Nível de escolaridade cadastrado na Justiça Eleitoral.
  - **Planos de Governo Oficiais:** Links diretos (`pdfUrl`) direcionando para o repositório oficial do TSE.
* **Campos no Código:** `candidate.tseVerification` contendo `processNumber`, `divulgaCandUrl`, `status` e `verifiedAt`.

### B. Integridade, Certidões e Checagens de Fatos
* **Origem Primária:** Certidões de distribuição de feitos e acórdãos públicos dos Tribunais:
  - Supremo Tribunal Federal (STF).
  - Superior Tribunal de Justiça (STJ).
  - Tribunal Superior Eleitoral (TSE) e Tribunais Regionais Eleitorais (TREs).
  - Tribunal de Contas da União (TCU) e Tribunais de Contas Estaduais (TCEs).
  - Ministério Público Militar (MPM) e Tribunais de Justiça Estaduais.
* **Critério de Registro:** Todo fato judicial relevante requer link direto (deep link) para o acórdão, certidão ou relatório conclusivo do órgão de controle, acompanhado da indicação do estágio processual (ex: *"Arquivado por Decisão Unânime"*, *"Aprovado com Ressalvas"*, *"Presunção de Inocência"*).

### C. Pesquisas Eleitorais e Segundo Turno
* **Origem Primária:** Sistema **PesqEle** do Tribunal Superior Eleitoral (Resolução TSE nº 23.600/2019 e Art. 33 da Lei 9.504/1997).
* **Parâmetros Obrigatórios para Exibição:**
  1. Número de Registro Oficial (ex: `BR-07943/2026` Datafolha, `BR-02883/2026` Quaest, `BR-06564/2026` Paraná Pesquisas, `BR-06165/2026` AtlasIntel, `BR-08005/2026` Real Time Big Data, além de `BR-00466/2026` e `BR-08729/2026`).
  2. Período de realização do trabalho de campo (datas de início e término).
  3. Tamanho da amostra de entrevistados e metodologia de amostragem.
  4. Margem de erro estimada e nível de confiança estatístico (95%).
  5. Nome da entidade contratante e de quem realizou a pesquisa.
  6. Link direto para a ficha de detalhamento da pesquisa no portal do TSE.
  7. Separação clara entre cenários de **1º Turno (`scenarios`)** e cenários de **2º Turno (`secondRoundScenarios`)** no Agregador (`/pesquisas`) e no Painel de 2º Turno (`/segundo-turno`).

### D. Candidatos Eleitos em Todas as 27 UFs (`src/data/elected-2026.json`)
* **Origem Primária:** Totalização Oficial dos Resultados do 1º Turno das Eleições 2026 proclamada pelo TSE em 05/10/2026 e Agência Senado.
* **Cobertura:**
  - **21 Governadores Eleitos no 1º Turno** (com percentual e quantidade exata de votos válidos apurados).
  - **6 UFs em Disputa de 2º Turno** (com os dois concorrentes classificados identificados).
  - **54 Senadores Eleitos** (as 2 vagas renovadas por unidade federativa para o mandato de 8 anos: 2027–2035).
  - **Bancadas de Destaque na Câmara dos Deputados**.
  - Propostas estruturadas em compromissos programáticos por área (Saúde, Educação, Segurança, Infraestrutura, etc.).

### E. Notícias Monitoradas em Tempo Real (`src/data/live-news.json`)
* **Origem Primária:** Pipeline automatizado [`scripts/scrape-news.ts`](../scripts/scrape-news.ts) executado a cada 6 horas via GitHub Actions (`.github/workflows/update-news.yml`), consultando:
  - Feeds RSS geolocalizados do Google News Brasil por candidato e por pesquisas de 2º turno;
  - Feeds institucionais diretos da **Agência Senado**, **Agência Câmara** e **Agência Brasil (EBC)**.
* **Filtros Aplicados Antes da Gravação:**
  - **Bloqueio de Clickbait:** Rejeição de manchetes sensacionalistas contendo gatilhos como *"urgente veja antes que apaguem"*, *"bomba secreta"*, *"escândalo revelado"*.
  - **Whitelist de Veículos:** Rejeição automática de portais sem expediente editorial ou não constantes na lista de veículos homologados.
  - **Validação de Cargo:** Garantia de que a notícia sobre determinado candidato corresponda à sua esfera oficial.

---

## 3. Whitelist Oficial Codificada (`sourceValidator.ts`)

Abaixo estão os domínios homologados de forma programática na plataforma:

```typescript
// 1. Domínios Oficiais Governamentais e Judiciais (Score 100)
export const OFFICIAL_GOV_DOMAINS = [
  'tse.jus.br',
  'divulgacandcontas.tse.jus.br',
  'pesqele.tse.jus.br',
  'stf.jus.br',
  'stj.jus.br',
  'tcu.gov.br',
  'senado.leg.br',
  'camara.leg.br',
  'planalto.gov.br',
  'gov.br',
  'ibge.gov.br',
  'bcb.gov.br',
  'mpm.mp.br',
  'tce.sp.gov.br',
  'tce.mg.gov.br',
  'saopaulo.sp.gov.br',
  'oabsp.org.br'
];

// 2. Agências de Fact-Checking Certificadas IFCN (Score 95)
export const FACT_CHECKING_IFCN_DOMAINS = [
  'lupa.uol.com.br',
  'aosfatos.org',
  'projetocomprova.com.br',
  'g1.globo.com/fato-ou-fake',
  'estadao.com.br/estadao-verifica',
  'uol.com.br/confere'
];
```

---

## 4. Auditoria Automatizada em Linha de Comando

A integridade factual de todos os arquivos é verificada automaticamente antes de cada build de produção por meio do script:

```bash
npm run sync:tse
```

Este script inspeciona:
1. Se todos os 19 candidatos possuem dossiê completo e registro oficial no TSE.
2. Se todos os links de planos de governo (`pdfUrl`) e de certidões judiciais são deep links válidos.
3. Se os 109 eleitos cobrem com precisão as 27 Unidades Federativas.
4. Se todas as 11 pesquisas eleitorais registradas no sistema PesqEle/TSE possuem número de protocolo no padrão `UF-NNNNN/AAAA`.
5. Se todas as 211 notícias monitoradas pertencem à whitelist de veículos homologados.

---

## 5. Como o Cidadão Audita na Própria Interface

Para tornar essa auditoria transparente ao eleitor comum:
1. **Modal de Fontes Confiáveis:** No topo da página (botão **"🛡️ Fontes Confiáveis"** na Navbar), o usuário pode abrir a central de transparência.
2. **Validador em Tempo Real:** O eleitor pode colar qualquer URL ou número de registro TSE (ex: `BR-00466/2026`) para saber na hora se a fonte é oficial, confiável ou rejeitada.
3. **Pílulas de Transparência nos Cards:** Cada candidato possui o selo `Registro TSE: DEFERIDO / SEGUNDO TURNO / ELEITO`, com link direto para o DivulgaCandContas.
