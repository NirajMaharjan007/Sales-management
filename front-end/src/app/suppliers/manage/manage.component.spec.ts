import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierManageComponent } from './manage.component';

describe('SupplierManageComponent', () => {
  let component: SupplierManageComponent;
  let fixture: ComponentFixture<SupplierManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierManageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
