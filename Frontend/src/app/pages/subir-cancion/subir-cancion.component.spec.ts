import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirCancionComponent } from './subir-cancion.component';

describe('SubirCancionComponent', () => {
  let component: SubirCancionComponent;
  let fixture: ComponentFixture<SubirCancionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubirCancionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubirCancionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
