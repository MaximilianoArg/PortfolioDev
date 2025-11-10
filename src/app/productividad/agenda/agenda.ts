import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Interfaces para nuestros datos ---
interface AgendaEvent {
  id: number;
  date: string; // Formato YYYY-MM-DD
  time: string; // Formato HH:mm
  title: string;
  type: 'meeting' | 'task' | 'reminder';
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;

  // Añadimos los eventos directamente al día para un acceso más fácil
  events: AgendaEvent[]; 
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './agenda.html',
  styleUrls: ['./agenda.scss']
})
export class AgendaComponente implements OnInit {

  // --- Propiedades de estado ---
  viewDate: Date = new Date(); // El mes que se está mostrando
  selectedDate: Date = new Date(); // El día seleccionado por el usuario
  
  calendarDays: CalendarDay[] = [];
  weekDays: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // --- Datos de eventos (simulación) ---
  allEvents: AgendaEvent[] = [];
  selectedDayEvents: AgendaEvent[] = [];

  // --- Modal ---
  isModalOpen = false;

  constructor() { }

  ngOnInit(): void {
    this.loadEvents();
    this.generateCalendar();
    this.updateSelectedDayEvents();
  }

  loadEvents(): void {
    // --- SIMULACIÓN DE LLAMADA A UN SERVICIO ---
    this.allEvents = [
      { id: 1, date: this.formatDate(new Date()), time: '10:00', title: 'Reunión de equipo', type: 'meeting' },
      { id: 2, date: this.formatDate(new Date()), time: '14:30', title: 'Revisar PRs', type: 'task' },
      { id: 3, date: this.formatDate(this.addDays(new Date(), 2)), time: '09:00', title: 'Entrevista candidato', type: 'meeting' },
      { id: 4, date: this.formatDate(this.addDays(new Date(), -1)), time: '18:00', title: 'Llamar al dentista', type: 'reminder' },
    ];
  }

  generateCalendar(): void {
    const days: CalendarDay[] = [];
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // 0=Lunes, 6=Domingo
    const numDays = lastDayOfMonth.getDate();

    // 1. Añadir días del mes anterior para rellenar
    for (let i = startDayOfWeek; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      days.push({ date, isCurrentMonth: false, isToday: false, events: this.getEventsForDate(date) });
    }

    // 2. Añadir días del mes actual
    for (let i = 1; i <= numDays; i++) {
      const date = new Date(year, month, i);
      const isToday = this.isSameDay(date, new Date());
      days.push({ date, isCurrentMonth: true, isToday, events: this.getEventsForDate(date) });
    }

    // 3. Añadir días del mes siguiente para rellenar
    const remainingSlots = 42 - days.length; // Para un grid de 6x7
    for (let i = 1; i <= remainingSlots; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false, isToday: false, events: this.getEventsForDate(date) });
    }

    this.calendarDays = days;
  }

  // --- Funciones de ayuda ---
  private getEventsForDate(date: Date): AgendaEvent[] {
    const dateString = this.formatDate(date);
    return this.allEvents.filter(event => event.date === dateString);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return this.formatDate(date1) === this.formatDate(date2);
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  // --- Interactividad ---
  changeMonth(offset: number): void {
    this.viewDate.setMonth(this.viewDate.getMonth() + offset);
    this.viewDate = new Date(this.viewDate);
    this.generateCalendar();
  }

  selectDay(day: CalendarDay): void {
    this.selectedDate = day.date;
    this.updateSelectedDayEvents();
  }

  updateSelectedDayEvents(): void {
    this.selectedDayEvents = this.getEventsForDate(this.selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  getEventTypeColor(type: AgendaEvent['type']): string {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'task': return 'bg-green-500';
      case 'reminder': return 'bg-yellow-500';
    }
  }

  // --- Modal ---
  openModal(): void { this.isModalOpen = true; }
  closeModal(): void { this.isModalOpen = false; }
}