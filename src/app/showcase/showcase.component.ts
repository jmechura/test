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
  inputValue3 = 'Input without label';
  inputValue4: string;

  modalShowing: boolean[] = [false, false];

  loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore' +
    ' et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ' +
    'ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla' +
    ' pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  buttonClicked(): void {
    this.buttonClicksCounter += 1;
  }

  updateProgress(increment: boolean): void {
    this.progress = increment ? this.progress + 0.01 : this.progress - 0.01;
  }

  toggleModalShowing(index: number): void {
    this.modalShowing[index] = !this.modalShowing[index];
  }
}
