import { Component } from '@angular/core';

@Component({
  selector: 'mss-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})
export class ShowcaseComponent {

  buttonClicksCounter = 0;

  checkboxChecked = false;

  progress = 0.52;

  toggled = false;

  inputValue1 = 'whatever';
  inputValue2: number;
  inputValue3= 'Input without label';
  inputValue4: string;

  buttonClicked(): void {
    this.buttonClicksCounter += 1;
  }

  updateProgress(increment: boolean): void {
    this.progress = increment ? this.progress + 0.01 : this.progress - 0.01;
  }
}
