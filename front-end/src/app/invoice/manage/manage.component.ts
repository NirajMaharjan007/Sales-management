import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { InvoicesService } from '../../services/invoices.service';

@Component({
  selector: 'invoice-manage',
  standalone: true,
  imports: [RouterLink, MatPaginator, MatTableModule, MatPaginatorModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})
export class InvoiceManageComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'customer_code',
    'total',
    'created_at',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private invoicesService: InvoicesService) {}

  ngAfterViewInit(): void {
    this.invoicesService.getInvoices().subscribe((data: any) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator; // Set paginator here after data loads
    });
  }

  onDelete(id: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this invoice?'
    );
    if (confirmed) {
      this.invoicesService.deleteInvoice(id).subscribe(() => {
        this.ngAfterViewInit();
      });
    }
  }
}
