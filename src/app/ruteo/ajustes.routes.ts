import { Routes } from '@angular/router';

export const AJUSTES_RUTAS: Routes = [
    {
        path: '', 
        children: [
            { 
                path: 'ayuda', 
                loadComponent: () => import('../ajustes/ayuda/ayuda').then(m => m.AyudaComponente) 
            },
            { 
                path: 'general', 
                loadComponent: () => import('../ajustes/general/general').then(m => m.GeneralComponente) 
            },
            { 
                path: 'perfil', 
                loadComponent: () => import('../ajustes/perfil/perfil').then(m => m.PerfilComponente) 
            },
            // Esta redirección ahora funcionará correctamente para la URL '/ajustes'
            {
                path: '', redirectTo: 'general', pathMatch: 'full'
            }
        ]
    }
];