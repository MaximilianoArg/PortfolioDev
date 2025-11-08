import { Routes } from '@angular/router';
// Componentes.
import { ComponenteLogueo } from './login/login';
import { Desloguear } from './desloguear/desloguear';
import { PanelPrincipal } from './panel-principal/panel-principal';
import { GuardiaAutenticacion } from './autenticar-guard';

export const routes: Routes = [
    // Nueva direcciones para las rutas..
    { path: 'login', component: ComponenteLogueo },
    { path: 'logout', component: Desloguear },
    {
        path: '',
        component: PanelPrincipal,
        canActivate: [GuardiaAutenticacion],
        children: [
            { path: 'panel_principal', loadComponent: () => import('./panel-principal/panel-principal').then(m => m.PanelPrincipal) },
            {
                path: 'ajustes',
                loadChildren: () => import('./ruteo/ajustes.routes').then(m => m.AJUSTES_RUTAS)
            },
            {
                path: 'desarrollo',
                loadChildren: () => import('./ruteo/desarrollo.routes').then(m => m.DESARROLLO_RUTAS)
            },
            {
                path: 'finanzas',
                loadChildren: () => import('./ruteo/finanzas.routes').then(m => m.FINANZAS_RUTAS)
            },
            {
                path: 'productividad',
                loadChildren: () => import('./ruteo/productividad.routes').then(m => m.PRODUCTIVDAD_RUTAS)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
];
