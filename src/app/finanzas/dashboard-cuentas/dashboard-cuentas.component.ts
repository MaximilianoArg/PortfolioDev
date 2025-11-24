import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../servicio/account.service';
import { FinanzasStatsService } from '../servicio/finanzas-stats.service';
import { Account } from '../servicio/account.interfaces';
import { ResumenFinanciero, EstadisticasCuenta } from '../servicio/finanzas.interfaces';

@Component({
    selector: 'app-dashboard-cuentas',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard-cuentas.component.html',
    styleUrls: ['./dashboard-cuentas.component.scss']
})
export class DashboardCuentasComponent implements OnInit {
    resumen: ResumenFinanciero | null = null;
    cargando = true;
    error: string | null = null;

    constructor(
        private accountService: AccountService,
        private statsService: FinanzasStatsService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cargarDashboard();
    }

    cargarDashboard(): void {
        this.cargando = true;
        this.error = null;

        this.statsService.obtenerResumenGeneral().subscribe({
            next: (resumen) => {
                this.resumen = resumen;
                this.cargando = false;
            },
            error: (err) => {
                console.error('Error cargando dashboard', err);
                this.error = 'Error al cargar el dashboard. Por favor, intenta nuevamente.';
                this.cargando = false;
            }
        });
    }

    irACuenta(accountId: number): void {
        this.router.navigate(['/finanzas/cuentas', accountId]);
    }

    irATransacciones(accountId: number): void {
        this.router.navigate(['/finanzas/cuentas', accountId, 'transacciones']);
    }

    obtenerColorBalance(balance: number): string {
        return balance >= 0 ? 'positivo' : 'negativo';
    }

    obtenerIconoBanco(bankName?: string): string {
        // Mapeo de bancos a iconos FontAwesome
        const iconMap: { [key: string]: string } = {
            'galicia': 'fa-landmark',
            'santander': 'fa-university',
            'bbva': 'fa-building-columns',
            'nacion': 'fa-flag',
            'macro': 'fa-piggy-bank'
        };

        if (!bankName) return 'fa-wallet';

        const key = bankName.toLowerCase();
        return iconMap[key] || 'fa-university';
    }

    formatearMoneda(monto: number, moneda: string = 'ARS'): string {
        return `${moneda} ${monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    obtenerPorcentajeBalance(cuenta: EstadisticasCuenta): number {
        if (!this.resumen || this.resumen.totalGeneral === 0) return 0;
        return (cuenta.balance / this.resumen.totalGeneral) * 100;
    }
}
