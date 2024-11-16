import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SuppilersService } from '../../../services/suppliers.service';
import { TaxService } from '../../../services/tax.service';
import { UnitsService } from '../../../services/units.service';
import { CategoriesService } from '../../../services/categories.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'product-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgFor],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
})
export class ProductEditComponent implements OnInit {
  @Input() id: any;

  cards: { title: string }[] = [{ title: 'Card 1' }];
  categories: any;
  units: any;
  taxes: any;
  suppliers: any;
  selectedFile: File | null = null;

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
      image: [null, [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.fetch();
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onSubmit() {}
}
