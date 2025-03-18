import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistUserComponent } from './playlist-user.component';

describe('PlaylistUserComponent', () => {
  let component: PlaylistUserComponent;
  let fixture: ComponentFixture<PlaylistUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
