import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-header',
  imports: [RouterModule, MatTooltipModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
  }

  get isLoginPage(): boolean {
    return this.router.url === '/login'
  }
}
