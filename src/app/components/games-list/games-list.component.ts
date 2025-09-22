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
import { GameCardComponent } from "../game-card/game-card.component";

@Component({
  selector: 'app-games-list',
  imports: [MatIconModule, MatTooltipModule, SideBarComponent, GameCardComponent],
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

  constructor(
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadGames('');

    this.sharedService.getFilterUpdates().subscribe((filterString) => {
      this.filters = filterString;
      this.currentPage = 1;
      this.loadGames(filterString);
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
}
