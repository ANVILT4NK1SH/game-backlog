import { Routes } from '@angular/router';
import { noAuthGuard } from './no-auth.guard';
import { authGuard } from './auth.guard';
import { UserResolverService } from './services/user-resolver.service';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [noAuthGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup/signup.component').then(
        (c) => c.SignUpComponent
      ),
    canActivate: [noAuthGuard],
  },
  {
    path: 'games-list',
    loadComponent: () =>
      import('./components/games-list/games-list.component').then(
        (m) => m.GamesListComponent
      ),
    canActivate: [authGuard],
    resolve: { userData: UserResolverService },
  },
  {
    path: 'likes',
    loadComponent: () =>
      import('./components/likes-list/likes-list.component').then(
        (m) => m.LikesListComponent
      ),
      canActivate: [authGuard],
      resolve: {userData: UserResolverService},
  },
  {
    path: 'owned',
    loadComponent: () => 
      import('./components/owned-list/owned-list.component').then(
        (m) => m.OwnedListComponent
      ),
      canActivate: [authGuard],
      resolve: {userData: UserResolverService},
  },
  {
    path: 'backlog',
    loadComponent: () =>
      import('./components/backlog-list/backlog-list.component').then(
        (m) => m.BacklogListComponent
      ),
      canActivate: [authGuard],
      resolve: {userData: UserResolverService},
  }
];
