import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedService } from '../../services/shared.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-side-bar',
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  extended: boolean = false;
  filterForm: FormGroup;

  constructor(private sharedService: SharedService) {
    this.filterForm = new FormGroup({
      search: new FormControl(''),
      platformDropdown: new FormControl('PC'),
      releaseDateBegin: new FormControl(''),
      releaseDateEnd: new FormControl(''),
    })
  }

  onFilterBtnClick() {
    this.sharedService.triggerFilterClick();
  }
  
  toggleSidebar(){
    this.extended = !this.extended;
  }


}
