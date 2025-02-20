import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { cantanteGuard } from './cantante.guard';

describe('cantanteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => cantanteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
