import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, EventEmitter, Input, Output  } from '@angular/core';
// Interface para los elementos
interface MenuItem {
  icono: string;
  etiqueta: string;
  ruta: string;
  hijo?: MenuItem[];
  estaAbierto?: boolean;
}
//
@Component({
  selector: 'app-barra-lateral',
  imports: [CommonModule, RouterModule],
  templateUrl: './barra-lateral.html',
  styleUrl: './barra-lateral.scss',
})
export class BarraLateral {
  @Input() estaColapsado = false;
  @Output() lateralSeleccionado = new EventEmitter<void>();
  
  menuItems = [
    {
      etiqueta: 'Inicio',
      icono: 'fas fa-home',
      ruta: '/inicio',
      estaAbierto: false
    },
    {
      etiqueta: 'Gestión',
      icono: 'fas fa-cogs',
      ruta: '/gestion', // Ruta base para el padre
      estaAbierto: false,
      hijo: [
        {
          etiqueta: 'Usuarios',
          icono: 'fas fa-users',
          ruta: '/gestion/usuarios'
        },
        {
          etiqueta: 'Productos',
          icono: 'fas fa-box',
          ruta: '/gestion/productos'
        }
      ]
    },
    {
      etiqueta: 'Estadísticas',
      icono: 'fas fa-chart-bar',
      ruta: '/estadisticas',
      estaAbierto: false
    },
    {
      etiqueta: 'Configuración',
      icono: 'fas fa-sliders-h',
      ruta: '/configuracion',
      estaAbierto: false
    },
    {
      etiqueta: 'Salir',
      icono: 'fas fa-sign-out',
      ruta: '/logout',
      estaAbierto: false
    }
  ];


  //
  presionarBarraLateral()
  {
    this.lateralSeleccionado.emit();
  }

  presionarItemMenu(item: MenuItem)
  {
    if(!this.estaColapsado && item.hijo)
    {
      item.estaAbierto = !item.estaAbierto;
    }
  }
}
