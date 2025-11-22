import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';
import { TransaccionServicio, Transaccion } from '../../transaccion';
import { AccountService } from '../../servicio/account.service';
import { Account } from '../../servicio/account.interfaces';
import { CategoryService } from '../../servicio/category.service';
import { Category } from '../../servicio/category.interfaces';

// --- Interfaces para estructurar nuestros datos ---
interface KpiData {
  income: number;
  expenses: number;
  balance: number;
}

interface Transaction {
  id: number;
  description: string;
  category: string;
  categoryIcon: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
}

@Component({
  selector: 'app-mensual',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxChartsModule
  ],
  templateUrl: './mensual.html',
  styleUrls: ['./mensual.scss']
})
export class MensualComponente implements OnInit {

  // Propiedad para controlar la fecha que se está mostrando
  currentDate: Date = new Date();

  // Datos
  kpiData: KpiData = { income: 0, expenses: 0, balance: 0 };
  categoryChartData: any[] = [];
  recentTransactions: Transaction[] = [];

  // Control para el modal de "Añadir Transacción"
  isModalOpen = false;
  public legendPosition: LegendPosition = LegendPosition.Below;

  // Account selection
  accounts: Account[] = [];
  selectedAccountId: number | null = null;

  // Categories
  categories: Category[] = [];
  expenseCategories: Category[] = [];
  incomeCategories: Category[] = [];

  // New transaction form
  newTransaction: Partial<Transaccion> = {
    descripcion: '',
    monto: '0',
    fecha: new Date().toISOString().split('T')[0],
    categoria: undefined,
    tipo_transaccion: 'GASTO'
  };

  constructor(
    private transaccionServicio: TransaccionServicio,
    private accountService: AccountService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadAccounts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.expenseCategories = categories.filter(c => c.type === 'GASTO' && !c.parent_category);
        this.incomeCategories = categories.filter(c => c.type === 'INGRESO' && !c.parent_category);
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        if (accounts.length > 0) {
          this.selectedAccountId = accounts[0].id!;
          this.loadMonthData();
        }
      },
      error: (err) => console.error('Error loading accounts', err)
    });
  }

  onAccountChange(): void {
    this.loadMonthData();
  }

  // Carga los datos financieros para el mes actualmente seleccionado
  loadMonthData(): void {
    console.log(`Cargando datos para: ${this.currentDate.toISOString()}`);

    this.transaccionServicio.obtenerTransacciones().subscribe({
      next: (transactions) => {
        // Filter by selected account if one is selected
        let filteredTransactions = transactions;
        if (this.selectedAccountId) {
          filteredTransactions = transactions.filter(t => t.account === this.selectedAccountId);
        }

        // Filter by current month
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();

        filteredTransactions = filteredTransactions.filter(t => {
          const txDate = new Date(t.fecha);
          return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
        });

        // Calculate KPIs
        let income = 0;
        let expenses = 0;
        const categoryMap = new Map<string, number>();

        filteredTransactions.forEach(tx => {
          const amount = parseFloat(tx.monto);
          if (tx.tipo_transaccion === 'INGRESO') {
            income += amount;
          } else {
            expenses += amount;
            // Aggregate by category name
            const categoryName = tx.category_name || 'Sin categoría';
            const current = categoryMap.get(categoryName) || 0;
            categoryMap.set(categoryName, current + amount);
          }
        });

        this.kpiData = {
          income,
          expenses,
          balance: income - expenses
        };

        // Prepare chart data
        this.categoryChartData = Array.from(categoryMap.entries()).map(([name, value]) => ({
          name,
          value
        }));

        // Prepare recent transactions
        this.recentTransactions = filteredTransactions
          .slice(0, 10)
          .map(tx => ({
            id: tx.id,
            description: tx.descripcion,
            category: tx.category_name || 'Sin categoría',
            categoryIcon: this.getCategoryIconById(tx.categoria),
            date: tx.fecha,
            amount: parseFloat(tx.monto),
            type: tx.tipo_transaccion === 'INGRESO' ? 'income' : 'expense'
          }));
      },
      error: (err) => console.error('Error loading transactions', err)
    });
  }

  getCategoryIconById(categoryId: number): string {
    const cat = this.categories.find(c => c.id === categoryId);
    return cat?.icon || 'fas fa-circle';
  }

  getCategoryColorById(categoryId: number): string {
    const cat = this.categories.find(c => c.id === categoryId);
    return cat?.color || '#6B7280';
  }

  // Cambia el mes mostrado (offset = -1 para anterior, 1 para siguiente)
  changeMonth(offset: number): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    // Creamos una nueva instancia de Date para forzar la detección de cambios en Angular
    this.currentDate = new Date(this.currentDate);
    this.loadMonthData();
  }

  // --- Lógica del Modal ---
  openAddTransactionModal(): void {
    this.isModalOpen = true;
    this.newTransaction = {
      descripcion: '',
      monto: '0',
      fecha: new Date().toISOString().split('T')[0],
      categoria: undefined,
      tipo_transaccion: 'GASTO',
      account: this.selectedAccountId || undefined
    };
  }

  closeAddTransactionModal(): void {
    this.isModalOpen = false;
  }

  saveTransaction(): void {
    if (!this.newTransaction.descripcion || !this.newTransaction.categoria) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const transactionToSave: any = {
      ...this.newTransaction,
      account: this.selectedAccountId
    };

    this.transaccionServicio.crearTransaccion(transactionToSave).subscribe({
      next: () => {
        this.loadMonthData();
        this.closeAddTransactionModal();
      },
      error: (err) => console.error('Error creating transaction', err)
    });
  }
}