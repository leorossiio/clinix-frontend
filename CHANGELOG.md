# Changelog

## 2.0.0

Reescrita da interface com arquitetura por features, signals, testes automatizados e atualização para o Angular 22. **Requer o backend 2.0.0** (o contrato da API mudou — ver o CHANGELOG do backend).

### Correções

- O paciente volta a ver as próprias consultas e os botões **Cancelar** e **Reagendar** (a API antiga devolvia só horários livres).
- A edição de consultas funcionava: o formulário enviava o objeto inteiro (recusado pela API), usava campo de data incompatível com o valor e um campo de hora inexistente. Agora edita data e descrição e envia só o que mudou.
- O modal de edição de usuário exibia a senha atual em texto puro (a API a devolvia). A senha agora é só um campo "nova senha" opcional.
- A lista de consultas não atualizava quando ficava vazia (`forkJoin` de lista vazia nunca emite) e fazia uma requisição por médico e por paciente a cada carregamento. A API agora devolve os nomes junto.
- Tokens com `-` ou `_` quebravam a leitura do JWT (`atob` direto em base64url).
- Sair não limpava todos os dados da sessão; a expiração do token nunca era verificada.
- "Limpar filtros" não limpava o período; não havia opção "Todas" nos selects.
- O atributo `min` do campo de data do novo horário era o texto literal `"minDateTime"`.
- A lista de usuários ficava acessível a médicos pela URL, embora o menu a mostrasse só para administradores.

### Segurança

- Atualizado de Angular 19 (fora de suporte, com 7 alertas de XSS conhecidos) para Angular 22: `npm audit` sem vulnerabilidades.
- Removidos jQuery 3.2.1, Popper 1.12 e Bootstrap 4.0 JS, carregados de CDN sem uso e com vulnerabilidades conhecidas.
- O token é enviado só para a API do Clinix, nunca para outros domínios.
- O parâmetro de retorno do login só aceita caminhos internos (evita redirecionamento para sites maliciosos).

### Experiência

- Avisos não bloqueantes (toasts) no lugar de `alert()`.
- Carregamento real, estados de lista vazia e de erro com "Tentar novamente".
- Filtros instantâneos que persistem ao navegar.
- Cabeçalho com saudação e perfil; páginas institucionais acessíveis antes do login.
- Acessibilidade: rótulos em todos os campos, modais com `role="dialog"`, foco e tecla Esc, botões de ícone com `aria-label`, link "pular para o conteúdo", contraste revisado nas etiquetas de status e lint de acessibilidade nos templates.

### Engenharia

- Estrutura `core` / `features` / `shared`, rotas com lazy loading e títulos de página.
- Signals, `input()`/`output()`, controle de fluxo `@if`/`@for`, guards e interceptor funcionais, formulários reativos.
- Estilos globais com tokens de design; CSS duplicado entre componentes removido.
- 92 testes (antes: 1 gerado automaticamente), ESLint com regras de acessibilidade, Prettier, Jenkinsfile e imagem de CI.
- Removidos componentes e serviços sem uso (`ModalAgendarConsulta`, `NotificacaoService`), modelos duplicados e as dependências `@ng-select/ng-select` e `swiper`.
- Rotas antigas (`/home`, `/cadastro-paciente`) redirecionam para as novas (`/consultas`, `/cadastro`).
