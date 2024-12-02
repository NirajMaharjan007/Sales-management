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

  chart: Chart<any> | undefined;
  lineChart: Chart<any> | undefined;

  product_count = 0;
  supplier_count = 0;
  invoice_count = 0;
  sales_count = 0;

  product_sold: number[] = [];
  productName: string[] = [];
  totalAmount: number[] = [];

  constructor(
    private productsService: ProductsService,
    private suppilersService: SuppilersService,
    private invoicesService: InvoicesService,
    private salesService: SalesService
  ) {}

  ngAfterViewInit(): void {
    this.fetch();
  }

  private renderLineChart() {
    const ctx = this.lineCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    else if (this.lineChart) this.lineChart.destroy();

    const options = {
      //   title: 'Monthly Sales',
      curveType: 'function',
      legend: { position: 'bottom' },
      backgroundColor: 'transparent',
      titleTextStyle: {
        color: '#212529',
        fontSize: 24,
        bold: true,
      },
      hAxis: {
        title: 'Month',
        titleTextStyle: { color: '#212529' },
        textStyle: { color: '#212529' },
      },
      vAxis: {
        title: 'Sales Figure',
        titleTextStyle: { color: '#212529' },
        textStyle: { color: '#212529' },
        gridlines: { color: '#e0e0e0' },
      },
      series: {
        0: { color: '#28a745' },
      },
    };

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Sales',
            data: this.totalAmount, // Data values
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: options,
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
            spacing: 2,
          },
        ],
      },
      options: {
        responsive: true,
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
    });
  }
}
