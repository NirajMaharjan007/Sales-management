import { RouterLink } from '@angular/router';
import { TaxCreateComponent } from '../create/create.component';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { TaxService } from '../../services/tax.service';

@Component({
  selector: 'tax-manage',
  standalone: true,
  imports: [
    RouterLink,
    TaxCreateComponent,
    MatPaginator,
    MatTableModule,
    MatPaginatorModule,
    MatIcon,
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class TaxIndexComponent implements AfterViewInit {
  source = new MatTableDataSource<any>();
  cols: string[] = ['id', 'created_at', 'actions'];

  data: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private taxService: TaxService) {}

  ngAfterViewInit() {
    this.taxService.getTaxes().subscribe((data) => {
      this.source.data = data;
      this.source.paginator = this.paginator; // Set paginator here after data loads
    });
  }
}
