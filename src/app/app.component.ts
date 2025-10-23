import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullAppComponent } from "./full-app/full-app.component";
import { ImageLoadingService } from '@contexts/jovdk-web';
import { NgIf } from '@angular/common';
import { ImgLoadingDirective } from '@contexts/app/features/custom-directives/img-loading.directive';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        NgIf,
        RouterOutlet,
        FullAppComponent,
        ImgLoadingDirective,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent
{
    // dependencies
    _imageLoadingService: ImageLoadingService = inject(ImageLoadingService);

    _isLoadingContent = true;

    // parts
    @ViewChild('_threeJsBaseScene') _fullApp!: FullAppComponent;

    constructor()
    {
        this._imageLoadingService.imagesLoading$.subscribe(
            (value: number) =>
            {
                // console.log('>>>>>> images.length = ' + value);

                if (value == 0)
                {
                    this._isLoadingContent = false;

                    this._fullApp._threeJsBaseScene.UpdateCameraFit();
                }
            });
    }
}
