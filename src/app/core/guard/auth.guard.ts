import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {catchError, of} from "rxjs";
import {AuthenticationStore} from '../store/authentication.store';
import {BACKEND_URI} from '../constant/url.constant';
import {HttpClient} from '@angular/common/http';

export const AuthGuard = (): boolean => {
  const router: Router = inject(Router);
  const authenticationStore: AuthenticationStore = inject(AuthenticationStore);
  const http: HttpClient = inject(HttpClient);

  if (!authenticationStore.loggedUserEmail()) {
    http.get(`${BACKEND_URI}/auth`, { withCredentials: true }).pipe(
      catchError(() => {
        router.navigate(['/signin']).then()
        return of(false);
      })
    ).subscribe(() => true)
  }
  return true;
}
