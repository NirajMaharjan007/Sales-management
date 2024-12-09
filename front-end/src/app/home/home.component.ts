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
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart<any> | undefined;
  lineChart: Chart<any> | undefined;
  barChart: Chart<any> | undefined;

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

  private renderBarChart() {
    const ctx = this.barCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    else if (this.barChart) this.barChart.destroy();

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.dates,
        datasets: [
          {
            label: 'Sales',
            data: this.totalCustomer,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1, // Force steps of 1
              callback: function (value: any) {
                return Math.floor(value); // Convert to integer
              },
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
            tension: 0.24, // Smooth curve
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
      const productSales: { name: string; sales: number }[] = [];

      products.forEach((product: any, index: number) => {
        this.productName.push(product.name);
        const promise = new Promise<void>((resolve) => {
          this.salesService
            .getSalesByProductId(product.id)
            .subscribe((data) => {
              productSales.push({ name: product.name, sales: data.length });
              resolve();
            });
        });

        promises.push(promise);
      });
      Promise.all(promises).then(() => {
        const topProducts = productSales
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5); // Get the top 5 products

        // Extract names and sales for the chart
        this.productName = topProducts.map((p) => p.name);
        this.product_sold = topProducts.map((p) => p.sales);
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
        (
          acc: Record<string, { totalAmount: number; customers: Set<string> }>,
          sale: any
        ) => {
          const date = new Date(sale.created_at).toISOString().split('T')[0]; // Extract date part
          if (!acc[date]) {
            acc[date] = { totalAmount: 0, customers: new Set() };
          }
          acc[date].totalAmount += Number(sale.amount); // Add sale amount
          acc[date].customers.add(sale.invoice_id); // Track unique customers (assuming `customer_id` exists)
          return acc;
        },
        {}
      );

      // Extract unique dates and corresponding sales totals
      this.dates = Object.keys(salesByDate); // Unique dates
      this.totalAmount = this.dates.map(
        (date) => salesByDate[date].totalAmount
      ); // Total sales per date
      this.totalCustomer = this.dates.map(
        (date) => salesByDate[date].customers.size
      ); // Total customers per date

      // Render the line chart with the unique dates
      this.renderLineChart();
      this.renderBarChart();
    });
  }
}
