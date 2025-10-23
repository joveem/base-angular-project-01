import { Component, ViewChild, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {
    AppVersionPanelComponent,
    ImageLoadingService,
} from '@contexts/jovdk-web';
import { ThreeJsBaseSceneComponent } from '@contexts/jovdk-web-threejs';
import { NavBarComponent } from '@contexts/app/features/home/nav-bar/nav-bar.component';
import { ImgLoadingDirective } from '@contexts/app/features/custom-directives/img-loading.directive';
import { AppEnvironmentHandler, EnviromentData, environment } from '../../environments/environment';

@Component({
    selector: 'full-app',
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        AppVersionPanelComponent,
        ThreeJsBaseSceneComponent,
        NavBarComponent,
        ImgLoadingDirective,
    ],
    templateUrl: './full-app.component.html',
    styleUrl: './full-app.component.css',
})
export class FullAppComponent {
    _environmentData: EnviromentData = environment;
    private readonly imageLoadingService = inject(ImageLoadingService);

    _isLoadingContent = true;
    _isProd = AppEnvironmentHandler.IsProd();
    _isLocal = AppEnvironmentHandler.IsLocal();

    @ViewChild('_threeJsBaseScene') _threeJsBaseScene!: ThreeJsBaseSceneComponent;

    constructor() {
        this.imageLoadingService.imagesLoading$.subscribe((value: number) => {
            if (value === 0) {
                this._isLoadingContent = false;
            }
        });
    }
}
