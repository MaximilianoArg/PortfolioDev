import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// --- 1. Imports para Drag & Drop ---
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

// --- Interface para una Meta ---
type GoalStatus = 'todo' | 'inProgress' | 'done';

interface Goal {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  status: GoalStatus;
}

@Component({
  selector: 'app-metas-corto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule // <-- 2. Importa el módulo de Drag & Drop
  ],
  templateUrl: './metas-corto.html',
  styleUrls: ['./metas-corto.scss']
})
export class MetasCortoComponente implements OnInit {

  // --- Propiedades de estado ---
  allGoals: Goal[] = [];
  
  // Arreglos separados para cada columna del Kanban
  todoGoals: Goal[] = [];
  inProgressGoals: Goal[] = [];
  doneGoals: Goal[] = [];

  // --- Modal ---
  isModalOpen = false;

  constructor() { }

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    // --- SIMULACIÓN DE LLAMADA A UN SERVICIO ---
    this.allGoals = [
      { id: 1, title: 'Terminar el componente de Agenda', description: 'Implementar el calendario y la lógica de eventos.', dueDate: new Date('2025-11-12'), status: 'done' },
      { id: 2, title: 'Investigar D3.js para gráficos', description: 'Ver si es una mejor opción que ngx-charts para visualizaciones complejas.', dueDate: new Date('2025-11-15'), status: 'inProgress' },
      { id: 3, title: 'Configurar el backend con Django', description: 'Crear los modelos y endpoints iniciales para la API.', dueDate: new Date('2025-11-20'), status: 'todo' },
      { id: 4, title: 'Refactorizar el servicio de autenticación', description: 'Mejorar el manejo de tokens y errores.', dueDate: new Date('2025-11-18'), status: 'todo' },
    ];
    this.filterGoalsByStatus();
  }
  
  // Distribuye las metas en los arreglos de cada columna
  filterGoalsByStatus(): void {
    this.todoGoals = this.allGoals.filter(g => g.status === 'todo').sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime());
    this.inProgressGoals = this.allGoals.filter(g => g.status === 'inProgress').sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime());
    this.doneGoals = this.allGoals.filter(g => g.status === 'done').sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  // --- Lógica de Drag & Drop ---
  drop(event: CdkDragDrop<Goal[]>): void {
    if (event.previousContainer === event.container) {
      // Si se mueve dentro de la misma columna, solo reordenamos
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Si se mueve a una columna diferente...
      const movedGoal = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id as GoalStatus; // El id del contenedor es el nuevo estado

      // 1. Actualizamos el estado de la meta
      movedGoal.status = newStatus;

      // 2. Aquí llamarías a tu servicio para guardar el cambio en el backend
      // this.goalService.update(movedGoal).subscribe(...);

      // 3. Movemos el item entre los arreglos
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  
  // --- Helpers para la plantilla ---
  calculateProgressPercentage(): number {
    if (this.allGoals.length === 0) return 0;
    return (this.doneGoals.length / this.allGoals.length) * 100;
  }

  // --- Modal ---
  openModal(): void { this.isModalOpen = true; }
  closeModal(): void { this.isModalOpen = false; }
}