# Manual de Expansão Territorial: Adicionando Novos Estados

Este guia orienta como cadastrar candidatos de outros estados da federação (ex: Rio de Janeiro, Minas Gerais, Paraná, Rio Grande do Sul, Bahia, etc.) na plataforma **Voto Consciente**.

---

## 1. Estrutura de Diretórios por Estado

Para adicionar um novo estado (por exemplo, `RJ` ou `MG`), basta criar a pasta correspondente sob `src/data/estados/[sigla_minuscula]/`:

```
src/data/estados/
├── sp/                 # São Paulo
│   ├── governador.json
│   ├── senador.json
│   └── deputados.json
├── rj/                 # Rio de Janeiro (Novo)
│   ├── governador.json
│   ├── senador.json
│   └── deputados.json
└── mg/                 # Minas Gerais (Novo)
    ├── governador.json
    ├── senador.json
    └── deputados.json
```

---

## 2. Padrão de Arquivo JSON do Candidato

Cada arquivo JSON deve conter uma lista de objetos aderentes à interface TypeScript `Candidate`:

```json
[
  {
    "id": "nome-candidato-cargo",
    "name": "Nome Completo Oficial",
    "popularName": "Nome de Urna",
    "photoUrl": "https://url-da-foto.jpg",
    "role": "governador_estadual",
    "state": "RJ",
    "party": "SIGLA",
    "ballotNumber": "10",
    "coalition": "Nome da Coligação",
    "age": 45,
    "cityOrigin": "Município - UF",
    "declaredAssets": 1500000.00,
    "education": {
      "level": "superior_completo",
      "institution": "Universidade...",
      "course": "Direito / Economia / Engenharia",
      "details": "Descrição da formação",
      "complementaryCourses": ["Gestão Pública"]
    },
    "experience": {
      "yearsInPublicService": 15,
      "summary": "Resumo da trajetória",
      "roles": [
        {
          "title": "Deputado Estadual",
          "period": "2019 - 2023",
          "level": "estadual",
          "achievements": ["Aprovação do projeto X..."]
        }
      ]
    },
    "debatesAndInterviews": {
      "averageScore": 85,
      "events": []
    },
    "integrityAndFacts": {
      "cleanRecordCertificates": [
        { "court": "TRE-RJ", "status": "regular" }
      ],
      "factChecks": []
    },
    "governmentPlan": {
      "summary": "Resumo do plano de governo",
      "pdfUrl": "https://divulgacandcontas.tse.jus.br",
      "pillars": []
    }
  }
]
```

---

## 3. Registrando o Novo Estado no `registry.ts`

No arquivo `src/data/registry.ts`:
1. Importe os arquivos do novo estado.
2. Adicione a sigla do estado na lista `SUPPORTED_STATES`:
   ```ts
   export const SUPPORTED_STATES = [
     { uf: 'SP', name: 'São Paulo' },
     { uf: 'RJ', name: 'Rio de Janeiro' },
     { uf: 'MG', name: 'Minas Gerais' },
     { uf: 'PR', name: 'Paraná' }
   ];
   ```
3. O seletor visual na interface e o roteador reconhecerão automaticamente o novo estado!
