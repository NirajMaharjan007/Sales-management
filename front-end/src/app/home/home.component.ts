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
  dates: any[] = [];
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
        labels: this.dates, // Array of unique dates
        datasets: [
          {
            label: 'Sales',
            data: this.totalAmount, // Aggregated sales data
            fill: false,
            // borderColor: 'rgba(75, 192, 192, 1)', // Line color
            borderWidth: 2,
            tension: 0.2, // Smooth curve
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            ticks: {
              autoSkip: true, // Automatically skip labels if they overlap
              maxRotation: 32, // Rotate labels by 45 degrees to avoid overlap
              minRotation: 24, // Minimum rotation of the labels
            },
            reverse: true,
            title: {
              display: true,
              text: 'Dates',
            },
          },
        },
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
    });

    this.salesService.getSales().subscribe((sales) => {
      this.sales_count = sales.length;
      // Aggregate sales by date
      const salesByDate = sales.reduce(
        (acc: Record<string, number>, sale: any) => {
          const date = new Date(sale.created_at).toISOString().split('T')[0]; // Extract date part
          acc[date] = (acc[date] || 0) + Number(sale.amount);
          return acc;
        },
        {}
      );

      // Extract unique dates and corresponding sales totals
      this.dates = Object.keys(salesByDate); // Unique dates
      this.totalAmount = Object.values(salesByDate); // Total sales per date

      // Render the line chart with the unique dates
      this.renderLineChart();
    });
  }
}
