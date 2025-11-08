import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject} from 'rxjs';
import { tap, delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Autenticacion {
  private estaLogueado = new BehaviorSubject<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined' && window.sessionStorage)
    {
      const guardarEstadoLogin = sessionStorage.getItem('estaLogueado') === 'true';
      this.estaLogueado.next(guardarEstadoLogin);
    }
  }

  loguear(usuario: string, contra: string): Observable<boolean>
  {
    const estaLogueado = usuario === 'admin' && contra === 'admin';
    if (typeof window !== 'undefined' && window.sessionStorage)
    {
      sessionStorage.setItem('estaLogueado', estaLogueado ? 'true' : 'false');
    }
    this.estaLogueado.next(estaLogueado);
    return of(estaLogueado).pipe(
      delay(1000),
      tap(val => console.log("Autenticacion exitosa" + val))
    );
  }

  desloguear(): void 
  {
    if(typeof window !== 'undefined' && window.sessionStorage)
    {
      sessionStorage.removeItem('estaLogueado');
    }
    this.estaLogueado.next(false);
  }

  get estaLogueado$(): Observable<boolean>
  {
    return this.estaLogueado.asObservable();
  }
}
