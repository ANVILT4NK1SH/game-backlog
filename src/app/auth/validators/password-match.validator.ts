import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const password_confirmation = control.get('password_confirmation')?.value;

    return password &&
      password_confirmation && password !== password_confirmation
      ? { passwordMismatch: true } : null;
  }
}