import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from './language.service';

@Injectable()
export class ExtendedToastrService {
  constructor(private toastrService: ToastrService,
              private language: LanguageService) {}
  // response can be of type Response or type string
  // type string will be provided as a key from .json file in LanguageService
  // type Response is from http error
  error(response: any): void {
    if (typeof response === 'string') {
      this.toastrService.error(this.language.translate(response));
    } else {
      const errorBody = response.json();
      this.toastrService.error(errorBody.message);
    }
  }

  success(key: string): void {
    this.toastrService.success(this.language.translate(key));
  }
}
