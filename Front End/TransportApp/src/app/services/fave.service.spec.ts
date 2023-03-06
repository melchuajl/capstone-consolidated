import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { FaveService } from './fave.service';

describe('FaveService', () => {
  let service: FaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(FaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
