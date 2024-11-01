import { TestBed } from '@angular/core/testing';

import { SuppilersService } from './suppliers.service';

describe('SuppilersService', () => {
  let service: SuppilersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuppilersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
