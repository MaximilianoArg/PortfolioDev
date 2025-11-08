import { Routes } from '@angular/router';

export const FINANZAS_RUTAS: Routes = [
    {
        path: 'balances',
        children: [
            { 
                path: 'categorias', 
                loadComponent: () => import('../finanzas/balances/categorias/categorias').then(m => m.CategoriasComponente) 
            },
            { 
                path: 'mensual', 
                loadComponent: () => import('../finanzas/balances/mensual/mensual').then(m => m.MensualComponente) 
            },
            { 
                path: 'presupuestos', 
                loadComponent: () => import('../finanzas/balances/presupuestos/presupuestos').then(m => m.PresupuestosComponente) 
            },
            { 
                path: 'reportes', 
                loadComponent: () => import('../finanzas/balances/reportes/reportes').then(m => m.ReportesComponente) 
            },
            {
                path: '', redirectTo: 'categorias', pathMatch: 'full'
            }
        ]
    },
    {
        path: 'inversiones',
        children: [
            { 
                path: 'cartera', 
                loadComponent: () => import('../finanzas/inversiones/cartera/cartera').then(m => m.CarteraComponente) 
            },
            { 
                path: 'historial', 
                loadComponent: () => import('../finanzas/inversiones/historial/historial').then(m => m.HistorialComponente) 
            },
            { 
                path: 'riesgo', 
                loadComponent: () => import('../finanzas/inversiones/riesgo/riesgo').then(m => m.RiesgoComponente) 
            },
            { 
                path: 'simulador', 
                loadComponent: () => import('../finanzas/inversiones/simulador/simulador').then(m => m.SimuladorComponente) 
            },
            {
                path: '', redirectTo: 'cartera', pathMatch: 'full'
            }
        ]
    }
];