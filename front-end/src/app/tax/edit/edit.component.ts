import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaxService } from '../../services/tax.service';

@Component({
  selector: 'tax-edit',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class TaxEditComponent implements OnInit {
  id: string | null = null;
  constructor(private route: ActivatedRoute, private taxService: TaxService) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id'); // 'id' is the name of the parameter
    });
  }
}
