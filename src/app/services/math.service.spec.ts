import { TestBed } from '@angular/core/testing';

import { MathService } from './math.service';

describe('MathService', () => {
  let service: MathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('shuld sum two numbers', () => {
    pending(); // Indicates to jasmine that this test is not yet ready to execute
  });

  it('shuld subtract two numbers', () => {
    fail(); // Simulate a failing test case
  });
});
