import { Component } from '@angular/core';
import { SavedGame } from '../../models/game.model';
import { GameService } from '../../services/game.service';
import { GameCardComponent } from "../game-card/game-card.component";

@Component({
  selector: 'app-likes-list',
  imports: [GameCardComponent],
  templateUrl: './likes-list.component.html',
  styleUrl: './likes-list.component.scss'
})
export class LikesListComponent {
  games: SavedGame[] = [];

  constructor (
    private gameService: GameService,
  ){}

  ngOnInit(){
    this.loadGames()
  }

  loadGames() {
    this.gameService.getLikes().subscribe({
      next:(response: SavedGame[]) => {
        this.games = response
      },
      error: (error) => {
        console.error('Error fetching games:', error);
      },
    });
  }
}
