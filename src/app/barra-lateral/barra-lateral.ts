import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, EventEmitter, Input, Output  } from '@angular/core';
import { MenuItem } from '../shared/interfaces/menu-item.interface';

@Component({
  selector: 'app-barra-lateral',
  imports: [CommonModule, RouterModule],
  templateUrl: './barra-lateral.html',
  styleUrl: './barra-lateral.scss',
})
export class BarraLateral {
  @Input() estaColapsado = false;
  @Output() lateralSeleccionado = new EventEmitter<void>();
  
  menuItems: MenuItem[] = [
    {
      etiqueta: 'Dashboard Principal',
      icono: 'fas fa-home',
      ruta: '/dashboard',
    },
    { separador: true }, // Separador visual
    {
      esCabecera: true,
      etiqueta: 'Gestión Financiera',
    },
    {
      etiqueta: 'Inversiones',
      icono: 'fas fa-chart-line',
      estaAbierto: false,
      hijo: [
        {
          etiqueta: 'Cartera Actual',
          icono: 'fas fa-wallet',
          ruta: '/finanzas/inversiones/cartera',
        },
        {
          etiqueta: 'Historial Transacciones',
          icono: 'fas fa-history',
          ruta: '/finanzas/inversiones/historial',
        },
        {
          etiqueta: 'Análisis de Riesgo',
          icono: 'fas fa-shield-alt',
          ruta: '/finanzas/inversiones/riesgo',
        },
        {
          etiqueta: 'Simulador de Crecimiento',
          icono: 'fas fa-calculator',
          ruta: '/finanzas/inversiones/simulador',
        },
      ],
    },
    {
      etiqueta: 'Balances y Gastos',
      icono: 'fas fa-balance-scale-right',
      estaAbierto: false,
      hijo: [
        {
          etiqueta: 'Resumen Mensual',
          icono: 'fas fa-calendar-alt',
          ruta: '/finanzas/balances/mensual',
        },
        {
          etiqueta: 'Categorías de Gasto',
          icono: 'fas fa-tags',
          ruta: '/finanzas/balances/categorias',
        },
        {
          etiqueta: 'Presupuestos',
          icono: 'fas fa-money-bill-wave',
          ruta: '/finanzas/balances/presupuestos',
        },
        {
          etiqueta: 'Reportes Detallados',
          icono: 'fas fa-file-invoice-dollar',
          ruta: '/finanzas/balances/reportes',
        },
      ],
    },
    { separador: true },
    {
      esCabecera: true,
      etiqueta: 'Desarrollo de Software',
    },
    {
      etiqueta: 'Proyectos',
      icono: 'fas fa-folder-open',
      estaAbierto: false,
      hijo: [
        {
          etiqueta: 'Mis Proyectos Activos',
          icono: 'fas fa-code-branch',
          ruta: '/desarrollo/proyectos/activos',
        },
        {
          etiqueta: 'Backlog y Ideas',
          icono: 'fas fa-lightbulb',
          ruta: '/desarrollo/proyectos/backlog',
        },
        {
          etiqueta: 'Portafolio Completado',
          icono: 'fas fa-check-double',
          ruta: '/desarrollo/proyectos/completados',
        },
        {
          etiqueta: 'Gestión de Clientes',
          icono: 'fas fa-handshake',
          ruta: '/desarrollo/proyectos/clientes',
        },
      ],
    },
    {
      etiqueta: 'Tecnologías y Skills',
      icono: 'fas fa-laptop-code',
      estaAbierto: false,
      hijo: [
        {
          etiqueta: 'Stack Tecnológico',
          icono: 'fas fa-layer-group',
          ruta: '/desarrollo/tecnologias/stack',
        },
        {
          etiqueta: 'Ruta de Aprendizaje',
          icono: 'fas fa-graduation-cap',
          ruta: '/desarrollo/tecnologias/aprendizaje',
        },
        {
          etiqueta: 'Certificaciones',
          icono: 'fas fa-award',
          ruta: '/desarrollo/tecnologias/certificaciones',
        },
      ],
    },
    {
      etiqueta: 'Recursos Dev',
      icono: 'fas fa-book',
      ruta: '/desarrollo/recursos', // Podría ser una página con enlaces a docs, herramientas, etc.
    },
    { separador: true },
    {
      esCabecera: true,
      etiqueta: 'Productividad Personal',
    },
    {
      etiqueta: 'Agenda y Calendario',
      icono: 'fas fa-calendar-check',
      ruta: '/productividad/agenda',
    },
    {
      etiqueta: 'Hábitos y Metas',
      icono: 'fas fa-clipboard-list',
      estaAbierto: false,
      hijo: [
        {
          etiqueta: 'Seguimiento de Hábitos',
          icono: 'fas fa-dumbbell',
          ruta: '/productividad/habitos/seguimiento',
        },
        {
          etiqueta: 'Metas a Corto Plazo',
          icono: 'fas fa-bullseye',
          ruta: '/productividad/habitos/metas-corto',
        },
        {
          etiqueta: 'Metas a Largo Plazo',
          icono: 'fas fa-rocket',
          ruta: '/productividad/habitos/metas-largo',
        },
      ],
    },
    {
      etiqueta: 'Notas y Documentación',
      icono: 'fas fa-file-alt',
      ruta: '/productividad/notas',
    },
    { separador: true },
    {
      esCabecera: true,
      etiqueta: 'Ajustes',
    },
    {
      etiqueta: 'Configuración de la App',
      icono: 'fas fa-wrench',
      ruta: '/ajustes/general',
    },
    {
      etiqueta: 'Perfil de Usuario',
      icono: 'fas fa-user-circle',
      ruta: '/ajustes/perfil',
    },
    {
      etiqueta: 'Ayuda y Soporte',
      icono: 'fas fa-question-circle',
      ruta: '/ajustes/ayuda',
    },
    { separador: true },
    {
      etiqueta: 'Cerrar Sesión',
      icono: 'fas fa-sign-out-alt',
      ruta: '/auth/logout', // Asumiendo una ruta de logout
    },
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
