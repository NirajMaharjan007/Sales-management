import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { NgIf } from '@angular/common';

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

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
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
    this.productsService.getProductById(this.id).subscribe((data: any) => {
      console.log(data);
      this.data = data;
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
}
