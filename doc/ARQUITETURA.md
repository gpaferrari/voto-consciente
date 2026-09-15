# Documentação de Arquitetura do Sistema: Voto Consciente

Plataforma cívica, apartidária e baseada em evidências para avaliação analítica de candidatos aos poderes Executivo e Legislativo (Federal e Estadual).

---

## 1. Departamentalização da Arquitetura

A aplicação é dividida em departamentos arquiteturais independentes, permitindo manutenção desacoplada, auditoria e facilidade de escala territorial.

```
doc/
└── ARQUITETURA.md
src/
├── types/                           # 1. Departamento de Modelagem & Contratos
├── services/                        # 2. Departamento de Regras de Negócio & Scoring
│   ├── scoringEngine.ts             #    - Motor matemático auditável
│   └── publicDataApis.ts            #    - Conexões com APIs abertas do Governo
├── data/                            # 3. Departamento de Dados Federativos
│   ├── registry.ts                  #    - Registro e indexador central
│   ├── federal/                     #    - Nível Nacional (Presidente)
│   │   └── presidente.json
│   └── estados/                     #    - Nível Subnacional (por UF)
│       └── sp/                      #       - Estado de São Paulo
│           ├── governador.json
│           ├── senador.json
│           └── deputados.json       #       - Deputados Federais (Foco Bauru e Região)
├── stores/                          # 4. Departamento de Estado Reativo (Pinia)
├── components/                      # 5. Departamento de Apresentação (Design System)
│   ├── layout/                      #    - Navbar, Footer
│   ├── shared/                      #    - Modais, Gráficos SVG, Medidores
│   └── candidate/                   #    - Cards, Planos de Governo, Fatos
└── views/                           # 6. Departamento de Rotas & Telas
```

---

## 2. Departamento de Governança & Fatos Verificados

### Diretrizes Éticas Obrigatórias:
1. **Factualidade Rígida:** É terminantemente vedado o uso de especulações, boatos de redes sociais, fofocas ou denúncias anônimas.
2. **Separação de Instâncias:**
   - **Condenação Colegiada / TCU:** Apenas decisões definitivas ou colegiadas têm peso negativo no score de integridade.
   - **Investigação em Curso:** Identificada explicitamente com a tag *"Em Apuração - Vigora Presunção de Inocência (Art. 5º, LVII da CF/88)"*.
   - **Boato Desmentido:** Fatos inverídicos desmontados por agências do International Fact-Checking Network (IFCN) ganham destaque para combater a desinformação.
   - **Arquivamento / Absolvição:** Casos encerrados pela justiça são sinalizados como restauradores da higidez cadastral.
3. **Links Diretos (Deep Links):** Nenhuma fonte pode apontar para páginas iniciais genéricas. Todas devem conter a URL exata da decisão judicial, acórdão ou reportagem de checagem.
4. **Protocolo de Atualidade Política para IA:** Todo agente ou modelo de IA deve seguir o checklist obrigatório em [`doc/DIRETRIZES_IA_ATUALIDADE.md`](./DIRETRIZES_IA_ATUALIDADE.md), proibindo a inclusão de figuras ministeriais aliadas como adversários sem pré-candidatura formal declarada nos últimos 60 dias.
5. **Salvaguarda Jurídica & Não-Pesquisa Eleitoral:** A plataforma tem finalidade estritamente informativa e de dados abertos, NÃO se tratando de pesquisa de intenção de voto ou enquete (Art. 33 da Lei 9.504/97). Para detalhes completos de fundamentação constitucional e conformidade legal, consulte [`doc/COMPLIANCE_E_AVISO_LEGAL.md`](./COMPLIANCE_E_AVISO_LEGAL.md).

---

## 3. Departamento de Dados Federativos (Escalabilidade por Estado)

Para evitar acoplamento de estados, a pasta `src/data/` é particionada por esfera de poder:

