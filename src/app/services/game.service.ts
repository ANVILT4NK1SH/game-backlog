import { Injectable } from '@angular/core';
import { SavedGame } from '../models/game.model';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService { 
  private apiUrl = `${environment.apiUrl}/games`;

  constructor(private http: HttpClient, private router: Router) {}

  saveGame(game: SavedGame): Observable<any> {
    return this.http.post(this.apiUrl, game);
  }

  likeGame(game: SavedGame): Observable<any> {
    return this.http.post(`${this.apiUrl}/like`, game);    
  }

  unlikeGame(rawg_id: number): Observable<any> {
    console.log(rawg_id);
    
    return this.http.post(`${this.apiUrl}/unlike`, {rawg_id});
  }

  ownGame(game: SavedGame): Observable<any> {
    return this.http.post(`${this.apiUrl}/own`, game);
  }

  unownGame(rawg_id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/unown`, {rawg_id});
  }

  backlogGame(game: SavedGame): Observable<any> {
    return this.http.post(`${this.apiUrl}/backlog`, game);
  }

  unbacklogGame(rawg_id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/unbacklog`, {rawg_id});
  }

  getLikes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/userlikes`);
  }

  getOwned(): Observable<any> {
    return this.http.get(`${this.apiUrl}/userowned`);
  }

  getBacklog(): Observable<any> {
    return this.http.get(`${this.apiUrl}/userbacklog`);
  }
}
