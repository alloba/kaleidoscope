import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ImageService } from '../service/image.service';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.css']
})
export class ImageDisplayComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private currentImageList: string[] = [];

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
    const imageListSub = this.imageService.getImageListSub().subscribe({next: (x) => {this.currentImageList = x; console.log(x)}})

    this.subscriptions.push(imageListSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe())
  }

  public loadRandomImage(): void{
    this.imageService.getRandomImage().subscribe({
      next: (x) => {console.log('completed call'); console.log(x)},
      error: (x) => console.log(x)
    })
  }

  public getCurrentImageList(): void{
    console.log( this.currentImageList );
  }

}
