# Changelog

## Não publicado

- Imagem Docker de produção (build do Angular + nginx), com proxy `/api` para a API na mesma origem e `x-request-id` gerado na borda.
- Configuração de build `docker` (`ng build --configuration docker`).

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

### Identidade visual

- Nova linguagem visual a partir da marca: paleta tinta, anil e hortelã; tipografia Bricolage Grotesque e Figtree; marca redesenhada em SVG (o logo original tinha brilho e fundo embutidos e perdia nitidez).
- A tela de consultas virou uma agenda agrupada por dia ("Hoje", "Amanhã", "Quarta-feira, 30 de setembro"). O paciente vê primeiro as próprias consultas, em bilhetes com folha de calendário, e depois os horários livres.
- Na agenda do médico, cada linha destaca o paciente; na do administrador, o médico e a situação.
- Busca única por médico, paciente, especialidade ou descrição; filtros exibidos conforme o perfil.
- Cabeçalho claro com avatar, rodapé discreto, tabela de usuários com avatares e ícones no lugar de emojis.
- Removidas as ilustrações PNG da tela inicial: a página baixava quase 7 MB de imagens.

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
