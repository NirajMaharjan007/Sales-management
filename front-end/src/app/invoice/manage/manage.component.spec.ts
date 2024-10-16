import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceManageComponent } from './manage.component';

describe('InvoiceManageComponent', () => {
  let component: InvoiceManageComponent;
  let fixture: ComponentFixture<InvoiceManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceManageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
