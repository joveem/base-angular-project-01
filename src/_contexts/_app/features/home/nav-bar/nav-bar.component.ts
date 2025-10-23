import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ImgLoadingDirective } from '../../custom-directives/img-loading.directive';
import { LocalizationLanguageOption, LocalizationService } from '@contexts/jovdk-web';

@Component({
    selector: 'app-nav-bar',
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        ImgLoadingDirective,
    ],
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
    private readonly localizationService: LocalizationService = inject(LocalizationService);

    readonly languageOptions: ReadonlyArray<LocalizationLanguageOption> =
        this.localizationService.availableLanguages;

    _isSelectingLanguage = false;

    get currentLanguage(): LocalizationLanguageOption {
        return this.localizationService.currentLanguage;
    }

    translate(termKey: string): string {
        return this.localizationService.translate(termKey);
    }

    OpenLanguageSelectionButton = () => {
        if (!this._isSelectingLanguage) {
            this._isSelectingLanguage = true;
        }
    };

    LanguageOptionButton = (languageId: string) => {
        this._isSelectingLanguage = false;
        this.localizationService.setLanguage(languageId);
    };
}

