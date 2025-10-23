import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import {
    provideAppEnvironmentInfo,
    provideLocalizationConfig,
} from '@contexts/jovdk-web';
import { provideThreeEnvironmentConfig } from '@contexts/jovdk-web-threejs';
import { PROJECT_LOCALIZATION_CONFIG } from '@contexts/app/config/project-localization.config';
import { AppEnvironmentHandler, environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideLocalizationConfig(PROJECT_LOCALIZATION_CONFIG),
        provideAppEnvironmentInfo({
            appVersion: environment.APP_VERSION,
            environmentName: environment.ENVIRONMENT_NAME,
            cdnUrl: environment.CDN_URL,
            apiUrl: environment.API_URL,
            isProduction: AppEnvironmentHandler.IsProd(),
            isLocal: AppEnvironmentHandler.IsLocal(),
        }),
        provideThreeEnvironmentConfig({
            cdnUrl: environment.CDN_URL,
            isLocal: AppEnvironmentHandler.IsLocal(),
        }),
        provideHttpClient(),
        provideRouter(routes),
        provideClientHydration(),
        provideAnimationsAsync(),
    ],
};

