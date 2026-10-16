# Manual de Expansão Territorial: Estados e Candidatos Eleitos (27 UFs)

Este guia orienta como gerenciar a cobertura nacional dos **27 estados (26 UFs + DF)** no painel de Eleitos e como expandir os dossiês completos de avaliação por estado na plataforma **Voto Consciente**.

---

## 1. Cobertura Nacional de Eleitos (`/eleitos` — Todas as 27 UFs)

A plataforma já conta com cobertura integral das **27 Unidades Federativas** para consulta dos **Candidatos Eleitos em 2026** (Governadores, Senadores e Deputados Federais) e suas propostas registradas:
- **Arquivo de Dados:** [`src/data/elected-2026.json`](../src/data/elected-2026.json)
- **Contrato TypeScript:** [`src/types/elected.ts`](../src/types/elected.ts)
- **Script Gerador/Atualizador:** [`scripts/generate-elected-data.ts`](../scripts/generate-elected-data.ts)
- **Interface Visual:** [`src/views/ElectedCandidatesView.vue`](../src/views/ElectedCandidatesView.vue) (rota `/eleitos`)

---

## 2. Expansão de Dossiês de Avaliação Detalhada por Estado (`src/data/estados/[uf]/`)

Para adicionar dossiês de Score (0–100) de um novo estado na área de comparação (além de `sp/`), basta criar a pasta correspondente sob `src/data/estados/[sigla_minuscula]/`:

```
src/data/estados/
├── sp/                 # São Paulo (Ativo)
│   ├── governador.json
│   ├── senador.json
│   └── deputados.json
├── rj/                 # Rio de Janeiro (Expansão)
│   ├── governador.json
│   ├── senador.json
│   └── deputados.json
└── pr/                 # Paraná (Expansão)
    ├── governador.json
    ├── senador.json
    └── deputados.json
```

---

## 3. Padrão Obrigatório do JSON com Homologação TSE (`tseVerification`)

Todo candidato cadastrado deve obrigatoriamente passar pelas regras do [`src/services/sourceValidator.ts`](../src/services/sourceValidator.ts) e conter o bloco `tseVerification`:

```json
[
  {
    "id": "nome-candidato-cargo",
    "name": "Nome Completo Oficial no TSE",
    "popularName": "Nome de Urna",
    "photoUrl": "https://url-da-foto-oficial.jpg",
    "role": "governador_sp",
    "state": "SP",
    "party": "SIGLA",
    "ballotNumber": "10",
    "coalition": "Nome da Coligação Registrada",
    "age": 45,
    "cityOrigin": "Município - UF",
    "currentOfficeNote": "Cargo Atual • Status Oficial no TSE",
    "declaredAssets": 1500000.00,
    "tseVerification": {
      "status": "DEFERIDO",
      "processNumber": "0600123-45.2026.6.26.0000",
      "divulgaCandUrl": "https://divulgacandcontas.tse.jus.br",
      "verifiedAt": "2026-10-16",
      "isOfficial": true
    },
    "education": {
      "level": "superior_completo",
      "institution": "Universidade...",
      "course": "Curso Superior",
      "details": "Descrição da formação acadêmica",
      "complementaryCourses": ["Gestão Pública"]
    },
    "experience": {
      "yearsInPublicService": 15,
      "summary": "Resumo factual da trajetória",
      "roles": [
        {
          "title": "Cargo Público Exercido",
          "period": "2023 - 2026",
          "level": "estadual",
          "achievements": ["Realização comprovada com fonte oficial..."]
        }
      ]
    },
    "debatesAndInterviews": {
      "averageScore": 85,
      "events": []
    },
    "integrityAndFacts": {
      "cleanRecordCertificates": [
        { "court": "TRE / TSE", "status": "regular" }
      ],
      "factChecks": []
    },
    "governmentPlan": {
      "summary": "Resumo do plano de governo registrado no TSE",
      "pdfUrl": "https://divulgacandcontas.tse.jus.br",
      "pillars": []
    }
  }
]
```

> **Atenção:** Nunca utilize a entidade HTML `&bull;` dentro de strings JSON (como `currentOfficeNote`). Utilize sempre o caractere Unicode `•`.

---

## 4. Registrando o Estado no `src/data/registry.ts`

1. Importe os arquivos do estado em `src/data/registry.ts`.
2. Marque `available: true` na constante `SUPPORTED_STATES`.
3. Execute `npm run build` para validar a tipagem estrita do TypeScript.
