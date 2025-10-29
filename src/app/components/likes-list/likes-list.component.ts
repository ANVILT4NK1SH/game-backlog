import { Component, OnInit } from '@angular/core';
import { SavedGame } from '../../models/game.model';
import { GameService } from '../../services/game.service';
import { GameCardComponent } from "../game-card/game-card.component";
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-likes-list',
  imports: [GameCardComponent, CommonModule],
  templateUrl: './likes-list.component.html',
  styleUrl: './likes-list.component.scss'
})
export class LikesListComponent implements OnInit{
  games$!: Observable<SavedGame[]>;

  constructor (
    private gameService: GameService,
  ){}



  ngOnInit(){
    this.games$ = this.gameService.likedGames$;
    this.gameService.fetchLikes();
  }

}
