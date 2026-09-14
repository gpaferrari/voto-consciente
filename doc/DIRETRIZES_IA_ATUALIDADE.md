# Diretrizes Mandatórias para Agentes e Inteligência Artificial (Protocolo de Atualidade Eleitoral)

> **Objetivo:** Garantir que todo agente ou modelo de IA que realize ingestão, edição ou pesquisa de dados nesta plataforma apresente informações **estritamente atualizadas no contexto do ciclo eleitoral corrente (2026)**, evitando anacronismos ou replicações de cenários de pleitos passados.

---

## 1. O Princípio da Atualidade Política

Nas eleições brasileiras, alianças partidárias, pré-candidaturas e composições ministeriais sofrem constantes alterações. Um político que foi adversário em uma eleição pode integrar o governo atual no ciclo seguinte.

### Regra de Ouro (Caso Simone Tebet / Ministérios):
> **Nunca cadastrar figuras públicas que atualmente ocupam ministérios ou cargos de confiança no Governo Federal como candidatos de oposição ao Presidente em exercício**, a menos que tenha ocorrido demissão/rompimento formal e lançamento explícito de pré-candidatura nos últimos 60 dias documentado na imprensa de grande circulação.

---

## 2. Checklist Obrigatório para Agentes de IA

Antes de adicionar qualquer candidato a qualquer cargo, o agente deve obrigatoriamente responder às 4 perguntas:

1. **Qual é o cargo público que essa pessoa ocupa HOJE?**
   - Se for Ministro, Secretário de Estado ou líder de bancada da situação, isso deve constar expressamente no campo `currentOfficeNote`.
2. **Existe pré-candidatura formal declarada para o pleito de 2026?**
   - É proibido "presumir" candidatura com base na eleição de 2022. É necessário que o político ou seu partido tenham oficializado ou manifestado pré-candidatura para o ano corrente.
3. **Qual é o status jurídico no TSE (Ficha Limpa)?**
   - O político possui direitos políticos ativos? Houve decisão de inelegibilidade recente?
4. **As fontes e notícias referenciadas são do ciclo atual?**
   - É mandatório linkar matérias recentes dos veículos consolidados e dos portais de tribunais com URLs diretas (deep links).

---

## 3. Fontes Recomendadas para Checagem de Atualidade

- **TSE DivulgaCandContas / Dados Abertos:** Homologações de convenções e registros.
- **Portais Governamentais:** Planalto, Ministérios, Diário Oficial da União (DOU).
- **Cobertura Política Atual:** Sabatinas do Roda Viva (TV Cultura), CNN Brasil, GloboNews, Estadão Política, Folha Poder, G1 Política, UOL Notícias.
- **Agências de Fact-Checking (IFCN):** Aos Fatos, Agência Lupa, Fato ou Fake, Estadão Verifica.

---

## 4. Auditoria Contínua por Scripts

O script `scripts/sync-tse.ts` deve ser executado periodicamente para validar a consistência dos dados frente ao calendário eleitoral e evitar cadastros obsoletos.
