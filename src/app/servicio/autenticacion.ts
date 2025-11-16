import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

// Interfaz para tipar la respuesta de la API que contiene los tokens
export interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root',
})
export class Autenticacion {
  
  // URL del endpoint de login en tu API de Django
  private apiUrl = 'http://127.0.0.1:8000/api/login/';
  
  // BehaviorSubject sigue siendo la mejor forma de manejar el estado de login en la app
  private estaLogueado = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Al iniciar el servicio, comprobamos si ya existen tokens en el almacenamiento.
    // Usamos localStorage para que la sesión persista incluso si se cierra el navegador.
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('access_token');
      this.estaLogueado.next(!!token); // !! convierte el valor (string o null) a booleano
    }
  }

  /**
   * Envía las credenciales a la API. Si tiene éxito, guarda los tokens
   * y emite 'true' para el estado de login.
   */
  loguear(usuario: string, contra: string): Observable<boolean> {
    const body = { username: usuario, password: contra };

    // Hacemos la petición POST a la API
    return this.http.post<TokenResponse>(this.apiUrl, body).pipe(
      // Si la petición es exitosa (código 200-299)
      tap(tokens => {
        // Guardamos los tokens en localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('access_token', tokens.access);
          localStorage.setItem('refresh_token', tokens.refresh);
        }
        // Actualizamos el estado de autenticación
        this.estaLogueado.next(true);
        console.log("Autenticacion exitosa, tokens guardados.");
      }),
      // Transformamos la respuesta de TokenResponse a un booleano
      map(() => true),
      // Si la petición falla (ej. 401 Credenciales Inválidas)
      catchError((error: HttpErrorResponse) => {
        console.error("Fallo la autenticación:", error.message);
        // Nos aseguramos de limpiar cualquier token antiguo y actualizar el estado
        this.desloguear();
        // Devolvemos un observable que emite 'false' para que el componente sepa que falló
        return of(false);
      })
    );
  }

  /**
   * Cierra la sesión eliminando los tokens del almacenamiento y actualizando el estado.
   */
  desloguear(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    this.estaLogueado.next(false);
    console.log("Sesión cerrada.");
  }

  /**
   * Expone el estado de autenticación como un Observable para que otros
   * componentes puedan suscribirse a los cambios.
   */
  get estaLogueado$(): Observable<boolean> {
    return this.estaLogueado.asObservable();
  }

  /**
   * (Opcional, pero útil) Método para obtener el token de acceso
   * para usarlo en otras peticiones a la API.
   */
  public getAccessToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('access_token');
    }
    return null;
  }
}
