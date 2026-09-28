# Clinix — Frontend

Interface web do Clinix, sistema de agendamento de consultas médicas, em [Angular](https://angular.dev) 22. Pacientes encontram horários, agendam, cancelam e reagendam; médicos e administradores gerenciam a agenda; administradores gerenciam usuários.

- **Backend:** [clinix-backend](https://github.com/leorossiio/clinix-backend) — regras de negócio, glossário (`CONTEXT.md`) e documentação da API
- **Mudanças da v2:** [CHANGELOG.md](CHANGELOG.md)

## Como rodar

Requisitos: Node.js 22.22+ ou 24.15+ (veja `.nvmrc`).

```bash
# 1. Backend, sem nenhuma credencial (banco em memória com dados de demonstração)
cd clinix-backend && npm install && npm run dev:memoria

# 2. Frontend
cd clinix-frontend/clinix && npm install && npm start
# → http://localhost:4200
```

Usuários de demonstração (senha `clinix123`): `paciente@clinix.dev`, `medica@clinix.dev`, `medico@clinix.dev`, `admin@clinix.dev`.

A URL da API fica em `src/environments/environment.ts` (desenvolvimento) e `environment.prod.ts` (produção).

## Scripts

Execute dentro de `clinix/`:

| Comando           | O que faz                                                               |
| ----------------- | ----------------------------------------------------------------------- |
| `npm start`       | Servidor de desenvolvimento com recarga automática                      |
| `npm test`        | Testes em modo observação, no Chrome                                    |
| `npm run test:ci` | Testes uma vez, headless, com cobertura e relatório JUnit em `reports/` |
| `npm run build`   | Build de produção em `dist/clinix/browser`                              |
| `npm run lint`    | ESLint (TypeScript + templates, incluindo regras de acessibilidade)     |
| `npm run format`  | Prettier                                                                |

## Arquitetura

```
src/app/
├── core/                    Singletons usados pela aplicação inteira
│   ├── autenticacao/        Sessão (signals), guards, interceptor HTTP, leitura do JWT
│   ├── feedback/            Avisos (toasts), confirmações e mensagens de erro da API
│   └── modelos/             Tipos e enums espelhando o contrato da API
├── features/                Uma pasta por área do produto, carregada sob demanda
│   ├── autenticacao/        Login e cadastro de paciente
│   ├── consultas/           Tela principal, cartão, modais, filtros e regras de exibição
│   ├── usuarios/            Administração de usuários
│   ├── institucional/       Sobre, Termos e Privacidade
│   └── erros/               403 e 404
├── shared/                  Reutilizáveis sem regra de negócio
│   ├── layout/              Cabeçalho, rodapé e moldura das páginas internas
│   ├── ui/                  Modal acessível e toasts
│   └── utils/               Datas e texto
└── testing/                 Fábricas de dados para os testes
```

Convenções:

- **Componentes standalone com signals.** Estado local em `signal`/`computed`; entradas e saídas com `input()`/`output()`; detecção de mudanças no padrão do Angular 22 (OnPush).
- **Lógica fora dos templates.** Regras de exibição são funções puras e testadas: `filtrarConsultas` (filtros) e `acoesDaConsulta` (quais botões cada perfil vê).
- **Container × apresentação.** `PaginaConsultasComponent` busca dados e executa ações; `CartaoDeConsultaComponent` só exibe e emite eventos.
- **HTTP centralizado.** O `autenticacaoInterceptor` anexa o token apenas às chamadas para a nossa API e, se ela responder 401, encerra a sessão e volta ao login. Os services não montam cabeçalhos.
- **Guards controlam navegação, não segurança.** Quem garante permissões é o backend, em toda requisição.
- **Formulários reativos**, com validação declarativa e mensagens associadas aos campos (`aria-invalid`, `aria-describedby`).
- **Estilos:** tokens de design (cores, raios, sombras) e componentes visuais comuns (`.botao`, `.campo`, `.status`) em `src/styles.css`; os componentes definem só o próprio layout.

## O que cada perfil faz

| Perfil        | Pode                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Paciente      | Ver horários livres e as próprias consultas; agendar; cancelar com 24h de antecedência; reagendar o cancelamento mais recente em até 3 dias |
| Médico        | Ver a própria agenda; abrir horários; editar e remover consultas da própria agenda                                                          |
| Administrador | Tudo do médico em qualquer agenda; listar, editar e excluir usuários                                                                        |

## Testes

Escritos em TDD, verificando comportamento pelas interfaces públicas (sem testar detalhes internos):

- **Lógica pura:** filtros, ações por perfil, datas, leitura do JWT, mensagens de erro, validador de senhas.
- **Núcleo:** sessão (persistência e expiração), guards, interceptor (token só para a API, logout no 401).
- **Services:** contrato HTTP com a API (verbos, rotas e corpos) via `HttpTestingController`.
- **Componentes:** login, cadastro, tela de consultas (carregamento, agendamento, erros, filtros persistentes), modais e cabeçalho.

A cobertura mínima (linhas 80%, branches 70%) é exigida em `karma.conf.js`; abaixo disso o comando falha.

## CI/CD com Jenkins

O [Jenkinsfile](Jenkinsfile) roda tudo dentro da imagem `clinix/Dockerfile.ci` (Node 22 + Chromium):

1. `npm ci`
2. Em paralelo: lint, verificação de formatação e `npm audit` das dependências de produção
3. Testes headless com cobertura (JUnit e Cobertura publicados no Jenkins)
4. Build de produção, arquivado como artefato
5. Deploy na Vercel — opcional, só na `main` com o parâmetro `DEPLOY`

Se a integração Git da Vercel já publica a `main`, mantenha `DEPLOY` desmarcado: o Jenkins funciona como portão de qualidade dos pull requests. Plugins e credenciais estão descritos no topo do Jenkinsfile. Configure a Vercel para usar Node 22 ou 24.

Para reproduzir o ambiente do CI localmente:

```bash
cd clinix
docker build -f Dockerfile.ci -t clinix-frontend-ci .
docker run --rm -v "$PWD:/app" -w /app clinix-frontend-ci sh -c "npm ci && npm run test:ci"
```

## Backlog do Jira

| Item                                                         | Situação                                                                                                |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| CLINIXSM-39 — Integrar filtro com a lista                    | Feito: filtros aplicados na hora, combináveis, por médico, descrição, especialidade, situação e período |
| CLINIXSM-41 — Loading enquanto carrega                       | Feito: indicador durante a requisição real (antes era um atraso artificial de 600 ms)                   |
| CLINIXSM-43 — Filtros não reiniciam ao navegar               | Feito: estado em `FiltrosDeConsultasStore`                                                              |
| CLINIXSM-45 / 46 / 50 — Regras de agendamento e cancelamento | Feito no backend; a interface orienta o usuário (ex.: aviso de 24h)                                     |
