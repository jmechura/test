import { FormControl, Validators } from '@angular/forms';

export function optionalEmailValidator(control: FormControl): { [error: string]: boolean } {
  return control.value ? Validators.email(control) : null;
}
