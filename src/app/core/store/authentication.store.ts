import {computed, inject, Injectable, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BACKEND_URI} from '../component/constant/url.constant';
import {catchError, of} from 'rxjs';

interface IsLoggedIn {
  isLoggedIn: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationStore {
  public readonly isLoggedIn: Signal<boolean> = computed(() => this.isLoggedIn$());

  private isLoggedIn$: WritableSignal<boolean> = signal(false);

  private readonly http: HttpClient = inject(HttpClient);

  constructor() {
    this.http.get<IsLoggedIn>(`${BACKEND_URI}/auth`, { withCredentials: true }).pipe(
      catchError(() => {
        return of(false);
      })
    ).subscribe((isLoggedIn: boolean | IsLoggedIn) => {
      if (!isLoggedIn) {
        this.isLoggedIn$.set(false);
      }
      else {
        this.isLoggedIn$.set((isLoggedIn as IsLoggedIn).isLoggedIn)
      }
    })
  }

  public login(): void {
    this.isLoggedIn$.set(true);
  }

  public logout(): void {
    this.http.post(`${BACKEND_URI}/auth/logout`, null, { withCredentials: true }).subscribe(() => {
      this.isLoggedIn$.set(false);
    })
  }
}
