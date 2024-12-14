import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SuppilersService } from '../../services/suppliers.service';

@Component({
  selector: 'supplier-manage',
  standalone: true,
  imports: [RouterLink, MatPaginator, MatTableModule, MatPaginatorModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})
export class SupplierManageComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'mobile',
    'address',
    'details',
    'previous_balance',
    'created_at',
    'updated_at',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private suppilersService: SuppilersService) {}
  ngAfterViewInit() {
    this.suppilersService.getSuppliers().subscribe((data: any) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator; // Set paginator here after data loads
    });
  }

  onDelete(id: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this item?'
    );
    if (confirmed) {
      this.suppilersService.deleteSupplier(id).subscribe({
        next: () => {
          console.log('Supplier deleted successfully');
        },
        error: (error) => {
          console.error('Failed deleting Supplier', error);
        },
        complete: () => {
          this.ngAfterViewInit();
        },
      });
    }
  }
}
