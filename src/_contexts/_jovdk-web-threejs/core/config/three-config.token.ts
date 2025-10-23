import { InjectionToken, Provider } from '@angular/core';

export interface ThreeEnvironmentConfig {
    readonly cdnUrl?: string;
    readonly isLocal?: boolean;
}

export const THREE_ENVIRONMENT_CONFIG = new InjectionToken<ThreeEnvironmentConfig>('THREE_ENVIRONMENT_CONFIG');

export const provideThreeEnvironmentConfig = (config: ThreeEnvironmentConfig): Provider => ({
    provide: THREE_ENVIRONMENT_CONFIG,
    useValue: config,
});

