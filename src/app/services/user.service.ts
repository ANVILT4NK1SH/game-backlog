import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  setCurrentUser(user: User | null){
    this.currentUserSubject.next(user);
  }

  getBootstrapData() {
    return this.http.get(`${environment.apiUrl}/web/bootstrap`).pipe(
      tap((data: any) => {
        this.setCurrentUser(data)
        console.log(this.currentUserSubject);
        console.log(data);  
      })
    )
  }
}
