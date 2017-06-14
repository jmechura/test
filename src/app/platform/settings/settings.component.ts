import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fillUser, User } from './settings.model';

@Component({
  selector: 'mss-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  currentBalance = 0.00;
  infoForm: FormGroup;
  passwordForm: FormGroup;
  user: User = fillUser();

  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;

  constructor(fb: FormBuilder) {
    this.infoForm = fb.group({
      firstName: '',
      surname: '',
      id: null,
      email: ['', Validators.email],
      phone: null
    });

    this.passwordForm = fb.group({
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    });
  }
}
