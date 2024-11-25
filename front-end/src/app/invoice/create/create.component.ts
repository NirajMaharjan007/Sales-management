import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgClass, NgFor, NgIf } from '@angular/common';
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
  imports: [RouterLink, NgFor, NgIf, NgClass, ReactiveFormsModule],
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

  dataArray = {
    id: ['', Validators.required],
    product_id: ['', Validators.required],
    sales_price: [0, Validators.required],
    discount: [0, Validators.required],
    tax_rate: [0, Validators.required],
    qty: [0, Validators.required],
    total_price: [0, Validators.required],
    isEnough: [true],
  };

  // price: { [key: number]: number } = {};
  qty: { [key: number]: number } = {};
  price: { [key: number]: number } = {};
  discout: { [key: number]: number } = {};

  total = 0;

  form: FormGroup;

  constructor(
    private productsService: ProductsService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      customer: [this.generateRandomHex],
      product: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.addProduct();

    this.fetch();
  }

  private get generateRandomHex(): string {
    return (
      '#' +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')
    );
  }

  private fetch() {
    this.productsService.getProducts().subscribe((data) => {
      this.products = data.map((product: ProductData) => {
        return {
          id: product.id,
          name: product.name,
          sales_price: product.sales_price,
          tax_id: product.tax_id,
          qty: product.qty,
        };
      });
    });
  }

  get productArray() {
    return this.form.get('product') as FormArray;
  }

  onProductChange(event: Event, id: number) {
    const target = event.target as HTMLSelectElement;
    const productId = parseInt(target.value);
    const product = this.products.find(
      (product: ProductData) => product.id === productId
    );

    const productGroup = this.productArray.at(id) as FormGroup;

    this.qty[id] = product ? product.qty : 0;
    this.price[id] = product ? product.sales_price : 0;

    productGroup.patchValue({
      sales_price: product ? product.sales_price : 0,
      tax_rate: product ? product.tax_id : 0,
    });
  }

  private updateGrandTotal() {
    const grandTotal = this.productArray.controls.reduce(
      (sum: any, item: any) => {
        const totalPrice = item.get('total_price')?.value || 0;
        return sum + totalPrice;
      },
      0
    );
    this.total = parseFloat(grandTotal.toFixed(4));
  }

  addProduct() {
    const item = this.fb.group(this.dataArray);

    item.get('qty')?.valueChanges.subscribe((qty) => {
      const index = this.productArray.controls.indexOf(item);
      const availableQuantity = this.qty[index] || 0;
      const price = this.price[index] || 0;

      if (qty) {
        const isEnough = qty <= availableQuantity;
        item.patchValue({ isEnough: isEnough, discount: 0 });

        if (isEnough) {
          const totalPrice = qty * price;
          item.patchValue({ total_price: totalPrice });
          this.updateGrandTotal();

          item.get('discount')?.valueChanges.subscribe((discount) => {
            if (discount) {
              const totalPrice = qty * price - (qty * price * discount) / 100;
              const formattedTotalPrice = parseFloat(totalPrice.toFixed(4));
              item.patchValue({
                total_price: formattedTotalPrice < 0 ? 0 : formattedTotalPrice,
              });
              this.updateGrandTotal();
            }
          });
        } else {
          item.patchValue({ total_price: 0 });
          this.updateGrandTotal();
        }
      }
    });

    this.productArray.push(item);
  }

  hasMoreProducts(): boolean {
    return this.productArray.length > 1;
  }

  removeProduct(index: number) {
    this.productArray.removeAt(index);
    this.updateGrandTotal();
  }

  onSubmit() {
    const payload = this.form.value.product;
    const customer = this.form.value.customer;
    console.info(
      JSON.stringify(payload, null, 2),
      '\nCustomer code:',
      customer
    );
  }

  isEnough(index: number): boolean {
    const item = this.productArray.at(index);
    return item.get('isEnough')?.value;
  }

  isInvalidDiscount(index: number): boolean {
    const item = this.productArray.at(index);
    const discount = item.get('discount')?.value;
    return discount >= 100;
  }
}

interface ProductData {
  id: number;
  name: string;
  qty: number;
  tax_id: number;
  sales_price: number;
}
