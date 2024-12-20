import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { InvoicesService } from '../../services/invoices.service';
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
    product_id: ['', Validators.required],
    sales_price: [0, Validators.required],
    discount: [0, Validators.required],
    tax_rate: [0, Validators.required],
    qty: [
      0,
      [
        Validators.required,
        (control: any) => (control.value === 0 ? { nonZero: true } : null),
      ],
    ],
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
    private invoicesService: InvoicesService,
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

  get productArray(): FormArray {
    return this.form.get('product') as FormArray;
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
    if (this.form.valid) {
      this.updateGrandTotal();

      const formData = new FormData();
      formData.append('customer_code', this.form.value.customer);
      formData.append('total', this.total + '');

      this.invoicesService.createInvoice(formData).subscribe({
        next: (data: any) => {
          const id = data?.id;
          // const payload = this.form.value.product;
          const formData = new FormData();
          for (let index = 0; index < this.productArray.length; index++) {
            const product = this.productArray.at(index).value;
            formData.append('qty', product.qty);
            formData.append('price', product.sales_price);
            formData.append('discount', product.discount);
            formData.append('amount', product.total_price);
            formData.append('product_id', product.product_id);
            formData.append('invoice_id', id);

            this.invoicesService.createSales(formData).subscribe({
              next: (response) => {
                console.log('Invoice and Sales created successfully:');

                const calculatedQty = this.qty[index] - product.qty;
                this.productsService
                  .updateQuatity(product.product_id, calculatedQty)
                  .subscribe((response) => {
                    console.log('Invoice created successfully!', response);
                  });
              },
              error: (error) => {
                console.error('Error creating sales:', error);
                alert('Error creating sales!');
              },
            });
          }
        },
        error: (error) => {
          console.error('Error creating invoice:', error);
          alert('Error creating invoice!');
        },
        complete: () => {
          alert('Invoice created successfully!');
          window.location.reload();
        },
      });
    } else {
      alert('Invalid invoice form');
    }
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
