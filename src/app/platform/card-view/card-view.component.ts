import { Component } from '@angular/core';

@Component({
  selector: 'mss-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss']
})
export class CardViewComponent {

  cardActive = true;
  cardStatusChangeVisible = false;

  pin: { actual: string, changed: string, control: string } = {actual: '', changed: '', control: ''};

  toggleStatusChange(): void {
    this.cardStatusChangeVisible = !this.cardStatusChangeVisible;
  }

  toggleCardStatus(): void {
    this.cardActive = !this.cardActive;
    this.toggleStatusChange();
  }
}
