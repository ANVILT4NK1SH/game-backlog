import { Component, OnInit } from '@angular/core';
import { SavedGame } from '../../models/game.model';
import { GameService } from '../../services/game.service';
import { GameCardComponent } from '../game-card/game-card.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owned-list',
  imports: [GameCardComponent, CommonModule],
  templateUrl: './owned-list.component.html',
  styleUrl: './owned-list.component.scss'
})
export class OwnedListComponent implements OnInit{
   games$!: Observable<SavedGame[]>;

    constructor (
      private gameService: GameService,
    ){}



    ngOnInit(){
      this.games$ = this.gameService.ownedGames$;
      this.gameService.fetchOwned()
    }


}
