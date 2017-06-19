import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'mss-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email: string;
  password: string;
  loginForm: FormGroup;

  constructor(fb: FormBuilder, private router: Router) {
    this.loginForm = fb.group({
      email: ['', Validators.email],
      password: ''
    });
  }

  login(): void {
    this.router.navigateByUrl('/platform');
  }
}
