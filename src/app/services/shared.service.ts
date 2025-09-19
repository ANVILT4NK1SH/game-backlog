import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private filterClickSubject = new Subject<void>();
  
  filterClick$ = this.filterClickSubject.asObservable();

  triggerFilterClick() {
    this.filterClickSubject.next()
  }
}
