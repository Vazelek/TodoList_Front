import {Component, inject, signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NavigationService } from '../../../../core/service/navigation.service';
import {HttpClient, HttpClientModule, HttpHandler} from '@angular/common/http';
import {BACKEND_URI} from '../../../../core/component/constant/url.constant';
import {User} from '../../../../core/type/user.type';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true,
  providers: [HttpClient]
})
export class SignupComponent {
  public loginForm: FormGroup;

  public emailErrorMessage = signal('');

  public passwordErrorMessage = signal('');

  public passwordCheckErrorMessage = signal('');

  private readonly http: HttpClient = inject(HttpClient);

  private readonly router: Router = inject(Router);

  constructor(
    private fb: FormBuilder,
    protected navigationService : NavigationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordCheck: ['', [Validators.required]],
    });
  }

  public onSubmit() {
    const user: User = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }
    this.http.post(`${BACKEND_URI}/auth/register`, user, {withCredentials: true, responseType: 'json'}).subscribe({
      next: (response: any) => {
        console.log('Register next:', response);
        this.router.navigate(['/signin']).then();
      },
      error: (error: any) => {
        console.error('Register failed:', error);
      }
    }
    );
  }

  public checkPasswordCheck() {
    let password = this.loginForm.get("password")
    let passwordCheck = this.loginForm.get("passwordCheck")

    if (password?.value != passwordCheck?.value) {
      passwordCheck?.setErrors({ different: true })
    }
    else {
      delete passwordCheck?.errors?.["different"]
    }
  }

  public updateEmailErrorMessage() {
    if (this.loginForm.get("email")?.hasError('required')) {
      this.emailErrorMessage.set('You must enter a value');
    } else if (this.loginForm.get("email")?.hasError('email')) {
      this.emailErrorMessage.set('Not a valid email');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  public updatePasswordErrorMessage() {
    if (this.loginForm.get("password")?.hasError('required')) {
      this.passwordErrorMessage.set('You must enter a value');
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  public updatePasswordCheckErrorMessage() {
    if (this.loginForm.get("passwordCheck")?.hasError('required')) {
      this.passwordCheckErrorMessage.set('You must enter a value');
    } else if (this.loginForm.get("passwordCheck")?.hasError('different')) {
      this.passwordCheckErrorMessage.set('Passwords must be equals');
    } else {
      this.passwordCheckErrorMessage.set('');
    }
  }
}
