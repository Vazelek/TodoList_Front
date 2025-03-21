import {Component, inject, signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {NavigationService} from '../../../../core/service/navigation.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BACKEND_URI} from '../../../../core/constant/url.constant';
import {User} from '../../../../core/type/user.type';
import {AuthenticationStore} from '../../../../core/store/authentication.store';

@Component({
  selector: 'app-signin',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
  standalone: true,
})
export class SigninComponent {
  loginForm: FormGroup;

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  credentialsErrorMessage = signal('');

  private readonly http: HttpClient = inject(HttpClient);

  private readonly router: Router = inject(Router);

  private readonly authenticationStore: AuthenticationStore = inject(AuthenticationStore);

  constructor(
    private fb: FormBuilder,
    protected navigationService: NavigationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    const user: User = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }
    this.http.post(`${BACKEND_URI}/auth/login`, user, {withCredentials: true, responseType: 'json'}).subscribe({
      next: (response: any) => {
        this.authenticationStore.login(user.email);
        this.router.navigate(['']).then();
      },
      error: (error: any) => {
        if (error.status === 401) {
          console.error('Login failed: Forbidden', error);
          this.credentialsErrorMessage.set('Invalid credentials')
        } else {
          console.error('Login failed:', error);
          this.credentialsErrorMessage.set('Invalid credentials')
        }
      }
    });
  }

  updateEmailErrorMessage() {
    if (this.loginForm.get("email")?.hasError('required')) {
      this.emailErrorMessage.set('You must enter a value');
    } else if (this.loginForm.get("email")?.hasError('email')) {
      this.emailErrorMessage.set('Not a valid email');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    if (this.loginForm.get("password")?.hasError('required')) {
      this.passwordErrorMessage.set('You must enter a value');
    } else {
      this.passwordErrorMessage.set('');
    }
  }
}
