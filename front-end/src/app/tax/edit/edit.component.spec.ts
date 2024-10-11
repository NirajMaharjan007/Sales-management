import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxEditComponent } from './edit.component';

describe('TaxEditComponent', () => {
  let component: TaxEditComponent;
  let fixture: ComponentFixture<TaxEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
