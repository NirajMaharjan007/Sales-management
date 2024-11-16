import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOutterEditComponent } from './edit.component';

describe('ProductOutterEditComponent', () => {
  let component: ProductOutterEditComponent;
  let fixture: ComponentFixture<ProductOutterEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductOutterEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductOutterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
