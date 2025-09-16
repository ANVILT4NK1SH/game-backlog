import { Injectable } from '@angular/core';
import { SavedGame } from '../models/game.model';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private createdGame: SavedGame | null = null 
  private apiUrl = `${environment.apiUrl}/games`;

  constructor(private http: HttpClient, private router: Router) {}

  saveGame(game: SavedGame) {
    return this.http.post(this.apiUrl, game);
  }

  likeGame(game: SavedGame) {
    this.saveGame(game).subscribe({
      next: (data: any) => {
        this.createdGame = data;
        console.log(this.createdGame);
        return this.http.post(
          `${this.apiUrl}/${this.createdGame?.id}/like`,
          {}
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
    
  }

  unlikeGame(game_id: number) {
    return this.http.delete(`${this.apiUrl}/${game_id}/unlike`)
  }
}
