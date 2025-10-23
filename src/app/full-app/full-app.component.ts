import { Component, ViewChild, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { AppEnvironmentHandler, environment, EnviromentData } from '../../environments/environment';
import { AppVersionPanelComponent } from '@contexts/jovdk-web/features/app-version-panel/app-version-panel.component';
import { ThreeJsBaseSceneComponent } from '@contexts/jovdk-web-threejs/features/base-scene/threejs-base-scene.component';
import { NavBarComponent } from '@contexts/app/features/home/nav-bar/nav-bar.component';
import { ImgLoadingDirective } from '@contexts/app/features/custom-directives/img-loading.directive';
import { ImageLoadingService, LocalizationService } from '@contexts/jovdk-web';

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
export class FullAppComponent
{
    // dependencies
    _environmentData: EnviromentData = environment;
    _localizationService: LocalizationService = inject(LocalizationService);
    _imageLoadingService: ImageLoadingService = inject(ImageLoadingService);

    // state
    _isLoadingContent = true;
    _isProd = AppEnvironmentHandler.IsProd();
    _isLocal = AppEnvironmentHandler.IsLocal();

    // parts
    @ViewChild('_threeJsBaseScene') _threeJsBaseScene!: ThreeJsBaseSceneComponent;

    constructor()
    {
        this._imageLoadingService.imagesLoading$.subscribe(
            (value: number) =>
            {
                // console.log('>>>>>> images.length = ' + value);

                if (value == 0)
                    this._isLoadingContent = false;
            });
    }

}
