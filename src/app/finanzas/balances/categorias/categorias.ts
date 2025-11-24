import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../servicio/category.service';
import { BudgetService } from '../../servicio/budget.service';
import { Category, Budget } from '../../servicio/category.interfaces';
import { forkJoin } from 'rxjs';

// Interface para mostrar categorías con presupuesto
interface CategoryWithBudget {
  id: number;
  name: string;
  icon: string;
  color: string;
  spentAmount: number;
  budgetedAmount: number;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.scss']
})
export class CategoriasComponente implements OnInit {
  private categoryService = inject(CategoryService);
  private budgetService = inject(BudgetService);
  private router = inject(Router);

  categories: CategoryWithBudget[] = [];
  isLoading = true;
  error: string | null = null;

  // Propiedades para el modal de gestión
  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedCategory: CategoryWithBudget | null = null;

  ngOnInit(): void {
    this.loadCategories();
  }

  // Método público para recargar categorías
  refresh(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.error = null;

    // Obtener mes actual en formato YYYY-MM
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    // Cargar categorías y presupuestos en paralelo
    forkJoin({
      categories: this.categoryService.getCategoriesByType('GASTO'),
      budgets: this.budgetService.getBudgets(currentMonth)
    }).subscribe({
      next: ({ categories, budgets }) => {
        // Combinar categorías con sus presupuestos
        this.categories = categories.map(cat => {
          const budget = budgets.find(b => b.category === cat.id);
          return {
            id: cat.id,
            name: cat.name,
            icon: cat.icon || 'fas fa-tag',
            color: cat.color || '#3B82F6',
            spentAmount: budget?.spent || 0,
            budgetedAmount: budget?.amount || 0
          };
        }).sort((a, b) => {
          // Ordenar por porcentaje de gasto (mayor a menor)
          const percentA = a.budgetedAmount > 0 ? (a.spentAmount / a.budgetedAmount) : 0;
          const percentB = b.budgetedAmount > 0 ? (b.spentAmount / b.budgetedAmount) : 0;
          return percentB - percentA;
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.error = 'Error al cargar las categorías. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  // Calcula el porcentaje de gasto para la barra de progreso
  calculateProgress(spent: number, budget: number): number {
    if (budget === 0) return 0;
    const percentage = (spent / budget) * 100;
    return Math.min(percentage, 100);
  }

  // Devuelve la clase de color de Tailwind para la barra de progreso según el %
  getProgressColor(percentage: number): string {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  }

  // Navega a la página de reportes, filtrada por esta categoría
  viewCategoryDetails(category: CategoryWithBudget): void {
    this.router.navigate(['/finanzas/balances/reportes'], { queryParams: { categoria: category.id } });
  }

  // Lógica del Modal
  openAddModal(): void {
    this.modalMode = 'add';
    this.selectedCategory = null;
    this.isModalOpen = true;
  }

  openEditModal(category: CategoryWithBudget, event: MouseEvent): void {
    event.stopPropagation();
    this.modalMode = 'edit';
    this.selectedCategory = { ...category };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveCategory(): void {
    // Aquí iría la lógica para guardar los datos del formulario del modal
    console.log('Guardando categoría:', this.selectedCategory);
    this.closeModal();
    this.loadCategories(); // Recargar categorías después de guardar
  }
}