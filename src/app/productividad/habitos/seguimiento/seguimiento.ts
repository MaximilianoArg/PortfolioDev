import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- Interfaces para una estructura clara ---
interface Habit {
  id: number;
  name: string;
  icon: string; // ej: 'fas fa-book-reader'
  goal: number; // Veces por semana que se quiere completar
}

// Para registrar qué hábitos se completaron en qué día
interface HabitLog {
  date: string; // Formato YYYY-MM-DD
  habitId: number;
}

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './seguimiento.html',
  styleUrls: ['./seguimiento.scss']
})
export class SeguimientoComponente implements OnInit {

  // --- Propiedades de estado ---
  habits: Habit[] = [];
  logs: HabitLog[] = []; // Todos los registros
  
  viewDate: Date = new Date(); // El día de referencia para la semana actual
  weekDays: Date[] = [];
  
  // --- Modal ---
  isModalOpen = false;
  
  constructor() { }

  ngOnInit(): void {
    this.loadData();
    this.generateWeek();
  }
  
  loadData(): void {
    // --- SIMULACIÓN DE LLAMADA A UN SERVICIO ---
    this.habits = [
      { id: 1, name: 'Leer 20 páginas', icon: 'fas fa-book-reader', goal: 5 },
      { id: 2, name: 'Hacer ejercicio', icon: 'fas fa-dumbbell', goal: 4 },
      { id: 3, name: 'Meditar 10 min', icon: 'fas fa-brain', goal: 7 },
      { id: 4, name: 'Estudiar Angular', icon: 'fab fa-angular', goal: 3 },
    ];

    // Datos de ejemplo para los registros
    this.logs = [
      { date: this.formatDate(this.addDays(new Date(), -3)), habitId: 1 },
      { date: this.formatDate(this.addDays(new Date(), -2)), habitId: 1 },
      { date: this.formatDate(this.addDays(new Date(), -2)), habitId: 2 },
      { date: this.formatDate(this.addDays(new Date(), -1)), habitId: 1 },
      { date: this.formatDate(this.addDays(new Date(), -1)), habitId: 2 },
      { date: this.formatDate(this.addDays(new Date(), -1)), habitId: 3 },
      { date: this.formatDate(new Date()), habitId: 1 },
      { date: this.formatDate(new Date()), habitId: 3 },
    ];
  }

  generateWeek(): void {
    const startOfWeek = this.getStartOfWeek(this.viewDate);
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      this.weekDays.push(this.addDays(startOfWeek, i));
    }
  }

  // --- Lógica de Interacción ---
  toggleHabit(habitId: number, date: Date): void {
    const dateString = this.formatDate(date);
    const logIndex = this.logs.findIndex(log => log.date === dateString && log.habitId === habitId);

    if (logIndex > -1) {
      // Si el registro existe, lo eliminamos (desmarcar)
      this.logs.splice(logIndex, 1);
    } else {
      // Si no existe, lo añadimos (marcar)
      this.logs.push({ date: dateString, habitId });
    }
  }

  // --- Funciones de Ayuda para la Plantilla ---
  isHabitCompleted(habitId: number, date: Date): boolean {
    const dateString = this.formatDate(date);
    return this.logs.some(log => log.date === dateString && log.habitId === habitId);
  }

  // Calcula la racha (días consecutivos terminando hoy o ayer)
  calculateStreak(habitId: number): number {
    let streak = 0;
    let currentDate = new Date();
    
    // Si se completó hoy, la racha empieza en 1
    if (this.isHabitCompleted(habitId, currentDate)) {
      streak++;
      currentDate = this.addDays(currentDate, -1);
    } 
    // Si no se completó hoy pero sí ayer, la fecha de inicio es ayer
    else if (this.isHabitCompleted(habitId, this.addDays(currentDate, -1))) {
      currentDate = this.addDays(currentDate, -1);
    } else {
      return 0; // No hay racha activa
    }
    
    // Contamos hacia atrás
    while (this.isHabitCompleted(habitId, currentDate)) {
      streak++;
      currentDate = this.addDays(currentDate, -1);
    }
    return streak;
  }
  
  getWeekProgress(habitId: number): number {
    return this.weekDays.filter(day => this.isHabitCompleted(habitId, day)).length;
  }
  
  // --- Navegación de Semana ---
  changeWeek(offset: number): void {
    this.viewDate = this.addDays(this.viewDate, offset * 7);
    this.generateWeek();
  }

  // --- Helpers de Fecha ---
  private formatDate(date: Date): string { return date.toISOString().split('T')[0]; }
  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para que la semana empiece en Lunes
    return new Date(d.setDate(diff));
  }

  // --- Modal ---
  openModal(): void { this.isModalOpen = true; }
  closeModal(): void { this.isModalOpen = false; }
}