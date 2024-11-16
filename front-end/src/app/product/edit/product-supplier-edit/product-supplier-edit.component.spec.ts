import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSupplierEditComponent } from './product-supplier-edit.component';

describe('ProductSupplierEditComponent', () => {
  let component: ProductSupplierEditComponent;
  let fixture: ComponentFixture<ProductSupplierEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSupplierEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSupplierEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
