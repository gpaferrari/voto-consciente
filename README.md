# Voto Consciente | Plataforma Apartidária de Dados Oficiais & Score de Candidatos

Plataforma web moderna, minimalista e apartidária para avaliação e comparação de candidatos aos poderes Executivo e Legislativo (Federal e Estadual), orientada estritamente por **dados oficiais da República** (TSE, IBGE, Banco Central, STF, TCU) e agências de checagem certificadas (IFCN).

---

## 🏛️ Características Principais

1. **Índice de Aptidão Eleitoral (Score 0-100):**
   - **Escolaridade & Formação Acadêmica:** Baseado em dados cadastrais oficiais do TSE e pós-graduações.
   - **Experiência de Gestão:** Histórico de mandatos, cargos públicos e assiduidade parlamentar.
   - **Sabatinas & Debates:** Avaliação analítica e precisão factual verificada em entrevistas.
   - **Integridade & Ficha Limpa:** Certidões negativas de tribunais superiores e ausência de condenações colegiadas.
   - **Viabilidade do Plano de Governo:** Metas claras, fontes de financiamento declaradas e coerência fiscal.
   - **Personalização de Pesos:** O eleitor tem autonomia total para ajustar os sliders de pesos a qualquer momento.

2. **Auditoria do Mandato Atual:**
   - Acompanhamento detalhado de 60 promessas de campanha da última eleição.
   - Gráficos oficiais de evolução do PIB (IBGE), Inflação IPCA (Banco Central), Desemprego (PNAD Contínua), Dívida Bruta/PIB e Resultado Primário.
   - Análise de gastos públicos (prioritários vs pontos de pressão fiscal).

3. **Arquitetura Federativa (Multi-Estados):**
   - Segregação territorial limpa: `src/data/federal/` e `src/data/estados/[uf]/` (São Paulo ativo com foco inicial em Bauru/SP, pronto para RJ, MG, PR, GO, etc.).

4. **Design Minimalista & Isenção Ética:**
   - Tipografia limpa, linhas finas, sem poluição visual.
   - Modal automático de aviso apartidário com cache em `localStorage`.
   - Links diretos (deep links) para cada decisão judicial e checagem de fatos.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js v18+ (recomendado Node 20 ou 22+)
- npm ou pnpm

### Instalação
```bash
# Instalar dependências
npm install
```

### Desenvolvimento
```bash
# Iniciar servidor local com hot-reload
npm run dev
```

### Testes e Validação de Dados
```bash
# Rodar testes unitários do motor de pontuação
npx tsx scripts/test-scoring.ts

# Validar integridade dos esquemas territoriais
npx tsx scripts/sync-tse.ts
```

### Build de Produção
```bash
npm run build
```

---

## 📂 Documentação

Consulte a pasta [`doc/`](./doc/) para especificações técnicas detalhadas:
- [`doc/ARQUITETURA.md`](./doc/ARQUITETURA.md): Divisão por departamentos arquiteturais e governança de dados.
- [`doc/DIRETRIZES_IA_ATUALIDADE.md`](./doc/DIRETRIZES_IA_ATUALIDADE.md): Protocolo mandatório de atualidade eleitoral e verificação temporal para IAs e agentes.
- [`doc/MANUAL_DE_EXPANSAO_ESTADOS.md`](./doc/MANUAL_DE_EXPANSAO_ESTADOS.md): Como cadastrar novos estados e municípios.
- [`doc/CHANGELOG.md`](./doc/CHANGELOG.md): Histórico de versões e decisões de design.
