import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: TaxCreateComponent;
  let fixture: ComponentFixture<TaxCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
