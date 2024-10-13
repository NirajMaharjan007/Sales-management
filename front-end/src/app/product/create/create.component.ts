import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
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
export class ProductCreateComponent {
  cards: { title: string }[] = [{ title: 'Card 1' }];
  addCard(): void {
    this.cards.push({
      title: `Card ${this.cards.length + 1}`,
    });
  }

  removeCard(index: number): void {
    this.cards.splice(index, 1);
  }

  hasMoreCard(): boolean {
    return this.cards.length > 1;
  }
}
