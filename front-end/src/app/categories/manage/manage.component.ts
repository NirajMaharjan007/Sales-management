import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'categories-manage',
  standalone: true,
  imports: [RouterLink, MatPaginator, MatTableModule, MatPaginatorModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})
export class CategoryManageComponent implements AfterViewInit {
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

  constructor(private categoriesService: CategoriesService) {}
  ngAfterViewInit() {
    this.categoriesService.getCategories().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator; // Set paginator here after data loads
    });
  }

  onDelete(id: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this item?'
    );
    if (confirmed) {
      this.categoriesService.deleteCategory(id).subscribe({
        next: () => {
          console.log('Category deleted successfully');
        },
        error: (error) => {
          console.error('Category deleting tax', error);
        },
        complete: () => {
          this.ngAfterViewInit();
        },
      });
    }
  }
}
