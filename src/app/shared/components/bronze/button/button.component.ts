import { Component, Input } from '@angular/core';

@Component({
  selector: 'mss-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() label: string;
  @Input() icon: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
}
