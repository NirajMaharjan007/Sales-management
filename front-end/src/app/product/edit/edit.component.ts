import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class ProductEditComponent {}
