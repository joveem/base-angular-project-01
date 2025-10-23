import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { ImageLoadingService } from '@contexts/jovdk-web';
import { ImgLoadingDirective } from '@contexts/app/features/custom-directives/img-loading.directive';
import { FullAppComponent } from './full-app/full-app.component';

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
    private readonly imageLoadingService: ImageLoadingService = inject(ImageLoadingService);

    _isLoadingContent = true;

    // parts
    @ViewChild('_threeJsBaseScene') _fullApp!: FullAppComponent;

    constructor()
    {
        this.imageLoadingService.imagesLoading$.subscribe(
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
