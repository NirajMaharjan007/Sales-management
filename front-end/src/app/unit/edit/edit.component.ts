import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'unit-edit',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class UnitEditComponent {
  id: string | null = null;
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id'); // 'id' is the name of the parameter
    });
  }
}
