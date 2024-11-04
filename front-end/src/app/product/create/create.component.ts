import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { UnitsService } from '../../services/units.service';
import { TaxService } from '../../services/tax.service';
import { SuppilersService } from '../../services/suppliers.service';

@Component({
  selector: 'product-create',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, NgFor],
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

  constructor(
    private categoriesService: CategoriesService,
    private unitsService: UnitsService,
    private taxService: TaxService,
    private suppilersService: SuppilersService
  ) {}
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

  isNull(variable: any) {
    return variable === null || variable === undefined;
  }
}
