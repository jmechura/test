import { Component } from '@angular/core';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { RadioItem } from '../../shared/components/bronze/radio-button-group/radio-button-group.component';
import * as moment from 'moment';
import { Moment } from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  selectOptions: SelectItem[] = [{value: 'Such'}, {value: 'Select'}, {value: 'Much'}, {value: 'WOW'}];
  selected: string;

  searchInputArray: string[] = ['Bulabasour', 'Charmander', 'Squirtle', 'Megicarp', 'Pidgey', 'Rattata', 'Pikachu', 'vulpix', 'Jigglypuff'];
  selectedPokemon: string;
  modalShowing: boolean[] = [false, false];

  radioOptions: RadioItem[] = [{id: 1}, {id: 'so'}, {id: 3}, {id: 'much'}, {id: 5}, {id: 'WOW'}];
  radioSelected: number | string;

  loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore' +
    ' et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ' +
    'ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla' +
    ' pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  sliderValue1 = 35;
  sliderValue2 = 120;
  slider2min = 30;
  slider2max = 250;

  pickedDate: Moment = moment();
  pickedTime: Moment = moment();

  modalPickedDate: Moment = moment();

  dateTimeDate: Moment = moment();

  completeArray: any[] = [];

  multiselectForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.multiselectForm = this.fb.group({
      multiselect: [['WOW']]
    });
    this.fetch((data) => {
      this.completeArray = data;
    });
  }

  fetch(cb: any): void {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/mock/company.json`);
    req.onload = () => {
      cb(JSON.parse(req.response));
    };
    req.send();
  }

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
