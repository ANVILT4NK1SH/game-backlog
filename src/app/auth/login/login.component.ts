import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        console.log('Logged in with token:', res.token);
        this.authService.setToken(res.token);
        this.router.navigate(['/games-list']);
      },
      error: (error: any) => {
        console.error('Login error', error);
      },
    });
  }
}
