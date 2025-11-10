import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- Interfaces para una estructura jerárquica ---

// El resultado medible que define el éxito de un hito
interface KeyResult {
  id: number;
  description: string;
  completed: boolean;
}

// Un paso o etapa importante para alcanzar la meta
interface Milestone {
  id: number;
  title: string;
  keyResults: KeyResult[];
  completed: boolean;
}

// El gran objetivo a largo plazo
interface LongTermGoal {
  id: number;
  title: string;
  description: string;
  category: string; // 'Profesional', 'Personal', 'Financiero'
  targetDate: Date;
  milestones: Milestone[];
}

@Component({
  selector: 'app-metas-largo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './metas-largo.html',
  styleUrls: ['./metas-largo.scss']
})
export class MetasLargoComponente implements OnInit {

  // --- Propiedades de estado ---
  longTermGoals: LongTermGoal[] = [];
  
  // --- Modal ---
  isModalOpen = false;

  constructor() { }

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    // --- SIMULACIÓN DE LLAMADA A UN SERVICIO ---
    this.longTermGoals = [
      {
        id: 1,
        title: 'Convertirme en Arquitecto de Software',
        description: 'Alcanzar un rol de liderazgo técnico y diseñar soluciones escalables.',
        category: 'Profesional',
        targetDate: new Date('2028-12-31'),
        milestones: [
          { id: 101, title: 'Obtener Certificación Cloud (AWS/Azure)', completed: true, keyResults: [
            { id: 1011, description: 'Completar curso de preparación', completed: true },
            { id: 1012, description: 'Aprobar el examen de certificación', completed: true },
          ]},
          { id: 102, title: 'Liderar un proyecto de principio a fin', completed: false, keyResults: [
            { id: 1021, description: 'Definir la arquitectura del proyecto', completed: true },
            { id: 1022, description: 'Gestionar el backlog técnico', completed: false },
            { id: 1023, description: 'Entregar el MVP a producción', completed: false },
          ]},
          { id: 103, title: 'Contribuir a un proyecto Open Source', completed: false, keyResults: [] }
        ]
      },
      {
        id: 2,
        title: 'Alcanzar la Independencia Financiera',
        description: 'Generar suficientes ingresos pasivos para cubrir mis gastos de vida.',
        category: 'Financiero',
        targetDate: new Date('2035-01-01'),
        milestones: [
          { id: 201, title: 'Ahorrar 100k€ en el fondo de inversión', completed: false, keyResults: [
            { id: 2011, description: 'Automatizar aportaciones mensuales de 500€', completed: true },
            { id: 2012, description: 'Revisar y ajustar la cartera anualmente', completed: false },
          ]}
        ]
      }
    ];
  }

  // --- Lógica de Interacción ---
  toggleKeyResult(keyResult: KeyResult): void {
    keyResult.completed = !keyResult.completed;
    // Aquí llamarías a un servicio para guardar este cambio
  }

  // --- Helpers para la plantilla ---
  calculateMilestoneProgress(milestone: Milestone): number {
    if (milestone.keyResults.length === 0) return milestone.completed ? 100 : 0;
    const completedResults = milestone.keyResults.filter(kr => kr.completed).length;
    return (completedResults / milestone.keyResults.length) * 100;
  }

  calculateGoalProgress(goal: LongTermGoal): number {
    if (goal.milestones.length === 0) return 0;
    const completedMilestones = goal.milestones.filter(m => this.calculateMilestoneProgress(m) === 100).length;
    return (completedMilestones / goal.milestones.length) * 100;
  }

  getCategoryColor(category: string): string {
    switch(category.toLowerCase()) {
      case 'profesional': return 'bg-blue-100 text-blue-800';
      case 'financiero': return 'bg-green-100 text-green-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // --- Modal ---
  openModal(): void { this.isModalOpen = true; }
  closeModal(): void { this.isModalOpen = false; }
}