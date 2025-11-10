import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; // Para leer parámetros de la URL

// --- Interfaces ---
interface Transaction {
  id: number;
  date: string; // Formato YYYY-MM-DD para facilitar el ordenamiento
  description: string;
  category: string;
  categoryIcon: string;
  amount: number;
  type: 'income' | 'expense';
}

interface SortConfig {
  key: keyof Transaction | null;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule // <-- Importante para el panel de filtros
  ],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.scss']
})
export class ReportesComponente implements OnInit {

  // --- Propiedades de datos ---
  allTransactions: Transaction[] = []; // Guarda la lista original sin modificar
  filteredTransactions: Transaction[] = []; // La lista que se muestra en la tabla

  // --- Propiedades para el formulario de filtros ---
  filterForm: FormGroup;
  // Para poblar el <select> de categorías
  availableCategories: string[] = ['Vivienda', 'Comida', 'Transporte', 'Ocio', 'Salud', 'Ahorro', 'Ingresos'];

  // --- Propiedades para el ordenamiento de la tabla ---
  sortConfig: SortConfig = { key: 'date', direction: 'desc' };

  constructor(private route: ActivatedRoute) {
    // Inicializamos el formulario en el constructor
    this.filterForm = new FormGroup({
      searchTerm: new FormControl(''),
      category: new FormControl(''),
      type: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadTransactions(); // Carga todos los datos

    // Escuchamos los cambios en los filtros para aplicar la lógica en tiempo real
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFiltersAndSort();
    });

    // Leemos los parámetros de la URL (si venimos de la página de Categorías)
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        // Buscamos el nombre de la categoría por su ID (simulación)
        const categoryName = this.availableCategories[params['categoria'] - 1] || '';
        this.filterForm.get('category')?.setValue(categoryName, { emitEvent: false }); // Actualizamos el filtro
        this.applyFiltersAndSort(); // Aplicamos el filtro inicial
      }
    });
  }

  loadTransactions(): void {
    // --- SIMULACIÓN DE LLAMADA A UN SERVICIO ---
    this.allTransactions = [
      { id: 1, date: '2025-11-09', description: 'Compra en supermercado', category: 'Comida', categoryIcon: 'fas fa-shopping-cart', amount: 85.40, type: 'expense' },
      { id: 2, date: '2025-11-01', description: 'Salario Noviembre', category: 'Ingresos', categoryIcon: 'fas fa-briefcase', amount: 5200, type: 'income' },
      { id: 3, date: '2025-11-05', description: 'Factura de luz', category: 'Vivienda', categoryIcon: 'fas fa-lightbulb', amount: 120.30, type: 'expense' },
      { id: 4, date: '2025-11-03', description: 'Abono de transporte', category: 'Transporte', categoryIcon: 'fas fa-bus', amount: 54.60, type: 'expense' },
      { id: 5, date: '2025-10-28', description: 'Cena con amigos', category: 'Ocio', categoryIcon: 'fas fa-film', amount: 45.00, type: 'expense' },
      { id: 6, date: '2025-10-15', description: 'Reembolso Amazon', category: 'Ingresos', categoryIcon: 'fas fa-undo', amount: 25.50, type: 'income' },
    ];
    this.applyFiltersAndSort(); // Aplicamos filtros (ninguno al principio) y ordenamiento inicial
  }

  applyFiltersAndSort(): void {
    const filters = this.filterForm.value;
    let transactions = [...this.allTransactions]; // Empezamos con una copia de todos los datos

    // Aplicamos cada filtro si tiene un valor
    if (filters.searchTerm) {
      transactions = transactions.filter(tx => tx.description.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    }
    if (filters.category) {
      transactions = transactions.filter(tx => tx.category === filters.category);
    }
    if (filters.type) {
      transactions = transactions.filter(tx => tx.type === filters.type);
    }
    if (filters.startDate) {
      transactions = transactions.filter(tx => new Date(tx.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      transactions = transactions.filter(tx => new Date(tx.date) <= new Date(filters.endDate));
    }

    // Aplicamos el ordenamiento
    if (this.sortConfig.key) {
      transactions.sort((a, b) => {
        const aValue = a[this.sortConfig.key!];
        const bValue = b[this.sortConfig.key!];
        
        if (aValue === null || bValue === null) return 0;
        if (aValue < bValue) return this.sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredTransactions = transactions;
  }

  onSort(key: keyof Transaction): void {
    if (this.sortConfig.key === key) {
      // Si ya se está ordenando por esta columna, invertimos la dirección
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // Si es una nueva columna, la establecemos y ordenamos ascendentemente
      this.sortConfig.key = key;
      this.sortConfig.direction = 'asc';
    }
    this.applyFiltersAndSort(); // Re-aplicamos todo con el nuevo orden
  }

  resetFilters(): void {
    this.filterForm.reset({
      searchTerm: '', category: '', type: '', startDate: '', endDate: ''
    });
  }

  // Placeholder para las acciones
  editTransaction(tx: Transaction, event: MouseEvent) { 
    event.stopPropagation();
    console.log('Editando:', tx);
  }
  deleteTransaction(tx: Transaction, event: MouseEvent) {
    event.stopPropagation();
    console.log('Eliminando:', tx);
  }
}