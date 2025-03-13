import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {NavbarComponent} from './core/component/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, NavbarComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {}
