import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSuppliersComponent } from './product-suppliers.component';

describe('ProductSuppliersComponent', () => {
  let component: ProductSuppliersComponent;
  let fixture: ComponentFixture<ProductSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSuppliersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
