import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {FileMeta} from "../model/file-meta";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly apiUrl: string;

  public filename$: ReplaySubject<string> = new ReplaySubject<string>();
  public filenameUrl$: ReplaySubject<string> = new ReplaySubject<string>();
  public currentImageMeta$: ReplaySubject<FileMeta> = new ReplaySubject<FileMeta>();

  private currentImageIndex: number = 0;
  private images: string[] = [];

  constructor(private httpClient: HttpClient) {
    this.apiUrl = environment.ImageServiceEndpoint
    this.refreshImageList();
  }

  public loadNextImageInformationSet(): void {
    this.currentImageIndex += 1
    if (this.currentImageIndex >= this.images.length) {
      this.refreshImageList()
    } else {
      this.updateCurrentImage(this.images[this.currentImageIndex])
    }
  }

  public loadPreviousImageInformationSet(): void {
    this.currentImageIndex -= 1;
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = 0;
    } else {
      this.updateCurrentImage(this.images[this.currentImageIndex])
    }
  }

  public refreshImageList(): void {
    this.httpClient.get<[string]>(this.apiUrl + 'imageList')
      .subscribe({
        next: (x) => {
          let shuffleArray = x;
          this.shuffle(shuffleArray);
          this.images = shuffleArray;

          this.currentImageIndex = -1; //start at -1 to deal with the increment behavior of next method call.
          this.loadNextImageInformationSet();
        }
      });
  }

  public updateCurrentImage(filename: string): void {
    this.filename$.next(this.images[this.currentImageIndex])
    this.filenameUrl$.next(this.getImageUrl(filename));

    this.getMetaInfo(filename)
      .subscribe({next: value => this.currentImageMeta$.next(value)})
  }

  public getImageUrl(filename: string): string {
    return this.apiUrl + 'image?imageFile=' + filename
  }

  public getMetaInfo(filename: string): Observable<FileMeta> {
    return this.httpClient.get<FileMeta>(this.apiUrl + 'fileinfo/' + filename);
  }

  /**
   * shuffles inputted array. Mutates data.
   *
   * @param array - item to shuffle
   * @private
   */
  private shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
