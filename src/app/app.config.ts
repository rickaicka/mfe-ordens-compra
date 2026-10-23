import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { HUB_AUTH_API_URL } from '@daruix/hub-auth';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIonicAngular(),
    provideHttpClient(withFetch()),
    { provide: HUB_AUTH_API_URL, useValue: environment.apiUrl },
  ],
};
