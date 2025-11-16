import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { TokenResponse, UserProfile } from './auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class Autenticacion {
  
  private apiUrl = 'http://127.0.0.1:8000/api/';
  private estaLogueado = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<UserProfile | null>(null);

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('access_token');
      if (token) {
        this.estaLogueado.next(true);
        this.fetchUserProfile().subscribe();
      }
    }
  }

  loguear(usuario: string, contra: string): Observable<boolean> {
    const body = { username: usuario, password: contra };
    return this.http.post<TokenResponse>(`${this.apiUrl}login/`, body).pipe(
      tap(tokens => {
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        this.estaLogueado.next(true);
        console.log("Tokens guardados, estado de login actualizado.");
      }),
      switchMap(() => this.fetchUserProfile()),
      map(() => true),
      catchError((error) => {
        console.error("Fallo en el flujo de login:", error);
        this.desloguear();
        return of(false);
      })
    );
  }

  desloguear(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.estaLogueado.next(false);
    this.currentUser.next(null);
  }

  get estaLogueado$(): Observable<boolean> {
    return this.estaLogueado.asObservable();
  }

  get currentUser$(): Observable<UserProfile | null> {
    return this.currentUser.asObservable();
  }

  fetchUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}profile/`).pipe(
      tap(user => {
        this.currentUser.next(user);
      })
    );
  }

  public getAccessToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('access_token');
    }
    return null;
  }
}