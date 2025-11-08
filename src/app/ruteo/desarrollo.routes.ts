import { Routes } from '@angular/router';

// Este archivo define las rutas para la sección "Desarrollo", que serán cargadas
// de forma diferida (lazy loading) desde el enrutador principal de la aplicación.
// La ruta base (ej. '/desarrollo') se define en app.routes.ts.

export const DESARROLLO_RUTAS: Routes = [
    {
        // Corresponde a la carpeta 'proyectos'.
        // La URL será /desarrollo/proyectos/...
        path: 'proyectos',
        children: [
            { 
                path: 'activos', 
                loadComponent: () => import('../desarrollo/proyectos/activos/activos').then(m => m.ActivosComponente) 
            },
            { 
                path: 'backlog', 
                loadComponent: () => import('../desarrollo/proyectos/backlog/backlog').then(m => m.BacklogComponente) 
            },
            { 
                path: 'clientes', 
                loadComponent: () => import('../desarrollo/proyectos/clientes/clientes').then(m => m.ClientesComponente) 
            },
            { 
                path: 'completados', 
                loadComponent: () => import('../desarrollo/proyectos/completados/completados').then(m => m.CompletadosComponente) 
            },
            { 
                path: '', 
                redirectTo: 'activos', 
                pathMatch: 'full' 
            }
        ]
    },
    {
        path: 'tecnologias',
        children: [
            { 
                path: 'aprendizaje', 
                loadComponent: () => import('../desarrollo/tecnologias/aprendizaje/aprendizaje').then(m => m.AprendizajeComponente) 
            },
            { 
                path: 'certificaciones', 
                loadComponent: () => import('../desarrollo/tecnologias/certificaciones/certificaciones').then(m => m.CertificacionesComponente) 
            },
            { 
                path: 'stack', 
                loadComponent: () => import('../desarrollo/tecnologias/stack/stack').then(m => m.StackComponente) 
            },
            // Redirección a la vista por defecto de 'tecnologias'.
            { 
                path: '', 
                redirectTo: 'stack', 
                pathMatch: 'full' 
            }
        ]
    },
    {
        path: 'recursos',
        loadComponent: () => import('../desarrollo/recursos/recursos').then(m => m.RecursosComponente)
    },
    {
        path: '',
        redirectTo: 'proyectos',
        pathMatch: 'full'
    }
];