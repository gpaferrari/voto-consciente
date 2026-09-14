# Changelog - Registro de Atualizações e Decisões

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.

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
