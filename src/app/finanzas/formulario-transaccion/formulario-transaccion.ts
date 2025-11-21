import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransaccionServicio, Transaccion } from '../transaccion';

@Component({
  selector: 'app-formulario-transaccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-transaccion.html',
  styleUrl: './formulario-transaccion.scss',
})
export class FormularioTransaccion implements OnInit{
  private fb = inject(FormBuilder);
  private transactionService = inject(TransaccionServicio);

  // Eventos para comunicarse con el componente padre
  @Input() transactionToEdit: Transaccion | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() transactionSaved = new EventEmitter<void>();

  transactionForm: FormGroup;
  isEditMode = false;

  constructor() {
    this.transactionForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      fecha: ['', Validators.required],
      categoria: ['', Validators.required],
      transaccion_tipo: ['expense', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.transactionToEdit) {
      this.isEditMode = true;
      this.transactionForm.patchValue(this.transactionToEdit);
    }
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched(); // Muestra los errores de validación
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
    //const transactionId = this.transactionToEdit!.id; // El ! dice a TS que confiamos que no es null
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