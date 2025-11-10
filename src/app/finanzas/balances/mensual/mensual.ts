import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para ngIf, ngFor, ngClass, y pipes
import { NgxChartsModule, LegendPosition  } from '@swimlane/ngx-charts'; // Importa el módulo de gráficos

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
    NgxChartsModule // Añade el módulo de gráficos a los imports del componente
  ],
  templateUrl: './mensual.html',
  styleUrls: ['./mensual.scss']
})
export class MensualComponente implements OnInit {

  // Propiedad para controlar la fecha que se está mostrando
  currentDate: Date = new Date();

  // Datos de ejemplo. En una app real, vendrían de un servicio.
  kpiData: KpiData = { income: 0, expenses: 0, balance: 0 };
  categoryChartData: any[] = [];
  recentTransactions: Transaction[] = [];

  // Control para el modal de "Añadir Transacción"
  isModalOpen = false;
  public legendPosition: LegendPosition = LegendPosition.Below;

  constructor(/* private financialService: FinancialService */) { }

  ngOnInit(): void {
    // Cargar los datos del mes actual cuando el componente se inicia
    this.loadMonthData();
  }

  // Carga los datos financieros para el mes actualmente seleccionado
  loadMonthData(): void {
    console.log(`Cargando datos para: ${this.currentDate.toISOString()}`);
    // --- SIMULACIÓN DE LLAMADA A UN SERVICIO ---
    // En una aplicación real, aquí llamarías a tu servicio:
    // this.financialService.getSummary(this.currentDate).subscribe(data => { ... });

    // Datos de ejemplo para la simulación:
    this.kpiData = { income: 5200, expenses: 2850.75, balance: 2349.25 };
    
    this.categoryChartData = [
      { name: 'Comida', value: 850 },
      { name: 'Transporte', value: 420 },
      { name: 'Vivienda', value: 1200 },
      { name: 'Ocio', value: 380.75 },
    ];
    
    this.recentTransactions = [
      { id: 1, description: 'Compra en supermercado', category: 'Comida', categoryIcon: 'fas fa-shopping-cart', date: '2025-11-09', amount: 85.40, type: 'expense' },
      { id: 2, description: 'Salario Noviembre', category: 'Ingresos', categoryIcon: 'fas fa-briefcase', date: '2025-11-01', amount: 5200, type: 'income' },
      { id: 3, description: 'Factura de luz', category: 'Vivienda', categoryIcon: 'fas fa-lightbulb', date: '2025-11-05', amount: 120.30, type: 'expense' },
      { id: 4, description: 'Abono de transporte', category: 'Transporte', categoryIcon: 'fas fa-bus', date: '2025-11-03', amount: 54.60, type: 'expense' },
    ];
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
  }

  closeAddTransactionModal(): void {
    this.isModalOpen = false;
  }
}