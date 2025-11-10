import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbsPipe } from '../../../shared/pipes/abs-pipe';

// --- Interface para un item del presupuesto ---
export interface BudgetCategory {
  id: number;
  name: string;
  icon: string;
  budgetedAmount: number;
  spentAmount: number;
}

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AbsPipe,
  ],
  templateUrl: './presupuestos.html',
  styleUrls: ['./presupuestos.scss']
})
export class PresupuestosComponente implements OnInit {

  // --- Propiedades para los datos ---
  budgetItems: BudgetCategory[] = [];
  totalBudgeted: number = 0;
  totalSpent: number = 0;
  totalRemaining: number = 0;

  // --- Propiedades para el modal de edición ---
  isModalOpen = false;
  selectedBudget: BudgetCategory | null = null;
  editedAmount: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    // --- SIMULACIÓN DE LLAMADA A UN SERVICIO ---
    this.budgetItems = [
      { id: 1, name: 'Vivienda', icon: 'fas fa-home', budgetedAmount: 1200, spentAmount: 1200 },
      { id: 2, name: 'Comida', icon: 'fas fa-shopping-cart', budgetedAmount: 800, spentAmount: 650.50 },
      { id: 3, name: 'Transporte', icon: 'fas fa-bus', budgetedAmount: 200, spentAmount: 150 },
      { id: 4, name: 'Ocio', icon: 'fas fa-film', budgetedAmount: 250, spentAmount: 210.75 },
      { id: 5, name: 'Salud', icon: 'fas fa-heartbeat', budgetedAmount: 150, spentAmount: 50 },
      { id: 6, name: 'Ahorro', icon: 'fas fa-piggy-bank', budgetedAmount: 1000, spentAmount: 1000 },
    ].sort((a, b) => (a.budgetedAmount - a.spentAmount) - (b.budgetedAmount - b.spentAmount)); // Ordenar por dinero restante

    // Calculamos los totales para la tarjeta de resumen
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.totalBudgeted = this.budgetItems.reduce((sum, item) => sum + item.budgetedAmount, 0);
    this.totalSpent = this.budgetItems.reduce((sum, item) => sum + item.spentAmount, 0);
    this.totalRemaining = this.totalBudgeted - this.totalSpent;
  }

  // --- Helpers para la plantilla ---
  calculateProgress(spent: number, budget: number): number {
    if (budget <= 0) return 0;
    const percentage = (spent / budget) * 100;
    return Math.min(percentage, 100);
  }

  getProgressColor(percentage: number): string {
    if (percentage > 95) return 'bg-red-500';
    if (percentage > 80) return 'bg-yellow-500';
    return 'bg-green-500'; // Verde es bueno aquí, significa que no has gastado mucho
  }

  // --- Lógica del Modal ---
  openEditModal(item: BudgetCategory): void {
    this.selectedBudget = { ...item }; // Copiamos para no mutar el original
    this.editedAmount = item.budgetedAmount;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedBudget = null;
  }

  saveBudget(): void {
    if (this.selectedBudget) {
      // Aquí llamarías a un servicio para guardar el cambio en el backend
      // this.budgetService.update(this.selectedBudget.id, this.editedAmount).subscribe(...)
      
      console.log(`Guardando nuevo presupuesto para ${this.selectedBudget.name}: ${this.editedAmount}`);

      // --- Simulación de la actualización en el frontend ---
      const index = this.budgetItems.findIndex(item => item.id === this.selectedBudget!.id);
      if (index > -1) {
        this.budgetItems[index].budgetedAmount = this.editedAmount;
        this.calculateTotals(); // Recalculamos los totales después del cambio
      }
    }
    this.closeModal();
  }
}