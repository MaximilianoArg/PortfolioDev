import { Routes } from '@angular/router';

export const PRODUCTIVDAD_RUTAS: Routes = [
    {
        path: 'agenda',
        children: [
            { path: 'agenda', loadComponent: () => import('../productividad/agenda/agenda').then(m => m.AgendaComponente) },
        ]
    },
    {
        path: 'habitos',
        children: [
            { path: 'metas-corto', loadComponent: () => import('../productividad/habitos/metas-corto/metas-corto').then(m => m.MetasCortoComponente) },
            { path: 'metas-largo', loadComponent: () => import('../productividad/habitos/metas-largo/metas-largo').then(m => m.MetasLargoComponente) },
            { path: 'seguimiento', loadComponent: () => import('../productividad/habitos/seguimiento/seguimiento').then(m => m.SeguimientoComponente) },
        ]
    },
    {
        path: 'notas',
        children: [
            { path: 'notas', loadComponent: () => import('../productividad/notas/notas').then(m => m.NotasComponente) },
        ]
    }
];