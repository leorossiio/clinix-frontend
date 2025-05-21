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
- NgModel / FormsModule para formulários

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

# Estrutura de Pastas
src/
├── app/
│   ├── core/              # Guards, Interceptors
│   ├── services/          # Serviços de API
│   ├── features/          # Páginas e funcionalidades
│   ├── shared/            # Componentes reutilizáveis
│   ├── app.routes.ts      # Configuração das rotas
│   └── app.component.ts   # Componente raiz

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

# Itens não implementados criados no Jira:


