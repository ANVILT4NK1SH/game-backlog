import { Component } from '@angular/core';
import { RawgService } from '../../services/rawg.service';
import { ApiResponse, Game, SavedGame } from '../../models/game.model';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-games-list',
  imports: [MatIconModule],
  templateUrl: './games-list.component.html',
  styleUrl: './games-list.component.scss'
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
  ) {}

  ngOnInit(): void {
    this.loadGames(this.rawgService.filterGames());
    this.userService.currentUserSubject.subscribe(
      (user) => {
        this.currentUser = user;
        console.log(this.currentUser);
        console.log(this.currentUser?.liked_ids);  
      }
    );
  }

  loadGames(observable: Observable<ApiResponse>): void {
    observable.subscribe({
      next: (response: ApiResponse) => {
        this.games = response.results;
        this.totalCount = response.count;
        this.nextUrl = response.next;
        this.previousUrl = response.previous;
        console.log(response);
        
      },
      error: (error) => {
        console.error('Error fetching games:', error);
      }
    });
  }

  loadNextPage(): void {
    if(this.nextUrl)
   this.currentPage++
   this.loadGames(
     this.rawgService.filterGames(`${this.filters}&page=${this.currentPage}`)
   );
  }

  loadPreviousPage(): void {
    if(this.previousUrl) {
      this.currentPage--
      this.loadGames(this.rawgService.filterGames(`${this.filters}&page=${this.currentPage}`))
    }
  }

  toggleLiked(game: Game) {
    
  }
}
