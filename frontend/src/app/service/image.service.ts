import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private apiUrl: string;
  private imagesSubject: ReplaySubject<string[]> = new ReplaySubject<string[]>();

  constructor(private httpClient: HttpClient) {
    this.apiUrl = environment.ImageServiceEndpoint
    this.updateImages();
  }

  public getRandomImage(): Observable<Blob> {
    return this.httpClient.get(this.apiUrl + 'randomImage', {responseType: 'blob'})
  }

  public updateImages(): void {
    this.httpClient.get<[string]>(this.apiUrl + 'imageList').subscribe({next: (x) => this.imagesSubject.next(x)});
  }

  public getImageListSub(): ReplaySubject<string[]> {
    return this.imagesSubject;
  } 
}
