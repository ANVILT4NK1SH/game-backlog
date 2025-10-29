import { Component, OnInit } from '@angular/core';
import { SavedGame } from '../../models/game.model';
import { GameService } from '../../services/game.service';
import { GameCardComponent } from '../game-card/game-card.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-backlog-list',
  imports: [GameCardComponent, CommonModule],
  templateUrl: './backlog-list.component.html',
  styleUrl: './backlog-list.component.scss'
})
export class BacklogListComponent implements OnInit{
  games$!: Observable<SavedGame[]>;

      constructor (
        private gameService: GameService,
      ){}



      ngOnInit(){
        this.games$ = this.gameService.backloggedGames$;
        this.gameService.fetchBacklogged()
      }
}
