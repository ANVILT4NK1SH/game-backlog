import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RawgService } from './rawg.service';
import { ApiResponse } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private filterClickSubject = new Subject<string>();

  constructor(private rawgService: RawgService) {}
  

  triggerFilterClick(filterString: string) {
    this.filterClickSubject.next(filterString);
  }

  getFilterUpdates(): Observable<string> {
    return this.filterClickSubject.asObservable();
  }

  loadFilteredGames(filterString: string): Observable<ApiResponse> {
    return this.rawgService.filterGames(filterString);
  }
}
