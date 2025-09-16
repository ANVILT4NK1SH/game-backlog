import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`
  private readonly tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signup(user: any){
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  login(username: string, password: string){
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/login`,
      {
        username,
        password,
      }
    );
  }

  setToken(token: string){
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn(){
    return !!this.getToken();
  }

  logout(){
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login'])
  }
}
