import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatePlaylistComponent } from './private-playlist.component';

describe('PrivatePlaylistComponent', () => {
  let component: PrivatePlaylistComponent;
  let fixture: ComponentFixture<PrivatePlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivatePlaylistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivatePlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
