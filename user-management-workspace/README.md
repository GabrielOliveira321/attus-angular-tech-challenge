# Desafio Prático — Aplicação Angular

Este projeto foi gerado com o [Nx](https://nx.dev) e resolve o desafio técnico de criar uma Listagem de Usuários com Modal de Formulário, usando as melhores práticas da versão mais moderna do Angular (v17+).

## Tecnologias e Padrões Utilizados
- **Angular 17+**: Uso de componentes Standalone (sem NgModules) e Signals.
- **Angular Material**: Para componentes de UI como Cards, Dialogs (Modal), Inputs e Spinner.
- **RxJS**: Operadores como `switchMap`, `catchError` no gerenciamento de dados assíncronos e `debounceTime`, `distinctUntilChanged`, `takeUntil` para gerenciar a barra de pesquisa do filtro de forma reativa.
- **Gerenciamento de Estado**: Implementado com uma Store baseada em **Signals** (`data-access-users/src/lib/state/user.store.ts`), que elimina a verbosidade do NgRx mas mantém a arquitetura previsível e limpa.
- **Jest**: Configurado nativamente como *Test Runner*.
- **Nx Monorepo (Diferencial)**: Arquitetura isolada separando a camada de persistência/mocks (`data-access-users`) da camada visual principal (`feature-users`).

## Instalação e Execução

Pré-requisitos: Node.js instalado no seu sistema (preferencialmente versão LTS).

1. Na raiz do workspace `user-management-workspace`, instale as dependências:
\`\`\`bash
npm install
\`\`\`

2. Execute o servidor de desenvolvimento:
\`\`\`bash
npx nx serve users-app
\`\`\`
*(Ou alternativamente `npm run start` caso esteja configurado).*

3. Acesse no seu navegador: **[http://localhost:4200](http://localhost:4200)**

## Testes Unitários

Para rodar os testes utilizando o **Jest** configurado pelo Nx:

\`\`\`bash
npx nx test feature-users
npx nx test data-access-users
\`\`\`

*(A cobertura de testes foi configurada para validar o `data-access-users` e componentes, conforme a necessidade de chegar aos 60%).*

## Detalhes da Implementação
- **Listagem**: Consome do serviço mockado (que aleatoriamente dispara um erro com 10% de chance para exibir o tratamento de erro visual), e as buscas possuem _debounce_ garantindo performance.
- **Formulário Reativo**: Validações customizadas de e-mail e expressões regulares (RegEx) para garantir o formato correto do CPF.
