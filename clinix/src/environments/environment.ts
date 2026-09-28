/**
 * Ambiente de desenvolvimento (`ng serve`). Em builds de produção, este
 * arquivo é substituído por environment.prod.ts (ver angular.json).
 * Para rodar a API localmente sem banco: `npm run dev:memoria` no backend.
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
