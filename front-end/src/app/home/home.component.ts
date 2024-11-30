import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { SuppilersService } from '../services/suppliers.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })), // Initial state
      transition(':enter', [animate('300ms ease-in')]), // Enter transition
      transition(':leave', [animate('300ms ease-out')]), // Leave transition
    ]),
  ],
})
export class HomeComponent {
  product_count = 0;
  supplier_count = 0;

  constructor(
    private productsService: ProductsService,
    private suppilersService: SuppilersService
  ) { }
  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.productsService.getProducts().subscribe((products) => {
      this.product_count = products.length;
    });

    this.suppilersService.getSuppliers().subscribe((suppliers) => {
      this.supplier_count = suppliers.length;
    });
  }
}
