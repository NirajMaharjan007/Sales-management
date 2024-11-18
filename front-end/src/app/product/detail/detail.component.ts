import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { UnitsService } from '../../services/units.service';
import { SuppilersService } from '../../services/suppliers.service';
@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class ProductDetailComponent {
  id: string | null = null;
  data: any;
  imageUrls: { [key: number]: string } = {};
  categories_name: { [key: number]: string } = {};
  unit_name: { [key: number]: string } = {};

  supplier_data: any;
  supplier_name: { [key: number]: string } = {};
  purchase_price: any[] = [];

  router = inject(Router);
  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private unitsService: UnitsService,
    private suppilersService: SuppilersService
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

    this.productsService.getProductSuppliers(this.id).subscribe({
      next: (data: any) => {
        this.supplier_data = data;
        for (let index = 0; index < data.length; index++) {
          console.log(JSON.stringify(data[index].supplier_id, null, 2));
          this.getSuppliersName(Number(data[index].supplier_id));
          this.purchase_price[data[index].supplier_id] = Number(
            data[index].purchase_price
          );
        }
      },
      error: (err) => {
        console.error('Error: fetching Suppliers' + err);
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

  getSuppliersName(id: number) {
    this.suppilersService.getSupplierById(id).subscribe({
      next: (supplier: any) => {
        this.supplier_name[id] = supplier.name;
      },
      error: (err) => {
        console.error('Error: fetching Supplier Name' + err);
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