- **`src/data/federal/`**: Contém candidatos de abrangência nacional (Presidência da República).
- **`src/data/estados/[uf]/`**: Cada estado brasileiro possui sua própria pasta (ex: `sp/`, `rj/`, `mg/`, `pr/`), contendo:
  - `governador.json`: Candidatos ao governo do respectivo estado.
  - `senador.json`: Candidatos às vagas do Senado Federal por aquele estado.
  - `deputados.json`: Deputados federais, com possibilidade de anotação de base regional (ex: Bauru e Centro-Oeste Paulista).
- **`src/data/registry.ts`**: Carregador centralizado que unifica os dados, expõe filtros por UF e permite que a interface adicione novos estados com zero impacto no código-fonte dos componentes.

---

## 4. Departamento do Motor de Pontuação (Scoring Engine)

O **Índice de Aptidão Eleitoral (IAE)** é uma escala de 0 a 100 pontos calculada por:

$$\text{Score Final} = \frac{\sum (S_i \times W_i)}{\sum W_i}$$

Onde $S_i$ representa a nota da dimensão e $W_i$ o peso percentual definido pelo eleitor:

| Dimensão | Peso Padrão | Critérios Objetivos |
|---|---|---|
| **1. Escolaridade & Formação** | 20% | Nível formal no TSE (Fundamental a Doutorado) + Especializações em Gestão Pública / Economia. |
| **2. Experiência de Gestão** | 25% | Anos no serviço público, mandatos anteriores, aprovação de leis e assiduidade parlamentar. |
| **3. Sabatinas & Debates** | 15% | Desempenho analítico e acurácia factual das afirmações checadas em sabatinas. |
| **4. Integridade & Ficha Limpa** | 20% | Certidões negativas de tribunais superiores, ausência de condenações colegiadas e transparência. |
| **5. Plano de Governo** | 20% | Coerência fiscal, clareza das metas e viabilidade dos pilares registrados perante o TSE. |

*O usuário tem autonomia para alterar os pesos a qualquer momento no menu superior, e o sistema recalcula todo o ranking de forma reativa.*

---

## 5. Departamento de UX/UI Minimalista (Design System)

A interface segue uma estética **minimalista nórdica/suíça**:
- Linhas limpas de 1px com contraste sutil (`border-slate-200/60 dark:border-slate-800`).
- Fundo neutro e sem sombras excessivas ou gradientes chamativos.
- Cores semafóricas utilizadas com parcimônia, exclusivamente para indicar status de checagem ou viabilidade.
- Tipografia legível, com micro-rótulos em caixa alta e espaçamento generoso.
- Modal reutilizável (`BaseModal.vue`) e aviso ético automático no primeiro acesso com cache em `localStorage`.

---

## 6. Departamento de Backend & Análise de Dados (Supabase / PostgreSQL)

Para suportar análises quantitativas avançadas, ingestão em tempo real e agregação de dados eleitorais, a plataforma integra-se ao **Supabase**:

```
supabase/
├── config.toml
└── migrations/
    └── 20260915000000_voto_consciente_schema.sql  # DDL, Tabelas, Índices, RLS e Views Analíticas
```

### Principais Capacidades Analíticas Habilitadas:
1. **Agregador Ponderado de Pesquisas (`v_media_movel_pesquisas`):**
   - Agrupamento estatístico ponderando pelo inverso da margem de erro ($\frac{1}{\text{margem}}$).
2. **Perfil Analítico Integrado (`v_perfil_analitico_candidatos`):**
   - Consolidação de patrimônio declarado, histórico de mandatos, média de sabatinas e certidões ativas.
3. **Métricas de Cobertura de Imprensa (`v_cobertura_imprensa_stats`):**
   - Análise de frequência e distribuição temática de reportagens extraídas via web scraping.
4. **Segurança e Isolamento (RLS):**
   - Políticas de leitura pública irrestrita (`SELECT true`) para clientes anônimos e gravação protegida por `service_role`.
5. **Fallback Transparente:**
   - O serviço `src/services/supabaseClient.ts` garante que a aplicação continue funcionando normalmente a partir dos arquivos JSON locais caso a conexão remota não esteja configurada.

