import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SalesService } from '../services/sales.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [RouterLink, MatPaginator, MatTableModule, MatPaginatorModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'product_id',
    'qty',
    'price',
    'discount',
    'amount',
    'invoice_id',
    'created_at',
  ];

  product_name: { [key: number]: string } = {};

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productsService: ProductsService,
    private salesService: SalesService
  ) {}
  ngAfterViewInit(): void {
    this.salesService.getSales().subscribe((data: any) => {
      this.dataSource.data = data;
      this.dataSource.data.forEach((row) => {
        this.getProductName(row.product_id);
      });
      console.info(JSON.stringify(data, null, 2));
      this.dataSource.paginator = this.paginator; // Set paginator here after data loads
    });
  }

  private getProductName(index: any) {
    this.productsService.getProductById(index).subscribe((data) => {
      this.product_name[index] = data.name;
      this.dataSource.data.forEach((row) => {
        if (row.product_id === index) {
          row.product_name = this.product_name[index];
        }
      });
    });
  }
}
