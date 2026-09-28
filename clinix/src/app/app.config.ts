import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import localePt from '@angular/common/locales/pt';
import { routes } from './app.routes';
import { autenticacaoInterceptor } from './core/autenticacao/autenticacao.interceptor';

// Datas e números no padrão brasileiro (ex.: pipe date → "qui, 01/10/2026").
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withFetch(), withInterceptors([autenticacaoInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
