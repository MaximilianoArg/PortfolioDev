import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaccion {
  id: number;
  usuario: number;
  account?: number;
  account_name?: string;
  descripcion: string;
  monto: string;
  fecha: string;
  categoria: number;  // Category ID (ForeignKey)
  category_name?: string;  // Category name for display
  tipo_transaccion: 'INGRESO' | 'GASTO';
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

  crearTransaccion(transaccion: any): Observable<Transaccion> {
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

  // Filtrar transacciones por cuenta
  obtenerTransaccionesPorCuenta(accountId: number): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.apiUrl}?account=${accountId}`);
  }

  // Filtrar transacciones por rango de fechas
  obtenerTransaccionesPorRango(
    fechaInicio: string,
    fechaFin: string,
    accountId?: number
  ): Observable<Transaccion[]> {
    let params = `?fecha_after=${fechaInicio}&fecha_before=${fechaFin}`;
    if (accountId) {
      params += `&account=${accountId}`;
    }
    return this.http.get<Transaccion[]>(`${this.apiUrl}${params}`);
  }

  // Filtrar transacciones con múltiples criterios
  filtrarTransacciones(filtros: {
    accountId?: number;
    categoriaId?: number;
    tipoTransaccion?: 'INGRESO' | 'GASTO';
    fechaInicio?: string;
    fechaFin?: string;
  }): Observable<Transaccion[]> {
    let params = '?';
    const paramsList: string[] = [];

    if (filtros.accountId) paramsList.push(`account=${filtros.accountId}`);
    if (filtros.categoriaId) paramsList.push(`categoria=${filtros.categoriaId}`);
    if (filtros.tipoTransaccion) paramsList.push(`tipo_transaccion=${filtros.tipoTransaccion}`);
    if (filtros.fechaInicio) paramsList.push(`fecha_after=${filtros.fechaInicio}`);
    if (filtros.fechaFin) paramsList.push(`fecha_before=${filtros.fechaFin}`);

    params += paramsList.join('&');
    return this.http.get<Transaccion[]>(`${this.apiUrl}${params}`);
  }
}
