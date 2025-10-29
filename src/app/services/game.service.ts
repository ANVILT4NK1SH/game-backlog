import { Injectable } from '@angular/core';
import { SavedGame } from '../models/game.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiUrl = `${environment.apiUrl}/games`;

  private likedGamesSubject = new BehaviorSubject<SavedGame[]>([]);
  private ownedGamesSubject = new BehaviorSubject<SavedGame[]>([]);
  private backloggedGamesSubject = new BehaviorSubject<SavedGame[]>([]);

  public likedGames$ = this.likedGamesSubject.asObservable();
  public ownedGames$ = this.ownedGamesSubject.asObservable();
  public backloggedGames$ = this.backloggedGamesSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  fetchLikes(): void {
    this.http.get<SavedGame[]>(`${this.apiUrl}/userlikes`).subscribe({
      next: (response) => {
        this.likedGamesSubject.next(response);
      },
      error: (error) => {
        console.error('error fetching liked games:', error);
      }
    });
  }

  fetchOwned(): void {
    this.http.get<SavedGame[]>(`${this.apiUrl}/userowned`).subscribe({
      next: (response) => {
        this.ownedGamesSubject.next(response);
      },
      error: (error) => {
        console.error('error fetching owned games:', error);
      }
    });
  }

  fetchBacklogged(): void {
    this.http.get<SavedGame[]>(`${this.apiUrl}/userbacklog`).subscribe({
      next: (response) => {
        this.backloggedGamesSubject.next(response);
      },
      error: (error) => {
        console.error('error fetching backlogged games:', error);
      }
    });
  }

  likeGame(game: SavedGame): Observable<any> {
    return this.http.post(`${this.apiUrl}/like`, game).pipe(
      tap(() => this.fetchLikes())
    );
  }

  unlikeGame(rawg_id: number): Observable<any> {
    console.log(rawg_id);

    return this.http.post(`${this.apiUrl}/unlike`, {rawg_id}).pipe(
      tap(() => this.fetchLikes())
    );
  }

  ownGame(game: SavedGame): Observable<any> {
    return this.http.post(`${this.apiUrl}/own`, game).pipe(
      tap(() => this.fetchOwned())
    );
  }

  unownGame(rawg_id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/unown`, {rawg_id}).pipe(
      tap(() => this.fetchOwned())
    );
  }

  backlogGame(game: SavedGame): Observable<any> {
    return this.http.post(`${this.apiUrl}/backlog`, game).pipe(
      tap(() => this.fetchBacklogged())
    );
  }

  unbacklogGame(rawg_id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/unbacklog`, {rawg_id}).pipe(
      tap(() => this.fetchBacklogged())
    );
  }
}
