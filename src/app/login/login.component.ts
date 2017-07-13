import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'mss-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(fb: FormBuilder, private router: Router, private api: ApiService) {
    this.loginForm = fb.group({
      login: '',
      password: '',
      system: 'DEFAULT'
    });
  }

  login(): void {
    this.api.acquireToken(this.loginForm.value).subscribe(
      () => {
        this.router.navigateByUrl('/platform');
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }
}
