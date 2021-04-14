import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ImageService} from '../service/image.service';
import {FileMeta} from "../model/file-meta";

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

  constructor(private imageService: ImageService, private changeRef: ChangeDetectorRef) {
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

    /*
    TODO: i really want to get consistent sizing going for PIP, across video changes.
          https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API
          That link above says you can apply css styling to the pip window.... so probably try that.
     */

   /* These controls are for picture-in-picture functionality.
      Angular doesnt support mediaSession type automatically (read: conveniently). So we're going bog-standard script + ts-ignore for this.

      Manual change detection is required here due to operating outside of an angular context (inside action handlers),
        otherwise the target file will update in memory, but the page itself will not reflect the change.
    */
    if('mediaSession' in navigator){
      // @ts-ignore
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.transitionImageBackward()
        this.changeRef.detectChanges();
      });
      // @ts-ignore
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.transitionImageForward()
        this.changeRef.detectChanges();
      });

      // @ts-ignore
      navigator.mediaSession.setActionHandler('play', () => {
        this.videoElement.nativeElement.play();
      });

      // @ts-ignore
      navigator.mediaSession.setActionHandler('pause', () => {
        this.videoElement.nativeElement.pause();
      });
    }

    this.filename$.subscribe(x => console.log(x))
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

  public getMediaType(): Observable {
    return this.filename$.pipe(x => x.split(".")[1]); 
  }
}
