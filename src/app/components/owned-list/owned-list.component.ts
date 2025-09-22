import { Component } from '@angular/core';
import { SavedGame } from '../../models/game.model';
import { GameService } from '../../services/game.service';
import { GameCardComponent } from '../game-card/game-card.component';

@Component({
  selector: 'app-owned-list',
  imports: [GameCardComponent],
  templateUrl: './owned-list.component.html',
  styleUrl: './owned-list.component.scss'
})
export class OwnedListComponent {
  games: SavedGame[] = [];

  constructor (
    private gameService: GameService,
  ){}

  ngOnInit(){
    this.loadGames()
  }

  loadGames() {
    this.gameService.getOwned().subscribe({
      next:(response: SavedGame[]) => {
        this.games = response
      },
      error: (error) => {
        console.error('Error fetching games:', error);
      },
    });
  }
}