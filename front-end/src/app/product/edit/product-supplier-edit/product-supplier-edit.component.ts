import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { SuppilersService } from '../../../services/suppliers.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'product-supplier-edit',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './product-supplier-edit.component.html',
  styleUrl: './product-supplier-edit.component.css',
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
export class ProductSupplierEditComponent implements OnInit {
  @Input() id: any;

  data: any;

  form: FormGroup;

  constructor(
    private suppilersService: SuppilersService,
    private productsService: ProductsService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      suppliers: this.fb.array([]),
    });
  }

  get suppliers(): FormArray {
    return this.form.get('suppliers') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      suppliers: this.fb.array([
        this.fb.group({
          supplier_id: ['', Validators.required],
          purchase_price: ['', Validators.required],
          product_id: this.id,
        }),
      ]),
    });
    this.fetch();
  }

  fetch() {
    this.suppilersService.getSuppliers().subscribe((data: any) => {
      this.data = data;
    });
  }

  addSupplier() {
    const supplierGroup = this.fb.group({
      supplier_id: ['', Validators.required],
      purchase_price: ['', Validators.required],
      product_id: this.id,
    });

    this.suppliers.push(supplierGroup);
  }

  removeSupplier(index: number) {
    this.suppliers.removeAt(index);
  }

  hasMoreSupplier(): boolean {
    return this.suppliers.length > 1;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const payload = this.form.value.suppliers;

      console.info(JSON.stringify(payload, null, 2));
      this.productsService.createProductSupplier(this.id, payload).subscribe({
        next: (response: any) => {
          alert('Product supplier updated successfully!');
          console.log(response);
        },
        error: (error) => {
          console.error(error.message);
          alert('Failed to update product supplier.');
        },
      });
    } else {
      alert('Please fill all required fields.');
    }
  }
}
