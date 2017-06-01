import { Component, Input } from '@angular/core';

@Component({
  selector: 'mss-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {

  /**
   * number from range <0, 1>
   */
  @Input() set progress(newProg: number) {
    this.progressValue = Math.floor((newProg < 0 ? 0 : newProg > 1 ? 1 : newProg) * 10000) / 100;
  };

  get progress(): number {
    return this.progressValue != undefined ? this.progressValue : 0;
  }

  private progressValue: number;

  getProgress(): string {
    return `${this.progress}%`;
  }

}
