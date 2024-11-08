import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { UnitsService } from '../../services/units.service';
import { TaxService } from '../../services/tax.service';
import { SuppilersService } from '../../services/suppliers.service';
import { ProductsService } from '../../services/products.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'product-create',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ProductCreateComponent implements OnInit {
  categories: any;
  units: any;
  taxes: any;
  suppliers: any;
  productForm: FormGroup;

  constructor(
    private categoriesService: CategoriesService,
    private unitsService: UnitsService,
    private taxService: TaxService,
    private suppilersService: SuppilersService,
    private productsService: ProductsService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      serial_number: ['', Validators.required],
      model: ['', Validators.required],
      category_id: ['', [Validators.required]],
      tax_id: ['', [Validators.required]],
      unit_id: ['', [Validators.required]],
      sales_price: ['', [Validators.required, Validators.min(0)]],
      qty: ['', [Validators.required, Validators.min(1)]],
      image: ['', [Validators.required]],
    });

    /**
     * TODO:  supplier_id: ['', [Validators.required]],
      purchase_price: ['', [Validators.required]],
     */
  }
  ngOnInit(): void {
    try {
      this.fetch();
    } catch (error) {
      console.error(error);
    }
  }

  fetch() {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.unitsService.getUnits().subscribe((units) => {
      this.units = units;
    });
    this.taxService.getTaxes().subscribe((taxes) => {
      this.taxes = taxes;
    });
    this.suppilersService.getSuppliers().subscribe((suppliers) => {
      this.suppliers = suppliers;
    });
  }

  cards: { title: string }[] = [{ title: 'Card 1' }];
  addCard(): void {
    this.cards.push({
      title: `Card ${this.cards.length + 1}`,
    });
  }

  removeCard(index: number): void {
    this.cards.splice(index, 1);
  }

  hasMoreCard(): boolean {
    return this.cards.length > 1;
  }

  onSubmit() {
    console.log(JSON.stringify(this.productForm.value, null, 2));

    if (this.productForm.valid) {
      this.productsService.createProduct(this.productForm.value).subscribe({
        next: (response) => {
          console.log(response);
          alert(response);
        },
        error: (error) => {
          alert('An error occurred. Please try again.');
        },
      });
    } else {
      alert('invalid input');
    }
  }
}
