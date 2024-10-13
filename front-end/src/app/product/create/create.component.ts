import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class ProductCreateComponent {
  cards: { title: string }[] = [{ title: 'Card 1' }];
  addCard(): void {
    const newCardIndex = this.cards.length + 1;
    this.cards.push({
      title: `Card ${newCardIndex}`,
    });
  }
}
