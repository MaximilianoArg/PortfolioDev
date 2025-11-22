import { Component, OnInit, inject } from '@angular/core';
import { TransaccionServicio, Transaccion } from '../../transaccion';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormularioTransaccion } from '../../formulario-transaccion/formulario-transaccion'

interface SortConfig {
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

  public isModalOpen = false;
  public selectedTransaction: Transaccion | null = null;
  private route = inject(ActivatedRoute);
  private transaccionServicio = inject(TransaccionServicio);

  allTransactions: Transaccion[] = [];
  filteredTransactions: Transaccion[] = [];

  filterForm: FormGroup;
  availableCategories: string[] = ['Vivienda', 'Comida', 'Transporte', 'Ocio', 'Salud', 'Ahorro', 'Ingresos'];

  sortConfig: SortConfig = { key: 'fecha', direction: 'desc' };

  constructor() {
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

  openTransactionModal(transaction: Transaccion | null = null): void {
    this.selectedTransaction = transaction;
    this.isModalOpen = true;
  }

  closeTransactionModal(): void {
    this.isModalOpen = false;
    this.selectedTransaction = null;
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
    this.transaccionServicio.obtenerTransacciones().subscribe({
      next: (data) => {
        this.allTransactions = data;
        this.applyFiltersAndSort();
        console.log('Transacciones cargadas desde la API:', this.allTransactions);
      },
      error: (err) => console.error('Error al cargar transacciones desde la API:', err)
    });
  }

  applyFiltersAndSort(): void {
    const filters = this.filterForm.value;
    let transactions = [...this.allTransactions];

    if (filters.searchTerm) {
      transactions = transactions.filter(tx => tx.descripcion.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    }
    if (filters.category) {
      transactions = transactions.filter(tx => tx.categoria === filters.category);
    }
    if (filters.type) {
      transactions = transactions.filter(tx => tx.tipo_transaccion === filters.type);
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

        if (aValue === null || bValue === null || aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) return this.sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredTransactions = transactions;
  }

  onSort(key: keyof Transaccion): void {
    if (this.sortConfig.key === key) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.key = key;
      this.sortConfig.direction = 'asc';
    }
    this.applyFiltersAndSort();
  }

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
          this.loadTransactions();
        },
        error: (err) => console.error('Error al eliminar la transacción:', err)
      });
    }
  }
}