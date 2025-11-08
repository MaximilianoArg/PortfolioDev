import { Routes } from '@angular/router';

export const AJUSTES_RUTAS: Routes = [
    {
        path: 'ajustes',
        children: [
            { path: 'ayuda', loadComponent: () => import('../ajustes/ayuda/ayuda').then(m => m.AyudaComponente) },
            { path: 'general', loadComponent: () => import('../ajustes/general/general').then(m => m.GeneralComponente) },
            { path: 'perfil', loadComponent: () => import('../ajustes/perfil/perfil').then(m => m.PerfilComponente) },
            { path: '', redirectTo: 'ayuda', pathMatch: 'full'}
        ]
    }
];