import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, pipe, ReplaySubject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {FileMeta} from "../model/file-meta";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly apiUrl: string;

  public filename$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public filenameUrl$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public currentImageMeta$: BehaviorSubject<FileMeta> = new BehaviorSubject<FileMeta>(new FileMeta());
  public imageListSize$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public imageIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public directoryList$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['/']);
  public subDirectory = '';

  private currentImageIndex: number = 0;
  private images: string[] = [];

  constructor(private httpClient: HttpClient) {
    this.apiUrl = environment.ImageServiceEndpoint
    this.refreshImageList();
    this.loadDirectoryList();
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
    this.httpClient.get<[string]>(this.apiUrl + 'image-list' + '?subDir=' + encodeURIComponent(this.subDirectory))
      .subscribe({
        next: (x) => {
          let shuffleArray = x;
          this.shuffle(shuffleArray);
          this.images = shuffleArray;
          this.imageListSize$.next(x.length)

          this.currentImageIndex = -1; //start at -1 to deal with the increment behavior of next method call.
          this.loadNextImageInformationSet();
        }
      });
  }

  public updateCurrentImage(filename: string): void {
    this.filename$.next(this.images[this.currentImageIndex])
    this.filenameUrl$.next(this.getImageUrl(filename));
    this.imageIndex$.next(this.currentImageIndex);
  }

  public getImageUrl(filename: string): string {
    return this.apiUrl + 'image?imageFile=' + filename
  }

  public loadDirectoryList(): void {
    this.httpClient.get<string[]>(this.apiUrl + 'available-directories')
      .subscribe({
        next: resp => {
          console.log('found directories: ', resp)
          this.directoryList$.next(resp)
        }
      })
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

  changeSubDir(dir: string) {
    this.subDirectory = dir;
    this.refreshImageList();
  }
}
