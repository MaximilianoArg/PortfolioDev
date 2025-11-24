import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransaccionServicio, Transaccion } from '../transaccion';
import { CategoryService } from '../servicio/category.service';
import { Category } from '../servicio/category.interfaces';
import { AccountService } from '../servicio/account.service';
import { Account } from '../servicio/account.interfaces';

@Component({
  selector: 'app-formulario-transaccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-transaccion.html',
  styleUrl: './formulario-transaccion.scss',
})
export class FormularioTransaccion implements OnInit {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransaccionServicio);
  private categoryService = inject(CategoryService);
  private accountService = inject(AccountService);

  @Input() transactionToEdit: Transaccion | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() transactionSaved = new EventEmitter<void>();

  transactionForm: FormGroup;
  isEditMode = false;
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  accounts: Account[] = [];
  selectedAccountBalance: number = 0;
  balanceError: string = '';

  constructor() {
    this.transactionForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      fecha: ['', Validators.required],
      categoria: ['', Validators.required],
      account: ['', Validators.required],
      tipo_transaccion: ['GASTO', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filterCategories();
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });

    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (err) => console.error('Error al cargar cuentas:', err)
    });

    this.transactionForm.get('tipo_transaccion')?.valueChanges.subscribe(() => {
      this.filterCategories();
      this.validateBalance();
    });

    this.transactionForm.get('account')?.valueChanges.subscribe((accountId) => {
      this.onAccountChange(accountId);
    });

    this.transactionForm.get('monto')?.valueChanges.subscribe(() => {
      this.validateBalance();
    });

    if (this.transactionToEdit) {
      this.isEditMode = true;
      this.transactionForm.patchValue(this.transactionToEdit);
    }
  }

  filterCategories(): void {
    const transactionType = this.transactionForm.get('tipo_transaccion')?.value;
    if (transactionType === 'GASTO') {
      this.filteredCategories = this.categories.filter(cat => cat.type === 'GASTO');
    } else if (transactionType === 'INGRESO') {
      this.filteredCategories = this.categories.filter(cat => cat.type === 'INGRESO');
    } else {
      this.filteredCategories = this.categories;
    }
  }

  onAccountChange(accountId: number): void {
    const account = this.accounts.find(acc => acc.id === accountId);
    this.selectedAccountBalance = account?.balance || 0;
    this.validateBalance();
  }

  validateBalance(): void {
    const tipo = this.transactionForm.get('tipo_transaccion')?.value;
    const monto = this.transactionForm.get('monto')?.value;
    const accountId = this.transactionForm.get('account')?.value;

    this.balanceError = '';

    if (tipo === 'GASTO' && accountId && monto) {
      const account = this.accounts.find(acc => acc.id === Number(accountId));
      if (account) {
        this.selectedAccountBalance = account.balance;

        if (this.selectedAccountBalance === 0) {
          this.balanceError = 'No puedes realizar gastos con balance 0';
        } else if (monto > this.selectedAccountBalance) {
          this.balanceError = `Balance insuficiente. Disponible: $${this.selectedAccountBalance.toFixed(2)}`;
        }
      }
    }
  }

  isFormValid(): boolean {
    return this.transactionForm.valid && this.balanceError === '';
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      this.updateTransaction();
    } else {
      this.createTransaction();
    }
  }

  createTransaction(): void {
    this.transactionService.crearTransaccion(this.transactionForm.value).subscribe({
      next: () => {
        this.transactionSaved.emit();
        this.close.emit();
      },
      error: (err) => console.error('Error al crear la transacción:', err)
    });
  }

  updateTransaction(): void {
    this.transactionService.actualizarTransaccion(this.transactionForm.value).subscribe({
      next: () => {
        this.transactionSaved.emit();
        this.close.emit();
      },
      error: (err) => console.error('Error al actualizar la transacción:', err)
    });
  }

  closeModal(): void {
    this.close.emit();
  }
}