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
  price: { [key: number]: number } = {};

  form: FormGroup;

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
          id: [''],
          name: [''],
          sales_price: [''],
          qty: [''],
          tax: [''],
        }),
      ]),
    });

    this.fetch();
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

  get productArray() {
    return this.form.get('product') as FormArray;
  }

  addProduct() {
    this.productArray.push(
      this.fb.group({
        id: [''],
        name: [''],
        sales_price: [''],
        qty: [''],
        tax: [''],
      })
    );
  }

  removeProducts(index: number) {
    this.productArray.removeAt(index);
  }

  hasMoreProducts(): boolean {
    return this.productArray.length > 1;
  }
  onSubmit() {
    const payload = this.form.value.product;
    console.info(JSON.stringify(payload, null, 2));
  }

  onProductChange(event: Event, id: number) {
    const target = event.target as HTMLSelectElement;
    const productId = parseInt(target.value);
    const product = this.products.find(
      (product: ProductData) => product.id === productId
    );

    this.price[id] = product?.sales_price;
  }
}

interface ProductData {
  id: number;
  name: string;
  qty: number;
  sales_price: number;
}
