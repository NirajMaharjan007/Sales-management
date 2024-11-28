import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { SuppilersService } from '../services/suppliers.service';
import { InvoicesService } from '../services/invoices.service';
import { SalesService } from '../services/sales.service';
import Chart from 'chart.js/auto';

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
export class HomeComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;

  product_count = 0;
  supplier_count = 0;
  invoice_count = 0;
  sales_count = 0;

  product_sold: { [key: number]: number } = {};

  constructor(
    private productsService: ProductsService,
    private suppilersService: SuppilersService,
    private invoicesService: InvoicesService,
    private salesService: SalesService
  ) {}
  ngAfterViewInit(): void {
    this.fetch();
    this.renderChart();
  }

  private renderChart() {}

  fetch() {
    this.productsService.getProducts().subscribe((products) => {
      this.product_count = products.length;
      console.log(JSON.stringify(products, null, 2));
      // this.productSoldCount(products.id);
      products.forEach((product: any) => {
        this.productSoldCount(product.id);
      });
    });

    this.suppilersService.getSuppliers().subscribe((suppliers) => {
      this.supplier_count = suppliers.length;
    });

    this.invoicesService.getInvoices().subscribe((invoices) => {
      this.invoice_count = invoices.length;
    });

    this.salesService.getSales().subscribe((sales) => {
      this.sales_count = sales.length;
    });
  }

  private productSoldCount(index: number) {
    this.salesService.getSalesByProductId(index).subscribe((data) => {
      this.product_sold[index] = data.length;
    });
  }
}
