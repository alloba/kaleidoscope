import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Subscription} from 'rxjs';
import {environment} from 'src/environments/environment';
import {FileMeta} from "../model/file-meta";
import {first} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly apiUrl: string;

  private images$: ReplaySubject<string[]> = new ReplaySubject<string[]>();
  private images: string[] = [];
  public filename$: ReplaySubject<string> = new ReplaySubject<string>()
  private currentImageIndex: number = 0;
  public currentImage$: ReplaySubject<Blob> = new ReplaySubject<Blob>();
  public currentImageMeta$: ReplaySubject<FileMeta> = new ReplaySubject<FileMeta>();

  constructor(private httpClient: HttpClient) {
    this.apiUrl = environment.ImageServiceEndpoint
    this.refreshImageList();
  }

  public loadNextImageInformationSet(): void {
    if (this.currentImageIndex == this.images.length) {
      this.refreshImageList()
    } else {
      this.updateCurrentImage(this.images[this.currentImageIndex])
      this.filename$.next(this.images[this.currentImageIndex])
      this.currentImageIndex += 1
    }
  }

  public refreshImageList(): void {
    this.httpClient.get<[string]>(this.apiUrl + 'imageList')
      .subscribe({
        next: (x) => {
          let shuffleArray = x;
          this.shuffle(shuffleArray);
          this.images$.next(x);
          this.images = shuffleArray;

          this.currentImageIndex = 0;
          this.loadNextImageInformationSet();
        }
      });
  }

  public updateCurrentImage(filename: string): void {
    this.getImage(filename)
      .subscribe({next: x => this.currentImage$.next(x)});

    this.getMetaInfo(filename)
      .subscribe({next: value => this.currentImageMeta$.next(value)})
  }

  public getImage(filename: string): Observable<Blob> {
    return this.httpClient.get(this.apiUrl + 'image?imageFile=' + filename, {responseType: 'blob'})
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
