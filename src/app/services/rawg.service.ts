import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Game, Genre, PlatformDetails } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class RawgService {
  private apiUrl = `${environment.apiUrl}/rawg`
  constructor(private http: HttpClient) {}


  filterGames(filterString: string = ""): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/filterGames`, {filterString}).pipe(
      catchError(this.handleError)
    );
  }

  getGameById(rawg_id: number){
    return this.http.post<Game>(`${this.apiUrl}/getGameById`, {rawg_id}).pipe(
      catchError(this.handleError)
    )
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.apiUrl}/genres`).pipe(
      catchError(this.handleError)
    );
  }

  getPlatforms(): Observable<PlatformDetails[]> {
    return this.http.get<PlatformDetails[]>(`${this.apiUrl}/platforms`).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.error || error.message || 'An error occured';
    return throwError(() => new Error(errorMessage));
  }
}

