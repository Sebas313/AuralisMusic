import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Playlst } from './playlst.component';

describe('PlaylistComponent', () => {
  let component: Playlst;
  let fixture: ComponentFixture<Playlst>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Playlst]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Playlst);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
