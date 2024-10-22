import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'invoice-create',
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
export class InvoiceCreateComponent {
  cards = [{ id: 'card 1' }];
  addCard() {
    this.cards.push({ id: 'card' + this.cards.length });
  }
}
