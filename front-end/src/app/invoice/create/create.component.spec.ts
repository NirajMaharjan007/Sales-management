import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: InvoiceCreateComponent;
  let fixture: ComponentFixture<InvoiceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
