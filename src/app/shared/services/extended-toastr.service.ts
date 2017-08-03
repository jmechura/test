import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ExtendedToastrService {
  // private toast: ActiveToast;
  constructor(private toastrService: ToastrService) {}

  error(message: string | number): void {
    if (typeof message === 'string') {
      this.toastrService.error(message);
    }
    if (typeof message === 'number') {
      this.toastrService.error('TODO');
    }
  }

  success(message: string): void {
    this.toastrService.success(message);
  }
}
