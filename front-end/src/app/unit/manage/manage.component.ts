import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { UnitsService } from '../../services/units.service';

@Component({
  selector: 'unit-manage',
  standalone: true,
  imports: [RouterLink, MatPaginator, MatTableModule, MatPaginatorModule, NgIf],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})
export class UnitManageComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'active',
    'created_at',
    'updated_at',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private unitsService: UnitsService) {}
  ngAfterViewInit() {
    this.unitsService.getUnits().subscribe((data: any) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator; // Set paginator here after data loads
    });
  }

  onDelete(id: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this item?'
    );
    if (confirmed) {
      this.unitsService.deleteUnit(id).subscribe({
        next: () => {
          console.log('Unit deleted successfully');
        },
        error: (error) => {
          console.error('Failed deleting unit', error);
        },
        complete: () => {
          this.ngAfterViewInit();
        },
      });
    }
  }
}
