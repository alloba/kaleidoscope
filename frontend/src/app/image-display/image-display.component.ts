import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription, zip} from 'rxjs';
import {ImageService} from '../service/image.service';
import {FileMeta} from "../model/file-meta";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.css']
})
export class ImageDisplayComponent implements OnInit, OnDestroy, AfterViewInit {

  private subscriptions: Subscription[] = [];
  public metaInfo: FileMeta = new FileMeta();
  public fileUrl: string = '';
  public currentFilename = '';

  @ViewChild('videoElement')
  public videoElement: ElementRef;
  private nativeVideo: HTMLVideoElement;

  constructor(private imageService: ImageService) {
    //you must work on the native element for actual operations, but for the sake of type-safety, im trying out some mapping logic...
    this.videoElement = new ElementRef<any>('');
    this.nativeVideo = this.videoElement.nativeElement
  }

  ngOnInit(): void {
    const fileInfo$ = zip(this.imageService.filenameUrl$, this.imageService.currentImageMeta$, this.imageService.filename$).subscribe({
      next: value => {
        this.fileUrl = value[0];
        this.metaInfo = value[1];
        this.currentFilename = value[2];
      }
    })

    this.subscriptions.push(fileInfo$);
  }

  ngAfterViewInit(): void {
    this.nativeVideo = this.videoElement.nativeElement;
    this.nativeVideo.volume = 0.5 //stuff too loud on startup.
    this.nativeVideo.onloadeddata = () => this.nativeVideo.play()

    this.videoElement.nativeElement.addEventListener('ended', () => {
      this.transitionImageForward();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe())
  }

  public transitionImageForward(): void {
    this.imageService.loadNextImageInformationSet();
  }

  public transitionImageBackward(): void {
    this.imageService.loadPreviousImageInformationSet();
  }

}
