import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaInfoViewerComponent } from './meta-info-viewer.component';

describe('MetaInfoViewerComponent', () => {
  let component: MetaInfoViewerComponent;
  let fixture: ComponentFixture<MetaInfoViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetaInfoViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaInfoViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
