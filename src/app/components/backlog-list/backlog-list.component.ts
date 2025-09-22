import { Component } from '@angular/core';
import { SavedGame } from '../../models/game.model';
import { GameService } from '../../services/game.service';
import { GameCardComponent } from '../game-card/game-card.component';

@Component({
  selector: 'app-backlog-list',
  imports: [GameCardComponent],
  templateUrl: './backlog-list.component.html',
  styleUrl: './backlog-list.component.scss'
})
export class BacklogListComponent {
  games: SavedGame[] = [];

  constructor (
    private gameService: GameService,
  ){}

  ngOnInit(){
    this.loadGames()
  }

  loadGames() {
    this.gameService.getBacklog().subscribe({
      next:(response: SavedGame[]) => {
        this.games = response
      },
      error: (error) => {
        console.error('Error fetching games:', error);
      },
    });
  }
}