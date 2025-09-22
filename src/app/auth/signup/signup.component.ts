import { Component, signal, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { passwordMatchValidator } from '../validators/password-match.validator';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignUpComponent {
  signupForm: FormGroup;
  result = signal('');
  timeLeft = signal(5);
  isRunning: boolean = false;
  apiErrors: string[] = []
  private sub: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      password_confirmation: new FormControl('', Validators.required),
    }, {validators: passwordMatchValidator()});
  }

  navigationTimer() {
    if(!this.isRunning && this.timeLeft() > 0) {
      this.isRunning = true;
      this.sub = interval(1000).subscribe(() => {
        if (this.timeLeft() > 0){
          this.timeLeft.update((value) => value - 1);
        }else{
          this.stopTimer();
          this.router.navigate(['/login']);
        } 
      });
    }
  }

  stopTimer() {
    if (this.isRunning){
      this.isRunning = false;
      this.timeLeft.set(5);
      if(this.sub){
        this.sub.unsubscribe();
      }
    }
  }

  signup(): void {
    if(this.signupForm.valid){
      this.authService.signup(this.signupForm.value).subscribe({
        next: (data) => {
          console.log(data);
          this.navigationTimer();
          this.result.set(`User Created! You will be returned to login screen in ${this.timeLeft()} seconds.`); 
        },
        error: (err) => {
         if (err.status === 422) {
            // Handle specific validation errors
            if (err.error && err.error.errors) {
              this.apiErrors = err.error.errors;
              // Map the server-side errors to the specific form controls
              err.error.errors.forEach((errorMsg: string) => {
                if (errorMsg.includes('Username')) {
                  this.signupForm.get('username')?.setErrors({ serverError: errorMsg });
                }
                if (errorMsg.includes('Email')) {
                  this.signupForm.get('email')?.setErrors({ serverError: errorMsg });
                }
              });
            }
          } else {
            this.apiErrors.push('An unexpected error occurred.');
          }
        }
      });
    }
    
  }

  ngOnDestroy(){
    this.stopTimer();
  }

}
