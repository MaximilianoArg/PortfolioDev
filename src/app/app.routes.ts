import { Routes } from '@angular/router';
// Componentes.
import { ComponenteLogueo } from './login/login';
import { Desloguear } from './desloguear/desloguear';
import { PanelPrincipal } from './panel-principal/panel-principal';
import { GuardiaAutenticacion } from './autenticar-guard';

export const routes: Routes = [
    { path: 'login', component: ComponenteLogueo },
    { path: 'logout', component: Desloguear },
    { path: 'panel-principal', component: PanelPrincipal, canActivate: [GuardiaAutenticacion]},
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
