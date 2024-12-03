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
import { fadeInItems } from '@angular/material/menu';

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
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stackedBarCanvas')
  stackedBarCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart<any> | undefined;
  lineChart: Chart<any> | undefined;
  stackedBarChart: Chart<any> | undefined;

  product_count = 0;
  supplier_count = 0;
  invoice_count = 0;
  sales_count = 0;

  product_sold: number[] = [];
  productName: string[] = [];
  totalAmount: number[] = [];
  dates: Date[] = [];
  totalCustomer: number[] = [];

  constructor(
    private productsService: ProductsService,
    private invoicesService: InvoicesService,
    private salesService: SalesService,
    private suppilersService: SuppilersService
  ) {}
  ngAfterViewInit(): void {
    this.fetch();
  }

  private renderStackedChart() {
    const ctx = this.stackedBarCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    else if (this.stackedBarChart) this.stackedBarChart.destroy();

    this.stackedBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['GG'], // X-axis categories
        datasets: [
          {
            label: 'Yesterday',
            data: ['GG'],
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
          },
          {
            label: 'Today',
            data: ['GG'],
            backgroundColor: 'rgba(153, 102, 255, 0.7)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: ${context.raw} units`,
            },
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Sales Units',
            },
          },
        },
      },
    });
  }

  private renderLineChart() {
    const ctx = this.lineCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy the existing chart instance if it exists
    if (this.lineChart) this.lineChart.destroy();

    // Initialize the Chart.js instance
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.dates, // Array of month labels
        datasets: [
          {
            label: 'Sales',
            data: this.totalAmount, // Data array
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)', // Line color
            borderWidth: 2,
            tension: 0.2, // Smooth curve
          },
        ],
      },
    });
  }

  private renderChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    else if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'doughnut', // Chart type ('bar', 'line', etc.)
      data: {
        labels: this.productName, // Labels for X-axis
        datasets: [
          {
            label: 'Product Sold',
            data: this.product_sold, // Data values
            borderRadius: 1,
            hoverOffset: 8,
            spacing: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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

      const promises: Promise<void>[] = [];
      invoices.forEach((invoice: any, index: number) => {
        const promise = new Promise<void>((resolve) => {
          this.invoicesService.getInvoiceById(invoice.id).subscribe((data) => {
            this.totalAmount[index] = invoice.total;
            this.dates[index] = invoice.created_at.split('T')[0];

            resolve();
          });
        });
        promises.push(promise);
        Promise.all(promises).then(() => {
          this.renderLineChart(); // Create chart once data is ready
        });
      });
    });

    this.salesService.getSales().subscribe((sales) => {
      this.sales_count = sales.length;

      const promises: Promise<void>[] = [];
      sales.forEach((sale: any, index: number) => {
        const promise = new Promise<void>((resolve) => {
          this.salesService.getSalesById(sale.id).subscribe((data) => {
            console.log(JSON.stringify(data, null, 2));
            resolve();
          });
        });
        promises.push(promise);
        Promise.all(promises).then(() => {
          this.renderStackedChart(); // Create chart once data is ready
        });
      });
    });
  }
}
