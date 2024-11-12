import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'product-manage',
  standalone: true,
  imports: [RouterLink, MatPaginator, MatTableModule, MatPaginatorModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})
export class ProductManageComponent implements OnInit {
  displayedColumns: string[] = [
    'serial',
    'name',
    'model',
    'price',
    'quantity',
    'image',
    'created_at',
    'updated_at',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productsService: ProductsService) {}
  ngOnInit() {
    this.productsService.getProducts().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator; // Set paginator here after data loads
    });
  }

  onDelete(id: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this item?'
    );
    if (confirmed) {
      this.productsService.deleteProduct(id).subscribe({
        next: () => {
          console.log('Product deleted successfully');
        },
        error: (error) => {
          console.error('Failed to deleting product', error);
        },
        complete: () => {
          this.ngOnInit();
        },
      });
    }
  }
}
