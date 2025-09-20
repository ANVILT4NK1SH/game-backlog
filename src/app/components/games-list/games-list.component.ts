import { Component } from '@angular/core';
import { RawgService } from '../../services/rawg.service';
import { ApiResponse, Game, SavedGame } from '../../models/game.model';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { GameService } from '../../services/game.service';
import { HttpClient } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-games-list',
  imports: [MatIconModule, MatTooltipModule, SideBarComponent],
  templateUrl: './games-list.component.html',
  styleUrl: './games-list.component.scss',
})
export class GamesListComponent {
  games: Game[] = [];
  totalCount: number = 0;
  nextUrl: string = '';
  previousUrl: string = '';
  currentPage: number = 1;
  filters: string = '';
  currentUser: User | null = null;

  constructor(
    private rawgService: RawgService,
    private userService: UserService,
    private gameService: GameService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadGames('');

    this.sharedService.getFilterUpdates().subscribe((filterString) => {
      this.filters = filterString;
      this.currentPage = 1;
      this.loadGames(filterString);
    });
    this.userService.currentUserSubject.subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);
      console.log(this.currentUser?.liked_ids);
    });
  }

  loadGames(filterString: string): void {
    this.sharedService.loadFilteredGames(`${filterString}&page=${this.currentPage}`).subscribe({
      next: (response: ApiResponse) => {
        this.games = response.results;
        this.totalCount = response.count;
        this.nextUrl = response.next;
        this.previousUrl = response.previous;
        console.log('Games loaded:', response);
      },
      error: (error) => {
        console.error('Error fetching games:', error);
      },
    });
  }

  loadNextPage(): void {
    if (this.nextUrl) {
      this.currentPage++;
      this.loadGames(this.filters);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  loadPreviousPage(): void {
    if (this.previousUrl) {
      this.currentPage--;
      this.loadGames(this.filters);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  likeGame(game: Game): void {
    const saveGame: SavedGame = {
      title: game.name,
      release_date: game.released,
      img_url: game.background_image,
      rawg_id: game.id,
    };
    this.gameService.likeGame(saveGame).subscribe({
      next: (response) => {
        console.log('Game liked successfully:', response);
        this.currentUser!.liked_ids.push(game.id);
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

  ownGame(game: Game) {
    const saveGame: SavedGame = {
      title: game.name,
      release_date: game.released,
      img_url: game.background_image,
      rawg_id: game.id,
    };

    this.gameService.ownGame(saveGame).subscribe({
      next: (response) => {
        console.log('Game marked as owned', response);
        this.currentUser!.owned_ids.push(game.id);
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

  backlogGame(game: Game) {
    const saveGame: SavedGame = {
      title: game.name,
      release_date: game.released,
      img_url: game.background_image,
      rawg_id: game.id,
    };

    this.gameService.backlogGame(saveGame).subscribe({
      next: (response) => {
        console.log('Game added to backlog', response);
        this.currentUser!.backlog_ids.push(game.id);
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
}
