import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
  cards = [{ title: 'Card 1' }];

  suppliers: any;

  constructor(
    private suppilersService: SuppilersService,
    private productsService: ProductsService
  ) {}
  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.suppilersService.getSuppliers().subscribe((data: any) => {
      this.suppliers = data;
    });
  }

  addCard(): void {
    this.cards.push({
      title: `Card ${this.cards.length + 1}`,
    });

    console.info(this.cards.length);
  }

  removeCard(index: number): void {
    this.cards.splice(index, 1);
    console.info(this.cards.length);
  }

  hasMoreCard(): boolean {
    return this.cards.length > 1;
  }
}
