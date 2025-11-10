import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para @for, [ngClass], etc.
import { Router, RouterModule } from '@angular/router'; // Para la navegación

// --- Interface para una categoría ---
export interface Category {
  id: number;
  name: string;
  icon: string; // Clase de Font Awesome, ej: 'fas fa-shopping-cart'
  spentAmount: number;
  budgetedAmount: number;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // Necesario si usamos routerLink para navegar
  ],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.scss']
})
export class CategoriasComponente implements OnInit {

  // Datos de ejemplo. En una app real, vendrían de un servicio.
  categories: Category[] = [];

  // --- Propiedades para el modal de gestión ---
  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedCategory: Category | null = null; // Para saber qué categoría editar

  // Inyectamos el Router para poder navegar programáticamente
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    // --- SIMULACIÓN DE LLAMADA A UN SERVICIO ---
    this.categories = [
      { id: 1, name: 'Vivienda', icon: 'fas fa-home', spentAmount: 1200, budgetedAmount: 1200 },
      { id: 2, name: 'Comida', icon: 'fas fa-shopping-cart', spentAmount: 650.50, budgetedAmount: 800 },
      { id: 3, name: 'Transporte', icon: 'fas fa-bus', spentAmount: 150, budgetedAmount: 200 },
      { id: 4, name: 'Ocio y Entretenimiento', icon: 'fas fa-film', spentAmount: 210.75, budgetedAmount: 250 },
      { id: 5, name: 'Salud', icon: 'fas fa-heartbeat', spentAmount: 50, budgetedAmount: 150 },
      { id: 6, name: 'Ahorro', icon: 'fas fa-piggy-bank', spentAmount: 1000, budgetedAmount: 1000 },
    ].sort((a, b) => (b.spentAmount / b.budgetedAmount) - (a.spentAmount / a.budgetedAmount)); // Ordenar por % de gasto
  }

  // --- Helpers para la plantilla ---

  // Calcula el porcentaje de gasto para la barra de progreso
  calculateProgress(spent: number, budget: number): number {
    if (budget === 0) return 0;
    const percentage = (spent / budget) * 100;
    return Math.min(percentage, 100); // Para que la barra no se pase del 100%
  }

  // Devuelve la clase de color de Tailwind para la barra de progreso según el %
  getProgressColor(percentage: number): string {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  }

  // --- Navegación ---
  
  // Navega a la página de reportes, filtrada por esta categoría
  viewCategoryDetails(category: Category): void {
    // Navegamos a la ruta de reportes y pasamos el ID de la categoría como parámetro
    this.router.navigate(['/finanzas/balances/reportes'], { queryParams: { categoria: category.id } });
  }

  // --- Lógica del Modal ---

  openAddModal(): void {
    this.modalMode = 'add';
    this.selectedCategory = null; // Reiniciamos por si había algo seleccionado
    this.isModalOpen = true;
  }
  
  openEditModal(category: Category, event: MouseEvent): void {
    event.stopPropagation(); // Evita que el clic active la navegación
    this.modalMode = 'edit';
    this.selectedCategory = { ...category }; // Copiamos el objeto para no modificar el original
    this.isModalOpen = true;
  }
  
  closeModal(): void {
    this.isModalOpen = false;
  }
  
  saveCategory(): void {
    // Aquí iría la lógica para guardar los datos del formulario del modal
    // llamando a un servicio. Por ahora, solo cerramos el modal.
    console.log('Guardando categoría:', this.selectedCategory);
    this.closeModal();
  }
}