import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<User | null> {

  currentUser: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User | null> {
    console.log("resolve called");
    
    if (this.authService.isLoggedIn()) {
      return this.userService.getBootstrapData().pipe(
        catchError(() => {
          this.authService.logout();
          return of(null);
        })
      );
    }
    return of(null);
  }
}
