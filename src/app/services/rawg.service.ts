import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class RawgService {
  private apiUrl = `${environment.apiUrl}/rawg`
  constructor(private http: HttpClient) {}

  filterGames(filterString: string = ""): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/filterGames`, {filterString})
  }
}

