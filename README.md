# Clinix Frontend

Interface web do sistema Clinix, desenvolvida com [Angular](https://angular.io/). 

Este projeto é responsável pela interação dos usuários com o sistema, incluindo médicos, pacientes e administradores, com funcionalidades como agendamento de consultas, login por perfil e painel de gestão.

# Repositório Backend:
[Clinix Backend](https://github.com/leorossiio/clinix-backend)

---

# Tecnologias Utilizadas

- Angular CLI 19.2.6
- TypeScript
- RxJS
- Angular Router
- Tailwind CSS
- JWT para autenticação de rotas

---

#Execução do Projeto

```bash (terminal recomendado)
# Clonar o repositório
git clone https://github.com/leorossiio/clinix-frontend.git
cd clinix-frontend

# Instalar as dependências
npm install

# Iniciar o servidor de desenvolvimento
ng s *Acesse no navegador: http://localhost:4200
```

---

Padrões de Projeto Implementados:
  - Arquitetura modularizada por feature (features/usuarios, features/consultas, etc) buscando metodologia SOLID.
  - Services para chamadas HTTP centralizadas com HttpClient.
  - Guards de Rotas com base no tipo de usuário (Admin, Médico, Paciente).
  - Componentes reutilizáveis (como modais).
  - Responsividade com CSS.
  - Controle de formulários com ngModel + validações.

---

```# Estrutura de Pastas
src/
├── app/
│   ├── core/              # Guards, Interceptors
│   ├── services/          # Serviços de API
│   ├── features/          # Páginas e funcionalidades
│   ├── shared/            # Componentes reutilizáveis
│   ├── app.routes.ts      # Configuração das rotas
│   └── app.component.ts   # Componente raiz
```
---

# Planejamento no Jira:
O projeto foi desenvolvido com base em um quadro no Jira, com organização por sprints e tarefas por funcionalidade:

 - Login com autenticação JWT;
 - Redirecionamento por perfil;
 - Listagem de usuários;
 - Cadastro de consulta com seleção de médico;
 - Modal de atualização de usuário;
 - Proteção de rotas com guardas.

---

# Itens não implementados criados no Jira: (21/05)
Abaixo estão os itens que ainda não foram implementados na sprint atual. Eles estão registrados na coluna "Aguardando Dev" no board do Jira e serão replanejados para a próxima sprint, conforme alinhamento da equipe:

| Tarefa                                                    | Código        | Pontos | Responsável | Justificativa                                                                                                                           |
| --------------------------------------------------------- | ------------- | ------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Integrar filtro com a tabela/lista de resultados**      | `CLINIXSM-39` | 5      | Guilherme   | Depende da finalização do componente de exibição e consolidação das regras definidas no RF3. Priorizou-se estruturar os dados primeiro. |
| **Adicionar loading enquanto carrega filtros**            | `CLINIXSM-41` | 2      | João Pedro  | O carregamento já está mapeado, mas o componente visual de loading aguarda definição final do padrão de UX.                             |
| **Garantir que filtros não sejam reiniciados ao navegar** | `CLINIXSM-43` | 3      | João Pedro  | Exige persistência de estado entre rotas. A estrutura de navegação ainda está em ajuste.                                                |
| **Validar disponibilidade do médico e horário**           | `CLINIXSM-45` | 5      | Tiago       | Requer a conclusão da camada de verificação no back-end, que está sendo ajustada para múltiplos agendamentos.                           |
| **Aplicar regras de negócio no agendamento**              | `CLINIXSM-46` | 3      | Tiago       | Depende da validação final do documento de regras (RF4), especialmente quanto a bloqueios e limites de agendamento.                     |
| **Validar cancelamento com mais de 24h de antecedência**  | `CLINIXSM-50` | 2      | Guilherme   | A lógica de cancelamento está em desenvolvimento, mas a checagem do tempo mínimo ainda precisa ser integrada.                           |

