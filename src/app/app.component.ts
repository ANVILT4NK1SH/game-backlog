import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { SideBarComponent } from "./components/side-bar/side-bar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'game-backlog';
}
