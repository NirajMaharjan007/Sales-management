import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'invoice-create',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class InvoiceCreateComponent {}