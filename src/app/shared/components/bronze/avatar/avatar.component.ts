import { Component, Input } from '@angular/core';

@Component({
  selector: 'mss-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {

  /**
   * photo hold source url for image;
   * @type {string}
   */
  @Input() photo: string;
  /**
   * set size of avatar in px
   * @type {number}
   */
  @Input() avatarSize = 32;

  get source(): string {
    return this.photo ? this.photo : 'assets/icons/avatar.png';
  }
}
