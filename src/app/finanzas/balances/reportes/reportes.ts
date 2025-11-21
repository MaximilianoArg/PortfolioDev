import { Component, OnInit, inject } from '@angular/core'; // <-- Usamos inject para un código más limpio
import { TransaccionServicio, Transaccion } from '../../transaccion'; // <-- Asegúrate que la ruta a tu servicio es correcta
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormularioTransaccion } from '../../formulario-transaccion/formulario-transaccion'

// La interfaz Transaccion se define en el servicio, aquí la importamos.

interface SortConfig {
  // Asegúrate que las claves coincidan con la interfaz Transaccion
  key: keyof Transaccion | null;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormularioTransaccion
  ],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.scss']
})
export class ReportesComponente implements OnInit {

  // --- Dependencias ---
  public isModalOpen = false;
  public selectedTransaction: Transaccion | null = null;
  private route = inject(ActivatedRoute);
  private transaccionServicio = inject(TransaccionServicio); // <-- 1. Inyectamos el servicio

  // --- Propiedades de datos ---
  allTransactions: Transaccion[] = [];
  filteredTransactions: Transaccion[] = [];

  // --- Propiedades para el formulario de filtros ---
  filterForm: FormGroup;
  availableCategories: string[] = ['Vivienda', 'Comida', 'Transporte', 'Ocio', 'Salud', 'Ahorro', 'Ingresos'];

  // --- Propiedades para el ordenamiento de la tabla ---
  sortConfig: SortConfig = { key: 'fecha', direction: 'desc' };

  constructor() {
    // La inicialización del formulario se queda igual
    this.filterForm = new FormGroup({
      searchTerm: new FormControl(''),
      category: new FormControl(''),
      type: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadTransactions();

    // Toda esta lógica de filtros y queryParams se queda EXACTAMENTE IGUAL. ¡Está perfecta!
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFiltersAndSort();
    });

    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        const categoryName = this.availableCategories[params['categoria'] - 1] || '';
        this.filterForm.get('category')?.setValue(categoryName, { emitEvent: false });
        this.applyFiltersAndSort();
      }
    });
  }

  refreshTransactions(): void {
    this.transaccionServicio.obtenerTransacciones().subscribe({
      next: (data) => {
        this.allTransactions = data;
        this.applyFiltersAndSort();
      },
      error: (err) => console.error('Error al recargar transacciones:', err)
    });
  }

  // Métodos para controlar el modal
  openTransactionModal(transaction: Transaccion | null = null): void {
    this.selectedTransaction = transaction; // Guarda la transacción (o null si es nueva)
    this.isModalOpen = true;
  }

  closeTransactionModal(): void {
    this.isModalOpen = false;
    this.selectedTransaction = null; // Limpia la selección al cerrar
  }

  editTransaction(tx: Transaccion, event: MouseEvent) {
    event.stopPropagation();
    this.openTransactionModal(tx);
  }

  onTransactionSaved(): void {
    console.log('La transacción se guardó, refrescando la lista...');
    this.refreshTransactions();
  }

  loadTransactions(): void {
    // --- 2. REEMPLAZAMOS LA SIMULACIÓN POR LA LLAMADA REAL A LA API ---
    this.transaccionServicio.obtenerTransacciones().subscribe({
      next: (data) => {
        this.allTransactions = data; // Guardamos los datos reales
        this.applyFiltersAndSort(); // Aplicamos filtros y ordenamiento inicial
        console.log('Transacciones cargadas desde la API:', this.allTransactions);
      },
      error: (err) => console.error('Error al cargar transacciones desde la API:', err)
    });
  }

  // ¡ESTE MÉTODO NO NECESITA NINGÚN CAMBIO!
  // Sigue funcionando perfectamente con los datos cargados en 'allTransactions'.
  applyFiltersAndSort(): void {
    const filters = this.filterForm.value;
    let transactions = [...this.allTransactions];

    if (filters.searchTerm) {
      transactions = transactions.filter(tx => tx.descripcion.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    }
    // ... el resto de la lógica de filtros sigue igual ...
    if (filters.category) {
      transactions = transactions.filter(tx => tx.categoria === filters.category);
    }
    // OJO: Tu modelo de Django usa 'INCOME'/'EXPENSE'. El mock usaba 'income'/'expense'.
    // Asegurémonos que el <select> en tu HTML envíe los valores correctos (en mayúsculas).
    if (filters.type) {
      transactions = transactions.filter(tx => tx.transaccion_tipo === filters.type);
    }
    if (filters.startDate) {
      transactions = transactions.filter(tx => new Date(tx.fecha) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      transactions = transactions.filter(tx => new Date(tx.fecha) <= new Date(filters.endDate));
    }

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

  // Este método tampoco necesita cambios.
  onSort(key: keyof Transaccion): void {
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

  // Este método tampoco necesita cambios.
  resetFilters(): void {
    this.filterForm.reset({
      searchTerm: '', category: '', type: '', startDate: '', endDate: ''
    });
  }

  deleteTransaction(tx: Transaccion, event: MouseEvent) {
    event.stopPropagation();
    if (confirm(`¿Estás seguro de que quieres eliminar la transacción "${tx.descripcion}"?`)) {
      this.transaccionServicio.borrarTransaccion(tx.id).subscribe({
        next: () => {
          console.log('Transacción eliminada con éxito.');
          // Para reflejar el cambio, volvemos a cargar los datos desde el servidor.
          this.loadTransactions();
        },
        error: (err) => console.error('Error al eliminar la transacción:', err)
      });
    }
  }
}