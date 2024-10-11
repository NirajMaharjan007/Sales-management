import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxIndexComponent } from './index.component';

describe('IndexComponent', () => {
  let component: TaxIndexComponent;
  let fixture: ComponentFixture<TaxIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxIndexComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
