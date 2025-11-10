import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Interfaces para una estructura clara ---
interface LearningResource {
  id: number;
  title: string;
  type: 'Curso' | 'Libro' | 'Artículo' | 'Proyecto';
  url?: string; // Enlace al recurso
}

interface LearningStage {
  id: number;
  title: string;
  description: string;
  status: 'Completado' | 'En Progreso' | 'Pendiente';
  resources: LearningResource[];
}

interface LearningPath {
  id: number;
  title: string;
  goal: string;
  stages: LearningStage[];
}

@Component({
  selector: 'app-aprendizaje',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './aprendizaje.html',
  styleUrls: ['./aprendizaje.scss']
})
export class AprendizajeComponente implements OnInit {

  learningPaths: LearningPath[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadLearningPaths();
  }

  loadLearningPaths(): void {
    // --- SIMULACIÓN DE DATOS ---
    this.learningPaths = [
      {
        id: 1,
        title: 'Dominio de Microservicios con Go',
        goal: 'Ser capaz de diseñar, construir y desplegar sistemas de microservicios robustos y escalables utilizando Go.',
        stages: [
          { 
            id: 101, title: 'Fundamentos de Go', status: 'Completado',
            description: 'Aprender la sintaxis, concurrencia (goroutines, channels) y herramientas estándar de Go.',
            resources: [
              { id: 1011, title: 'Go Tour', type: 'Curso', url: 'https://go.dev/tour/' },
              { id: 1012, title: 'The Go Programming Language', type: 'Libro' }
            ]
          },
          { 
            id: 102, title: 'Patrones de Diseño de Microservicios', status: 'En Progreso',
            description: 'Estudiar patrones como Service Discovery, Circuit Breaker, y API Gateway.',
            resources: [
              { id: 1021, title: 'Microservices.io by Chris Richardson', type: 'Artículo', url: 'https://microservices.io/' },
              { id: 1022, title: 'Building Microservices: Designing Fine-Grained Systems', type: 'Libro' }
            ]
          },
          { 
            id: 103, title: 'Contenerización con Docker y Kubernetes', status: 'Pendiente',
            description: 'Aprender a empaquetar los servicios en contenedores y orquestarlos.',
            resources: [
              { id: 1031, title: 'Curso de Docker & Kubernetes en Udemy', type: 'Curso' }
            ]
          },
          { 
            id: 104, title: 'Proyecto Práctico', status: 'Pendiente',
            description: 'Construir una aplicación de e-commerce simple usando microservicios.',
            resources: [
              { id: 1041, title: 'Definir la arquitectura del proyecto', type: 'Proyecto' }
            ]
          }
        ]
      }
    ];
  }

  // --- Helpers para la plantilla ---
  getStatusClass(status: LearningStage['status']): string {
    switch(status) {
      case 'Completado': return 'border-green-500 bg-green-500';
      case 'En Progreso': return 'border-blue-500 bg-blue-500';
      case 'Pendiente': return 'border-gray-300 bg-gray-300';
    }
  }

  getResourceIcon(type: LearningResource['type']): string {
    switch(type) {
      case 'Curso': return 'fas fa-graduation-cap';
      case 'Libro': return 'fas fa-book';
      case 'Artículo': return 'fas fa-newspaper';
      case 'Proyecto': return 'fas fa-code-branch';
    }
  }
}