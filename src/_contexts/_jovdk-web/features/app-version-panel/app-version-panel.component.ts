import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { APP_ENVIRONMENT_INFO } from '../../core/environment/app-environment.token';

@Component({
    selector: 'app-version-panel',
    standalone: true,
    imports: [
        NgIf,
    ],
    templateUrl: './app-version-panel.component.html',
    styleUrl: './app-version-panel.component.css'
})
export class AppVersionPanelComponent {
    private readonly _environmentInfo = inject(APP_ENVIRONMENT_INFO, { optional: true }) ?? {
        appVersion: '0.0.0',
        environmentName: 'unknown',
        isProduction: false,
    };

    // exposed state
    readonly appVersion = this._environmentInfo.appVersion;
    readonly environmentName = this._environmentInfo.environmentName;
    readonly isProduction = this._environmentInfo.isProduction ?? false;
}
