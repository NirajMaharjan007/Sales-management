import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { UnitsService } from '../../services/units.service';
import { TaxService } from '../../services/tax.service';
import { SuppilersService } from '../../services/suppliers.service';
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
  imports: [RouterLink, NgFor, ReactiveFormsModule, NgIf],
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
  cards: { title: string }[] = [{ title: 'Card 1' }];
  productForm: FormGroup;

  get getRandomNumber(): number {
    const min = 1,
      max = 1024;
    return Math.floor(Math.random() * (max - min) + min);
  }

  constructor(
    private categoriesService: CategoriesService,
    private unitsService: UnitsService,
    private taxService: TaxService,
    private suppilersService: SuppilersService,
    private productsService: ProductsService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      id: [this.getRandomNumber],
      name: ['', [Validators.required, Validators.minLength(3)]],
      serial_number: ['', Validators.required],
      model: ['', Validators.required],
      category_id: ['', [Validators.required]],
      tax_id: ['', [Validators.required]],
      unit_id: ['', [Validators.required]],
      sales_price: ['', [Validators.required, Validators.min(0)]],
      qty: ['', [Validators.required, Validators.min(1)]],
      image: [null, [Validators.required]],
      suppliers: this.fb.array([
        this.fb.group({
          supplier_id: ['', Validators.required],
          purchase_price: ['', [Validators.required]],
        }),
      ]),
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
    this.suppilersService.getSuppliers().subscribe((suppliers) => {
      this.suppliers = suppliers;
    });
  }

  addCard(): void {
    this.cards.push({
      title: `Card ${this.cards.length + 1}`,
    });

    console.info(this.cards.length);
  }

  removeCard(index: number): void {
    this.cards.splice(index, 1);
    console.info(this.cards.length);
  }

  hasMoreCard(): boolean {
    return this.cards.length > 1;
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
            // const supplierData = {
            //   product_id: response.id,
            //   supplier_id: response.supplier_id,
            //   purchase_price: response.purchase_price,
            // };
            const data = new FormData();
            data.append('product_id', response.id);
            data.append('supplier_id', response.supplier_id);
            data.append('purchase_price', response.purchase_price);
            console.log(JSON.stringify(data, null, 2));

            this.productsService.createProductSupplier(data).subscribe({
              next: () => alert('Product and suppliers added successfully!'),
              error: () => alert('Failed to add suppliers'),
            });
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

    this.productForm.patchValue({ id: this.getRandomNumber });
  }
}
