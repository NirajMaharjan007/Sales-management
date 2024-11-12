import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'product-edit',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ProductEditComponent implements OnInit {
  id: string | null = null;
  cards: { title: string }[] = [{ title: 'Card 1' }];

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id'); // 'id' is the name of the parameter
    });
  }

  /* addCard(): void {
    this.cards.push({
      title: `Card ${this.cards.length + 1}`,
    });
  }

  removeCard(index: number): void {
    this.cards.splice(index, 1);
  }

  hasMoreCard(): boolean {
    return this.cards.length > 1;
  } */
}
