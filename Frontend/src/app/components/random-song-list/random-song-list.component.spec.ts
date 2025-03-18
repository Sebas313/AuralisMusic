import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomSongListComponent } from './random-song-list.component';

describe('RandomSongListComponent', () => {
  let component: RandomSongListComponent;
  let fixture: ComponentFixture<RandomSongListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomSongListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomSongListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
