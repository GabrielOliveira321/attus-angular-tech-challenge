# Repositório de Desafios e Projetos Técnicos

Bem-vindo ao workspace central de desafios técnicos e aplicações! 
Este repositório foi organizado para separar claramente projetos completos de pequenos desafios e scripts de estudo.

## Estrutura do Repositório

### 1. `TsDesafiosTecnicos/`
Contém os desafios menores, separados por categoria (TypeScript, Reatividade, Gerenciamento de Estados, etc.). Estes arquivos são scripts isolados para validar conceitos e testar conhecimentos técnicos específicos.
- **Como rodar:** Use os scripts configurados no `package.json` raiz (ex: `npm run refatoracao`, `npm run filter`).

### 2. `user-management-workspace/`
Um monorepo Nx contendo uma aplicação Angular (v17+) focada em gerenciamento de usuários. Implementa um modal de formulário reativo, listagem com busca reativa (debounce) e gerenciamento de estado customizado usando Angular Signals.
- **Como rodar:** Entre na pasta `user-management-workspace` e execute `npx nx serve users-app`.

### 3. `AttusProcuradoriaDigital/`
Projeto completo dedicado à aplicação Attus Procuradoria Digital.

---
**Dica de Organização:** Mantenha novos projetos completos na raiz do repositório, mas sempre coloque scripts isolados ou desafios teóricos menores na pasta `TsDesafiosTecnicos`.
