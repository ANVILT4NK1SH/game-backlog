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
  private sub: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
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

  signup() {
    this.authService.signup(this.signupForm.value).subscribe({
      next: (data) => {
        console.log(data);
        this.navigationTimer();
        this.result.set(`User Created! You will be returned to login screen in ${this.timeLeft()}`); 
        
      },
      error: (error) => {
        this.result.set(`Error creating user: ${error.error.error}`);
        console.error(error);
      }
    })
  }

  ngOnDestroy(){
    this.stopTimer();
  }

}
