import {ChangeDetectionStrategy, Component, effect, inject, Signal} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { NavigationService } from '../../service/navigation.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {AuthenticationStore} from '../../store/authentication.store';
import {HttpClient, HttpClientModule, provideHttpClient} from '@angular/common/http';



@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  public readonly authenticationStore: AuthenticationStore = inject(AuthenticationStore);

  public readonly loggedUserEmail: Signal<string | undefined> = this.authenticationStore.loggedUserEmail;

  constructor (protected navigationService : NavigationService) {}
}

