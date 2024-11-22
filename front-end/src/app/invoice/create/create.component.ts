import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor, NgIf } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'invoice-create',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, ReactiveFormsModule],
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
export class InvoiceCreateComponent implements OnInit {
  products: any;
  form: FormGroup;
  price = 0;
  quantity = 0;

  constructor(
    private productsService: ProductsService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      product: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      product: this.fb.array([
        this.fb.group({
          id: ['', Validators.required],
          sales_price: ['', Validators.required],
          discount: ['', Validators.required],
          total_price: ['', Validators.required],
          tax_rate: ['', Validators.required],
          qty: ['', Validators.required],
        }),
      ]),
    });

    this.fetch();
  }

  get product(): FormArray {
    return this.form.get('product') as FormArray;
  }

  fetch() {
    this.productsService.getProducts().subscribe((data) => {
      this.products = data.map((product: ProductData) => {
        return {
          id: product.id,
          name: product.name,
          sales_price: product.sales_price,
          qty: product.qty,
        };
      });
    });
  }

  addProduct() {
    this.product.push(
      this.fb.group({
        id: ['', Validators.required],
        sales_price: ['', Validators.required],
        discount: ['', Validators.required],
        total_price: ['', Validators.required],
        tax_rate: ['', Validators.required],
        qty: ['', Validators.required],
      })
    );
  }

  removeProduct(index: number) {
    this.product.removeAt(index);
  }

  hasMoreProduct(): boolean {
    return this.product.length > 1;
  }

  click() {
    console.info('onSubmit; ');
  }

  onProductChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const productId = parseInt(target.value);
    const product = this.products.find(
      (product: ProductData) => product.id === productId
    );
    this.price = product?.sales_price || 0;
    this.quantity = product?.qty || 0;
  }

  onSubmit() {
    console.info(JSON.stringify(this.form.value, null, 2));
  }
}

interface ProductData {
  id: number;
  name: string;
  qty: number;
  sales_price: number;
}
