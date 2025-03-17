import {computed, inject, Injectable, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BACKEND_URI} from '../component/constant/url.constant';
import {catchError, of} from 'rxjs';

interface IsLoggedIn {
  isLoggedIn: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationStore {
  public readonly loggedUserEmail: Signal<string | undefined> = computed(() => this.loggedUserEmail$());

  private loggedUserEmail$: WritableSignal<string | undefined> = signal(undefined);

  private readonly http: HttpClient = inject(HttpClient);

  constructor() {
    this.http.get<IsLoggedIn>(`${BACKEND_URI}/auth`, { withCredentials: true }).pipe(
      catchError(() => {
        return of({ isLoggedIn: undefined});
      })
    ).subscribe((isLoggedIn: IsLoggedIn) => {
        this.loggedUserEmail$.set(isLoggedIn.isLoggedIn)
    })
  }

  public login(email: string): void {
    this.loggedUserEmail$.set(email);
  }

  public logout(): void {
    this.http.post(`${BACKEND_URI}/auth/logout`, null, { withCredentials: true }).subscribe(() => {
      this.loggedUserEmail$.set(undefined);
    })
  }
}
