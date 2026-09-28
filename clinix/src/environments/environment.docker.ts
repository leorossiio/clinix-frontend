/**
 * Build usado na imagem Docker (`ng build --configuration docker`): a API é
 * acessada na mesma origem, pelo proxy /api do nginx (ver nginx.conf.template).
 */
export const environment = {
  production: true,
  apiUrl: '/api',
};
