import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductSupplierEditComponent } from './product-supplier-edit/product-supplier-edit.component';
import { NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'product-outter-edit',
  standalone: true,
  imports: [ProductEditComponent, ProductSupplierEditComponent, NgIf],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
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
export class ProductOutterEditComponent implements OnInit {
  id: string | null = null;

  stage = true;

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id'); // 'id' is the name of the parameter
    });
  }

  change() {
    this.stage = !this.stage;
    // console.info(this.stage);
  }
}
