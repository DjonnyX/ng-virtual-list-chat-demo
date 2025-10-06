import { ApplicationConfig, EnvironmentProviders, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { environment } from '@environments/environment';
import { routes } from './app.routes';

let routerProvider: EnvironmentProviders;
if (environment.useMock) {
  routerProvider = provideRouter(routes, withHashLocation());
} else {
  routerProvider = provideRouter(routes);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    routerProvider,
  ],
};
