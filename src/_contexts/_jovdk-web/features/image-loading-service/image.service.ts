import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ImageLoadingService
{
    private readonly loadingCounter$ = new BehaviorSubject<number>(0);
    private readonly trackedImages = new Map<HTMLElement, boolean>();

    readonly imagesLoading$ = this.loadingCounter$.asObservable();

    imageLoading(img: HTMLElement)
    {
        if (!this.trackedImages.has(img) || this.trackedImages.get(img))
        {
            this.trackedImages.set(img, false);
            this.incrementCounter();
        }
    }

    forceImageLoadingCount = () =>
    {
        this.incrementCounter();
    }

    imageLoadedOrError(img: HTMLElement)
    {
        if (this.trackedImages.has(img) && !this.trackedImages.get(img))
        {
            this.trackedImages.set(img, true);
            this.decrementCounter();
        }
    }

    forceImageLoadingUncount = () =>
    {
        this.decrementCounter();
    }

    private incrementCounter(): void
    {
        this.loadingCounter$.next(this.loadingCounter$.value + 1);
    }

    private decrementCounter(): void
    {
        const nextValue = Math.max(0, this.loadingCounter$.value - 1);
        this.loadingCounter$.next(nextValue);
    }
}
