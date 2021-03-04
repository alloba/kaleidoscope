import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Subject, Subscription, zip} from 'rxjs';
import {ImageService} from '../service/image.service';
import {FileMeta} from "../model/file-meta";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.css']
})
export class ImageDisplayComponent implements OnInit, OnDestroy, AfterViewInit {

  public metaInfo$: BehaviorSubject<FileMeta>;
  public fileUrl$: BehaviorSubject<string>;
  public filename$: BehaviorSubject<string>;
  public imageIndex$: BehaviorSubject<number>;
  public imageListSize$: BehaviorSubject<number>;
  public directoryList$: BehaviorSubject<string[]>

  @ViewChild('videoElement')
  public videoElement: ElementRef;
  private nativeVideo: HTMLVideoElement;

  constructor(private imageService: ImageService) {
    //you must work on the native element for actual operations, but for the sake of type-safety, im trying out some mapping logic...
    this.videoElement = new ElementRef<any>('');
    this.nativeVideo = this.videoElement.nativeElement;

    this.metaInfo$ = this.imageService.currentImageMeta$;
    this.fileUrl$ = this.imageService.filenameUrl$;
    this.filename$ = this.imageService.filename$;
    this.imageIndex$ = this.imageService.imageIndex$;
    this.imageListSize$ = this.imageService.imageListSize$;
    this.directoryList$ = this.imageService.directoryList$;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.nativeVideo = this.videoElement.nativeElement;
    this.nativeVideo.volume = 0.2 //stuff too loud on startup.
    this.nativeVideo.onloadeddata = () => this.nativeVideo.play()

    this.videoElement.nativeElement.addEventListener('ended', () => {
      this.transitionImageForward();
    });
  }

  ngOnDestroy(): void {
  }

  public transitionImageForward(): void {
    this.imageService.loadNextImageInformationSet();
  }

  public transitionImageBackward(): void {
    this.imageService.loadPreviousImageInformationSet();
  }

  public getImageUrl(filename: string | null){
    if(filename == null)
      return '';
    return this.imageService.getImageUrl(filename)
  }

  public setSubDirectory(dir: string) {
    this.imageService.changeSubDir(dir)
  }

  public decodeFilename(filename: string){
    return decodeURIComponent(filename);
  }
}
