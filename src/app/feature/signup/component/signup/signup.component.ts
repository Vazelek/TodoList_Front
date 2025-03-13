import { Component, signal } from '@angular/core';
import {MatCardModule} from '@angular/material/card'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import { NavigationService } from '../../../../core/service/navigation.service';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true
})
export class SignupComponent {
  loginForm: FormGroup;

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  passwordCheckErrorMessage = signal('');

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

  onSubmit() {

  }

  checkPasswordCheck() {
    let password = this.loginForm.get("password")
    let passwordCheck = this.loginForm.get("passwordCheck")

    if (password?.value != passwordCheck?.value) {
      passwordCheck?.setErrors({ different: true })
    }
    else {
      delete passwordCheck?.errors?.["different"]
    }
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

  updatePasswordCheckErrorMessage() {
    if (this.loginForm.get("passwordCheck")?.hasError('required')) {
      this.passwordCheckErrorMessage.set('You must enter a value');
    } else if (this.loginForm.get("passwordCheck")?.hasError('different')) {
      this.passwordCheckErrorMessage.set('Passwords must be equals');
    } else {
      this.passwordCheckErrorMessage.set('');
    }
  }
}
