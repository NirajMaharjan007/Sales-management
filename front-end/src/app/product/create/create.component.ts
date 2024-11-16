import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { UnitsService } from '../../services/units.service';
import { TaxService } from '../../services/tax.service';
import { ProductsService } from '../../services/products.service';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'product-create',
  standalone: true,
  imports: [RouterLink, NgFor, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ProductCreateComponent implements OnInit {
  categories: any;
  units: any;
  taxes: any;
  suppliers: any;
  selectedFile: File | null = null;
  productForm: FormGroup;

  constructor(
    private categoriesService: CategoriesService,
    private unitsService: UnitsService,
    private taxService: TaxService,
    private productsService: ProductsService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      serial_number: ['', Validators.required],
      model: ['', Validators.required],
      category_id: ['', [Validators.required]],
      tax_id: ['', [Validators.required]],
      unit_id: ['', [Validators.required]],
      sales_price: ['', [Validators.required, Validators.min(0)]],
      qty: ['', [Validators.required, Validators.min(1)]],
      image: [null, [Validators.required]],
    });
  }
  ngOnInit(): void {
    try {
      this.fetch();
    } catch (error) {
      console.error(error);
    }
  }

  fetch() {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.unitsService.getUnits().subscribe((units) => {
      this.units = units;
    });
    this.taxService.getTaxes().subscribe((taxes) => {
      this.taxes = taxes;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    console.log(JSON.stringify(this.productForm.value, null, 2));

    if (this.productForm.valid && this.selectedFile) {
      this.productsService
        .createProduct(this.productForm.value, this.selectedFile)
        .subscribe({
          next: (response: any) => {
            alert('Product added successfully!');
            this.productForm.reset();
          },
          error: (error) => {
            if (
              error?.error?.serial_number &&
              error.error.serial_number[0] ===
                'A product with this serial number already exists.'
            ) {
              alert('Error: A product with this serial number already exists.');
            } else {
              alert('An error occurred. Please try again.');
            }
          },
        });
    } else {
      alert('invalid input');
    }
  }
}
