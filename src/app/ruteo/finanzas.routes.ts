import { Routes } from '@angular/router';

export const FINANZAS_RUTAS: Routes = [
    {
        path: 'inversiones',
        children: [
            { path: 'cartera', loadComponent: () => import('./inversiones/cartera/cartera.component').then(m => m.CarteraComponent) },
            // ... otras rutas de inversiones
        ]
    },
    {
        path: 'balances',
        children: [
            { path: 'mensual', loadComponent: () => import('./balances/mensual/mensual.component').then(m => m.ResumenMensualComponent) },
            // ... otras rutas de balances
        ]
    }
];