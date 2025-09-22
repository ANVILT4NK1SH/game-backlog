import { Component, Input } from '@angular/core';
import { Game, SavedGame } from '../../models/game.model';
import { UserService } from '../../services/user.service';
import { GameService } from '../../services/game.service';
import { User } from '../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RawgService } from '../../services/rawg.service';

@Component({
  selector: 'app-game-card',
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
})
export class GameCardComponent {
  @Input() game: any;
  currentUser: User | null = null;
  detailsModal: boolean = false;
  gameDetail: Game | null = null;

  constructor(
    private userService: UserService,
    private gameService: GameService,
    private rawgService: RawgService,
  ) {}

  ngOnInit() {
    this.userService.currentUserSubject.subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);
      console.log(this.currentUser?.liked_ids);
    });
  }

  likeGame(game: Game | SavedGame) {
    let saveGame: SavedGame 
    if(this.isGame(game)){
      saveGame = {
        title: game.name,
        release_date: game.released,
        img_url: game.background_image,
        rawg_id: game.id,
      };
    } else saveGame = game;
    
    this.gameService.likeGame(saveGame).subscribe({
      next: (response) => {
        console.log('Game liked successfully:', response);
        if (this.isGame(game)) {
          this.currentUser!.liked_ids.push(game.id);
        } else {
          this.currentUser!.liked_ids.push(game.rawg_id);
        }
      },
      error: (error) => {
        console.error('Error liking game:', error);
      },
    });
  }

  unlikeGame(game_id: number) {
    console.log(game_id);

    this.gameService.unlikeGame(game_id).subscribe({
      next: (response) => {
        console.log('Game unliked successfully:', response);
        this.currentUser!.liked_ids = this.currentUser!.liked_ids.filter(
          (id) => id !== game_id
        );
      },
      error: (error) => {
        console.error('Error unliking game:', error);
      },
    });
  }

  ownGame(game: Game | SavedGame) {
    let saveGame: SavedGame
    if(this.isGame(game)){
      saveGame = {
        title: game.name,
        release_date: game.released,
        img_url: game.background_image,
        rawg_id: game.id,
      };
    }else saveGame = game;

    this.gameService.ownGame(saveGame).subscribe({
      next: (response) => {
        console.log('Game marked as owned', response);
        if (this.isGame(game)) {
          this.currentUser!.owned_ids.push(game.id);
        } else {
          this.currentUser!.owned_ids.push(game.rawg_id);
        }
      },
      error: (error) => {
        console.error('Error marking game as owned:', error);
      },
    });
  }

  unownGame(game_id: number) {
    this.gameService.unownGame(game_id).subscribe({
      next: (response) => {
        console.log('Game unowned successfully:', response);
        this.currentUser!.owned_ids = this.currentUser!.owned_ids.filter(
          (id) => id !== game_id
        );
      },
      error: (error) => {
        console.error('Error unowning game:', error);
      },
    });
  }

  backlogGame(game: Game | SavedGame) {
    let saveGame: SavedGame 
    if(this.isGame(game)) {
      saveGame = {
        title: game.name,
        release_date: game.released,
        img_url: game.background_image,
        rawg_id: game.id,
      };
    } else saveGame = game

    this.gameService.backlogGame(saveGame).subscribe({
      next: (response) => {
        console.log('Game added to backlog', response);
        if (this.isGame(game)) {
          this.currentUser!.backlog_ids.push(game.id);
        } else {
          this.currentUser!.backlog_ids.push(game.rawg_id);
        }
        
      },
      error: (error) => {
        console.error('Error adding to backlog:', error);
      },
    });
  }

  unbacklogGame(game_id: number) {
    this.gameService.unbacklogGame(game_id).subscribe({
      next: (response) => {
        console.log('Game removed from backlog successfully:', response);
        this.currentUser!.backlog_ids = this.currentUser!.backlog_ids.filter(
          (id) => id !== game_id
        );
      },
      error: (error) => {
        console.error('Error removing game from backlog:', error);
      },
    });
  }

  openGameDetails(game: Game | SavedGame){
    if(this.isGame(game)) {
      this.gameDetail = game;
      this.detailsModal = true;
    }else {
      this.rawgService.getGameById(game.rawg_id).subscribe({
        next: (response) => {
          this.gameDetail = response
          this.detailsModal = true;
        },
        error: (error) => {
          console.error('Error getting game details:', error);
        },
      });
    }
  }

  closeGameDetails(){
    this.detailsModal = false;
  }

  isGame(obj: any): obj is Game {
    return (
      typeof obj == 'object' &&
      obj !== null &&
      typeof obj.name === 'string'
    )
  }
}
