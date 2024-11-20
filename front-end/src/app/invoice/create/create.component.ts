import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor, NgIf } from '@angular/common';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'invoice-create',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
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
  price = 0;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
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

  cards = [{ id: 'card 1' }];
  addCard() {
    this.cards.push({ id: 'card' + this.cards.length });
  }

  removeCard(index: number) {
    this.cards.splice(index, 1);
  }

  hasMoreCard(): boolean {
    return this.cards.length > 1;
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
  }
}

interface ProductData {
  id: number;
  name: string;
  qty: number;
  sales_price: number;
}
