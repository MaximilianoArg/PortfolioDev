import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaccion 
{
  id: number;
  usuario: number;
  descripcion: string;
  monto: string;
  fecha: string;
  categoria: string;
  transaccion_tipo: 'income' | 'expense';
}

@Injectable({
  providedIn: 'root',
})

export class TransaccionServicio {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/transacciones/';

  obtenerTransacciones(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(this.apiUrl);
  }

  crearTransaccion(transaccion: Transaccion): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.apiUrl, transaccion);
  }

  actualizarTransaccion(transaccion: Transaccion): Observable<Transaccion> {
    const url = `${this.apiUrl}${transaccion.id}/`;
    return this.http.put<Transaccion>(url, transaccion);
  } 

  borrarTransaccion(id: number): Observable<void> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete<void>(url);
  } 
}
