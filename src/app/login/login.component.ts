import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { ExtendedToastrService } from '../shared/services/extended-toastr.service';

@Component({
  selector: 'mss-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(fb: FormBuilder,
              private router: Router,
              private api: ApiService,
              private toastr: ExtendedToastrService) {
    this.loginForm = fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      system: 'DEFAULT'
    });
  }

  login(): void {
    if (this.loginForm.get('login').hasError('required')) {
      this.toastr.error('toastr.error.enterLogin');
    }
    if (this.loginForm.get('password').hasError('required')) {
      this.toastr.error('toastr.error.enterPassword');
    }
    if (this.loginForm.invalid) {
      return;
    }

    this.api.acquireToken(this.loginForm.value).subscribe(
      () => {
        this.router.navigateByUrl('/platform');
      },
      error => {
        console.error('Login failed', error);
        this.toastr.error(error);
      }
    );
  }
}
