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

  product_sold: number[] = [];
  productName: string[] = [];

  constructor(
    private productsService: ProductsService,
    private suppilersService: SuppilersService,
    private invoicesService: InvoicesService,
    private salesService: SalesService
  ) {}
  ngAfterViewInit(): void {
    this.fetch();
  }

  private renderChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar', // Chart type ('bar', 'line', etc.)
      data: {
        labels: this.productName, // Labels for X-axis
        datasets: [
          {
            label: 'Product Sold',
            data: this.product_sold, // Data values
            backgroundColor: ['rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  fetch() {
    this.productsService.getProducts().subscribe((products) => {
      this.product_count = products.length;
      const promises: Promise<void>[] = [];
      products.forEach((product: any, index: number) => {
        this.productName.push(product.name);
        const promise = new Promise<void>((resolve) => {
          this.salesService
            .getSalesByProductId(product.id)
            .subscribe((data) => {
              this.product_sold[index] = data.length;
              resolve();
            });
        });

        promises.push(promise);
      });
      Promise.all(promises).then(() => {
        this.renderChart(); // Create chart once data is ready
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
}
