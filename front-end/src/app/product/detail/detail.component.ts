import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { UnitsService } from '../../services/units.service';
@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class ProductDetailComponent {
  id: string | null = null;
  data: any;
  imageUrls: { [key: number]: string } = {};
  categories_name: { [key: number]: string } = {};
  unit_name: { [key: number]: string } = {};
  router = inject(Router);
  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private unitsService: UnitsService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id !== null) {
        this.fetchProduct();
        this.loadImage(Number(this.id)); // Assuming the product id is a number
      }
    });
  }

  fetchProduct() {
    this.productsService.getProductById(this.id).subscribe({
      next: (data: any) => {
        this.data = data;
        this.getCategoryName(Number(data.category_id));
        this.getUnitName(Number(data.unit_id));
      },
      error: (err) => {
        this.router.navigate(['/404/']);
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
}
