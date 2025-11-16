import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, EventEmitter, Input, Output  } from '@angular/core';
import { MenuItem } from '../shared/interfaces/menu-item.interface';
import { UserProfile } from '../servicio/auth.interfaces';

@Component({
  selector: 'app-barra-lateral',
  imports: [CommonModule, RouterModule],
  templateUrl: './barra-lateral.html',
  styleUrl: './barra-lateral.scss',
})
export class BarraLateral {
  @Input() estaColapsado = false;
  @Input() userProfile: UserProfile | null = null;
  @Output() lateralSeleccionado = new EventEmitter<void>();
  
  menuItems: MenuItem[] = [
    {
      id: 0,
      etiqueta: 'Dashboard Principal',
      icono: 'fas fa-home',
      ruta: '',
    },
    { id: 1, separador: true }, // Separador visual
    {
      id: 2,
      esCabecera: true,
      etiqueta: 'Gestión Financiera',
    },
    {
      id: 3,
      etiqueta: 'Inversiones',
      icono: 'fas fa-chart-line',
      estaAbierto: false,
      hijo: [
        {
          id: 4,
          etiqueta: 'Cartera Actual',
          icono: 'fas fa-wallet',
          ruta: '/finanzas/inversiones/cartera',
        },
        {
          id: 5,
          etiqueta: 'Historial Transacciones',
          icono: 'fas fa-history',
          ruta: '/finanzas/inversiones/historial',
        },
        {
          id: 6,
          etiqueta: 'Análisis de Riesgo',
          icono: 'fas fa-shield-alt',
          ruta: '/finanzas/inversiones/riesgo',
        },
        {
          id: 7,
          etiqueta: 'Simulador de Crecimiento',
          icono: 'fas fa-calculator',
          ruta: '/finanzas/inversiones/simulador',
        },
      ],
    },
    {
      id: 8,
      etiqueta: 'Balances y Gastos',
      icono: 'fas fa-balance-scale-right',
      estaAbierto: false,
      hijo: [
        {
          id: 9,
          etiqueta: 'Resumen Mensual',
          icono: 'fas fa-calendar-alt',
          ruta: '/finanzas/balances/mensual',
        },
        {
          id: 10,
          etiqueta: 'Categorías de Gasto',
          icono: 'fas fa-tags',
          ruta: '/finanzas/balances/categorias',
        },
        {
          id: 11,
          etiqueta: 'Presupuestos',
          icono: 'fas fa-money-bill-wave',
          ruta: '/finanzas/balances/presupuestos',
        },
        {
          id: 12,
          etiqueta: 'Reportes Detallados',
          icono: 'fas fa-file-invoice-dollar',
          ruta: '/finanzas/balances/reportes',
        },
      ],
    },
    { id: 13, separador: true },
    {
      id: 14,
      esCabecera: true,
      etiqueta: 'Desarrollo de Software',
    },
    {
      id: 15,
      etiqueta: 'Proyectos',
      icono: 'fas fa-folder-open',
      estaAbierto: false,
      hijo: [
        {
          id: 16,
          etiqueta: 'Mis Proyectos Activos',
          icono: 'fas fa-code-branch',
          ruta: '/desarrollo/proyectos/activos',
        },
        {
          id: 17,
          etiqueta: 'Backlog y Ideas',
          icono: 'fas fa-lightbulb',
          ruta: '/desarrollo/proyectos/backlog',
        },
        {
          id: 18,
          etiqueta: 'Portafolio Completado',
          icono: 'fas fa-check-double',
          ruta: '/desarrollo/proyectos/completados',
        },
        {
          id: 19,
          etiqueta: 'Gestión de Clientes',
          icono: 'fas fa-handshake',
          ruta: '/desarrollo/proyectos/clientes',
        },
      ],
    },
    {
      id: 20,
      etiqueta: 'Tecnologías y Skills',
      icono: 'fas fa-laptop-code',
      estaAbierto: false,
      hijo: [
        {
          id: 21,
          etiqueta: 'Stack Tecnológico',
          icono: 'fas fa-layer-group',
          ruta: '/desarrollo/tecnologias/stack',
        },
        {
          id: 22,
          etiqueta: 'Ruta de Aprendizaje',
          icono: 'fas fa-graduation-cap',
          ruta: '/desarrollo/tecnologias/aprendizaje',
        },
        {
          id: 23,
          etiqueta: 'Certificaciones',
          icono: 'fas fa-award',
          ruta: '/desarrollo/tecnologias/certificaciones',
        },
      ],
    },
    {
      id: 24,
      etiqueta: 'Recursos Dev',
      icono: 'fas fa-book',
      ruta: '/desarrollo/recursos', // Podría ser una página con enlaces a docs, herramientas, etc.
    },
    { id: 25, separador: true },
    {
      id: 26,
      esCabecera: true,
      etiqueta: 'Productividad Personal',
    },
    {
      id: 27,
      etiqueta: 'Agenda y Calendario',
      icono: 'fas fa-calendar-check',
      ruta: '/productividad/agenda',
    },
    {
      id: 28,
      etiqueta: 'Hábitos y Metas',
      icono: 'fas fa-clipboard-list',
      estaAbierto: false,
      hijo: [
        {
          id: 29,
          etiqueta: 'Seguimiento de Hábitos',
          icono: 'fas fa-dumbbell',
          ruta: '/productividad/habitos/seguimiento',
        },
        {
          id: 30,
          etiqueta: 'Metas a Corto Plazo',
          icono: 'fas fa-bullseye',
          ruta: '/productividad/habitos/metas-corto',
        },
        {
          id: 31,
          etiqueta: 'Metas a Largo Plazo',
          icono: 'fas fa-rocket',
          ruta: '/productividad/habitos/metas-largo',
        },
      ],
    },
    {
      id: 32,
      etiqueta: 'Notas y Documentación',
      icono: 'fas fa-file-alt',
      ruta: '/productividad/notas',
    },
    { id: 33, separador: true },
    {
      id: 34,
      esCabecera: true,
      etiqueta: 'Ajustes',
    },
    {
      id: 35,
      etiqueta: 'Configuración de la App',
      icono: 'fas fa-wrench',
      ruta: '/ajustes/general',
    },
    {
      id: 36,
      etiqueta: 'Perfil de Usuario',
      icono: 'fas fa-user-circle',
      ruta: '/ajustes/perfil',
    },
    {
      id: 37,
      etiqueta: 'Ayuda y Soporte',
      icono: 'fas fa-question-circle',
      ruta: '/ajustes/ayuda',
    },
    { id: 38, separador: true },
    {
      id: 39,
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
