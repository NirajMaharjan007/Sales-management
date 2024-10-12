import { Component } from '@angular/core';
import { ProductCreateComponent } from '../create/create.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})
export class ProductManageComponent {}
