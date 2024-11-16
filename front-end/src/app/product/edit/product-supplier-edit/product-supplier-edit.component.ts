import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'product-supplier-edit',
  standalone: true,
  imports: [],
  templateUrl: './product-supplier-edit.component.html',
  styleUrl: './product-supplier-edit.component.css',
})
export class ProductSupplierEditComponent implements OnInit {
  @Input() id: any;

  ngOnInit(): void {
    // Fetch product suppliers and populate the dropdown
  }
}
