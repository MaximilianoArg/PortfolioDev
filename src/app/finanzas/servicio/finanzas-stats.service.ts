import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { TransaccionServicio, Transaccion } from '../transaccion';
import { AccountService } from './account.service';
import { Account } from './account.interfaces';
import {
    EstadisticasCuenta,
    ResumenFinanciero,
    TransaccionPorCategoria,
    EstadisticasPeriodo
} from './finanzas.interfaces';

@Injectable({
    providedIn: 'root'
})
export class FinanzasStatsService {

    constructor(
        private transaccionServicio: TransaccionServicio,
        private accountService: AccountService
    ) { }

    /**
     * Calcula estadísticas para una cuenta específica
     */
    obtenerEstadisticasCuenta(accountId: number): Observable<EstadisticasCuenta> {
        return forkJoin({
            account: this.accountService.getAccount(accountId),
            transacciones: this.transaccionServicio.obtenerTransaccionesPorCuenta(accountId)
        }).pipe(
            map(({ account, transacciones }) => {
                const ingresos = transacciones
                    .filter(t => t.tipo_transaccion === 'INGRESO')
                    .reduce((sum, t) => sum + parseFloat(t.monto), 0);

                const gastos = transacciones
                    .filter(t => t.tipo_transaccion === 'GASTO')
                    .reduce((sum, t) => sum + parseFloat(t.monto), 0);

                const ultimaTransaccion = transacciones.length > 0
                    ? new Date(transacciones[transacciones.length - 1].fecha)
                    : undefined;

                return {
                    accountId: account.id!,
                    accountName: account.name,
                    totalIngresos: ingresos,
                    totalGastos: gastos,
                    balance: account.balance,
                    transaccionesCount: transacciones.length,
                    ultimaTransaccion,
                    bank_image: account.bank_image
                };
            })
        );
    }

    /**
     * Obtiene resumen financiero de todas las cuentas
     */
    obtenerResumenGeneral(periodo?: string): Observable<ResumenFinanciero> {
        return forkJoin({
            accounts: this.accountService.getAccounts(),
            transacciones: this.transaccionServicio.obtenerTransacciones()
        }).pipe(
            map(({ accounts, transacciones }) => {
                const cuentasStats: EstadisticasCuenta[] = accounts.map(account => {
                    const transaccionesCuenta = transacciones.filter(t => t.account === account.id);

                    const ingresos = transaccionesCuenta
                        .filter(t => t.tipo_transaccion === 'INGRESO')
                        .reduce((sum, t) => sum + parseFloat(t.monto), 0);

                    const gastos = transaccionesCuenta
                        .filter(t => t.tipo_transaccion === 'GASTO')
                        .reduce((sum, t) => sum + parseFloat(t.monto), 0);

                    const ultimaTransaccion = transaccionesCuenta.length > 0
                        ? new Date(transaccionesCuenta[transaccionesCuenta.length - 1].fecha)
                        : undefined;

                    return {
                        accountId: account.id!,
                        accountName: account.name,
                        totalIngresos: ingresos,
                        totalGastos: gastos,
                        balance: account.balance,
                        transaccionesCount: transaccionesCuenta.length,
                        ultimaTransaccion,
                        bank_image: account.bank_image
                    };
                });

                const totalGeneral = accounts.reduce((sum, acc) => sum + acc.balance, 0);
                const gastosGeneral = cuentasStats.reduce((sum, stat) => sum + stat.totalGastos, 0);
                const ingresosGeneral = cuentasStats.reduce((sum, stat) => sum + stat.totalIngresos, 0);

                return {
                    periodo: periodo || this.obtenerPeriodoActual(),
                    cuentas: cuentasStats,
                    totalGeneral,
                    gastosGeneral,
                    ingresosGeneral
                };
            })
        );
    }

    /**
     * Agrupa transacciones por categoría
     */
    obtenerTransaccionesPorCategoria(
        transacciones: Transaccion[],
        tipoTransaccion?: 'INGRESO' | 'GASTO'
    ): TransaccionPorCategoria[] {
        let filtradas = transacciones;
        if (tipoTransaccion) {
            filtradas = transacciones.filter(t => t.tipo_transaccion === tipoTransaccion);
        }

        const totalMonto = filtradas.reduce((sum, t) => sum + parseFloat(t.monto), 0);

        const categoriaMap = new Map<number, TransaccionPorCategoria>();

        filtradas.forEach(t => {
            const categoriaId = t.categoria;
            const monto = parseFloat(t.monto);

            if (categoriaMap.has(categoriaId)) {
                const existing = categoriaMap.get(categoriaId)!;
                existing.total += monto;
                existing.transacciones += 1;
            } else {
                categoriaMap.set(categoriaId, {
                    categoriaId,
                    categoriaNombre: t.category_name || `Categoría ${categoriaId}`,
                    total: monto,
                    porcentaje: 0,
                    transacciones: 1
                });
            }
        });

        const resultado = Array.from(categoriaMap.values());

        // Calcular porcentajes
        resultado.forEach(cat => {
            cat.porcentaje = totalMonto > 0 ? (cat.total / totalMonto) * 100 : 0;
        });

        // Ordenar por total descendente
        return resultado.sort((a, b) => b.total - a.total);
    }

    /**
     * Calcula estadísticas para un período específico
     */
    obtenerEstadisticasPeriodo(
        fechaInicio: string,
        fechaFin: string,
        accountId?: number
    ): Observable<EstadisticasPeriodo> {
        return this.transaccionServicio.obtenerTransaccionesPorRango(fechaInicio, fechaFin, accountId).pipe(
            map(transacciones => {
                const ingresos = transacciones
                    .filter(t => t.tipo_transaccion === 'INGRESO')
                    .reduce((sum, t) => sum + parseFloat(t.monto), 0);

                const gastos = transacciones
                    .filter(t => t.tipo_transaccion === 'GASTO')
                    .reduce((sum, t) => sum + parseFloat(t.monto), 0);

                const categorias = this.obtenerTransaccionesPorCategoria(transacciones);

                return {
                    periodo: `${fechaInicio} - ${fechaFin}`,
                    ingresos,
                    gastos,
                    balance: ingresos - gastos,
                    transacciones: transacciones.length,
                    categorias
                };
            })
        );
    }

    /**
     * Calcula el cambio de balance mensual para una cuenta
     */
    calcularCambioMensual(accountId: number): Observable<number> {
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const fechaInicio = inicioMes.toISOString().split('T')[0];
        const fechaFin = hoy.toISOString().split('T')[0];

        return this.transaccionServicio.obtenerTransaccionesPorRango(fechaInicio, fechaFin, accountId).pipe(
            map(transacciones => {
                const ingresos = transacciones
                    .filter(t => t.tipo_transaccion === 'INGRESO')
                    .reduce((sum, t) => sum + parseFloat(t.monto), 0);

                const gastos = transacciones
                    .filter(t => t.tipo_transaccion === 'GASTO')
                    .reduce((sum, t) => sum + parseFloat(t.monto), 0);

                return ingresos - gastos;
            })
        );
    }

    /**
     * Obtiene el período actual en formato legible
     */
    private obtenerPeriodoActual(): string {
        const fecha = new Date();
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
    }
}
