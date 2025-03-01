import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionExitosaComponent } from './verificacion-exitosa.component';

describe('VerificacionExitosaComponent', () => {
  let component: VerificacionExitosaComponent;
  let fixture: ComponentFixture<VerificacionExitosaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificacionExitosaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificacionExitosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
