import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`
  private readonly tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signup(user: any){
    return this.http.post(`${this.apiUrl}/users`, user).pipe(
      catchError(this.handleError)
    );
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

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An Unknown error occured!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, body was: ${JSON.stringify(error.error)}`; 
    }
    console.error(errorMessage);
    return throwError(() => error)
  }
}
