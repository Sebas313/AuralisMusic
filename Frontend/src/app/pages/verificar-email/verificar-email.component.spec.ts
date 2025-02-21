import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarEmailComponent } from './verificar-email.component';

describe('VerificarEmailComponent', () => {
  let component: VerificarEmailComponent;
  let fixture: ComponentFixture<VerificarEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificarEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
