import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, Subscription, zip} from 'rxjs';
import { ImageService } from '../service/image.service';
import {FileMeta} from "../model/file-meta";
import {mergeAll, zipAll} from "rxjs/operators";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.css']
})
export class ImageDisplayComponent implements OnInit, OnDestroy, AfterViewInit {

  private subscriptions: Subscription[] = [];
  public metaInfo: FileMeta = new FileMeta();
  private file: Blob = new Blob();
  public imageUrl: SafeUrl = '';
  public currentFilename = '';

  @ViewChild('videoElement')
  public videoElement: ElementRef;

  constructor(private imageService: ImageService, private sanitizer: DomSanitizer) {
    this.videoElement = new ElementRef<any>('');
  }

  ngOnInit(): void {
    const fileInfo$ = zip(this.imageService.currentImage$, this.imageService.currentImageMeta$, this.imageService.filename$).subscribe({
      next: value => {
        this.file = value[0];
        this.metaInfo = value[1];
        this.currentFilename = value[2];

        this.convertImageToUrl(this.file);
      }
    })

    this.subscriptions.push(fileInfo$);
  }

  ngAfterViewInit(): void {
    this.videoElement.nativeElement.volume = 0.5 //stuff too loud on startup.
    this.videoElement.nativeElement.onloadeddata = () => {
      this.videoElement.nativeElement.play()
    }

    this.videoElement.nativeElement.addEventListener('ended', () => {
      this.transitionImageForward();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe())
  }

  public setPlay() {
    (this.videoElement.nativeElement as HTMLVideoElement)
      .load()
  }

  public transitionImageForward(): void {
    this.imageService.loadNextImageInformationSet();
  }

  public transitionImageBackward(): void {
    this.imageService.loadPreviousImageInformationSet();
  }

  private convertImageToUrl(file: Blob) {
    const unsafeImageUrl = URL.createObjectURL(file);
    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImageUrl);
  }

}
