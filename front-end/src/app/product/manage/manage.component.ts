import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProductsService } from '../../services/products.service';
import { NgIf } from '@angular/common';
import { CategoriesService } from '../../services/categories.service';
import { UnitsService } from '../../services/units.service';

@Component({
  selector: 'product-manage',
  standalone: true,
  imports: [NgIf, RouterLink, MatPaginator, MatTableModule, MatPaginatorModule],
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
    'tax',
    'categories',
    'unit',
    'image',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>();

  imageUrls: { [key: number]: string } = {};
  categories_name: { [key: number]: string } = {};
  unit_name: { [key: number]: string } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private unitsService: UnitsService
  ) {}
  ngOnInit() {
    this.productsService.getProducts().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.data.forEach((product: any) => {
        this.loadImage(product.id);
        this.getCategoryName(product.category_id);
        this.getUnitName(product.unit_id);
      });
      this.dataSource.paginator = this.paginator; // Set paginator here after data loads
    });
  }

  getUnitName(id: number) {
    this.unitsService.getById(id).subscribe({
      next: (unit: any) => {
        this.unit_name[id] = unit.name;
      },
      error: (err) => {
        console.error('Error: fetching Unit Name' + err);
      },
    });
  }

  getCategoryName(id: number) {
    this.categoriesService.getCategoryById(id).subscribe({
      next: (category: any) => {
        this.categories_name[id] = category.name;
      },
      error: (err) => {
        console.error('Error: fetching Category Name' + err);
      },
    });
  }

  loadImage(id: number) {
    this.productsService.getProductImage(id).subscribe({
      next: (imageBlob: Blob) => {
        this.imageUrls[id] = URL.createObjectURL(imageBlob);
        // product.imageUrl = URL.createObjectURL(imageBlob);
      },
      error: (err) => {
        console.error('Error: fetching Image' + err);
      },
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
