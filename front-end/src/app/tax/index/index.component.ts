import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaxCreateComponent } from '../create/create.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink, TaxCreateComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class TaxIndexComponent {}
