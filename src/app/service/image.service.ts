import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {FileMeta} from '../model/file-meta';
import {ListObjectsV2Command, ListObjectsV2CommandOutput, S3Client} from '@aws-sdk/client-s3';
import {fromPromise} from "rxjs/internal-compatibility";


@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly bucketUrlPath: string;

  public filename$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public filenameUrl$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public currentImageMeta$: BehaviorSubject<FileMeta> = new BehaviorSubject<FileMeta>(new FileMeta());
  public imageListSize$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public imageIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public directoryList$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['/']);
  public subDirectory = '';

  private currentImageIndex = 0;
  private images: string[] = [];

  private allImagesEver: string[] = [];

  private REGION = environment.awsRegion;
  private s3 = new S3Client({
    region: this.REGION,
    credentials: {
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey
    }
  });

  constructor() {
    this.bucketUrlPath = environment.bucketUrlPath;
    fromPromise(this.loadAllImages()).subscribe(x => {
      this.allImagesEver = x;
      this.directoryList$.next(this.loadDirectoryList(x))
      this.refreshImageList2();
    })
  }

  private loadDirectoryList(imagePaths: string[]){
    let dirs = new Set<string>();
    dirs.add('*');
    imagePaths.forEach(x => {
      if(x.split("/").length > 1){
        dirs.add(x.split("/")[0])
      }
    })
    return Array.from(dirs);
  }

  private async loadAllImages(){
    let imageKeys: string[] = [];
    let continuationToken: string | undefined = undefined
    while(true){
      let data: ListObjectsV2CommandOutput = await this.s3.send(new ListObjectsV2Command({Delimiter: "", Bucket: environment.awsBucket, ContinuationToken: continuationToken}));
      let filterKeys = data.Contents?.map(x => x.Key).filter(x => x != undefined) as string[];
      imageKeys.push(...filterKeys)
      if(!data.IsTruncated){
        break;
      }
      continuationToken = data.NextContinuationToken;
    }

    return imageKeys;
  }

  public loadNextImageInformationSet(): void {
    this.currentImageIndex += 1;
    if (this.currentImageIndex >= this.images.length) {
      this.refreshImageList2();
    } else {
      this.updateCurrentImage(this.images[this.currentImageIndex]);
    }
  }

  public loadPreviousImageInformationSet(): void {
    this.currentImageIndex -= 1;
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = 0;
    } else {
      this.updateCurrentImage(this.images[this.currentImageIndex]);
    }
  }

  private getSubListOfImages(dir: string){
    if(dir == "" || dir == "/" || dir == '*')
      return this.allImagesEver;
    return this.allImagesEver.filter(x => x.startsWith(dir))
  }

  public refreshImageList2(): void {
    const shuffleArray = this.getSubListOfImages(this.subDirectory);
    this.shuffle(shuffleArray);
    this.images = shuffleArray;
    this.imageListSize$.next(shuffleArray.length);

    this.currentImageIndex = -1; // start at -1 to deal with the increment behavior of next method call.
    this.loadNextImageInformationSet();
  }

  public updateCurrentImage(filename: string): void {
    this.filename$.next(this.images[this.currentImageIndex]);
    this.filenameUrl$.next(this.getImageUrl(filename));
    this.imageIndex$.next(this.currentImageIndex);
  }

  public getImageUrl(filename: string): string {
    return this.bucketUrlPath + filename;
  }

  /**
   * shuffles inputted array. Mutates data.
   *
   * @param array - item to shuffle
   * @private
   */
  private shuffle(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  public changeSubDir(dir: string): void {
    this.subDirectory = dir;
    this.refreshImageList2();
  }
}
