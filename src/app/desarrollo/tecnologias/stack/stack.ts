import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Interfaces para una estructura clara ---
type ProficiencyLevel = 'Experto' | 'Avanzado' | 'Intermedio';

interface Technology {
  name: string;
  icon: string; // Clases de Font Awesome (o Devicon)
  category: string;
  proficiency: ProficiencyLevel;
}

@Component({
  selector: 'app-stack',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './stack.html',
  styleUrls: ['./stack.scss']
})
export class StackComponente implements OnInit {

  // Almacenamos todas las tecnologías en un solo arreglo
  allTechnologies: Technology[] = [];
  
  // Usamos un Map para agruparlas. La clave será la categoría (ej. 'Frontend')
  // y el valor será un arreglo de tecnologías de esa categoría.
  groupedStack = new Map<string, Technology[]>();

  constructor() { }

  ngOnInit(): void {
    this.loadStack();
    this.groupTechnologies();
  }

  loadStack(): void {
    // --- SIMULACIÓN DE DATOS ---
    // En una app real, esto vendría de un servicio o un archivo de configuración.
    this.allTechnologies = [
      // Frontend
      { name: 'Angular', icon: 'fab fa-angular', category: 'Frontend', proficiency: 'Experto' },
      { name: 'TypeScript', icon: 'fas fa-code', category: 'Frontend', proficiency: 'Experto' },
      { name: 'Tailwind CSS', icon: 'fas fa-palette', category: 'Frontend', proficiency: 'Avanzado' },
      { name: 'RxJS', icon: 'fas fa-atom', category: 'Frontend', proficiency: 'Intermedio' },
      // Backend
      { name: 'Node.js', icon: 'fab fa-node-js', category: 'Backend', proficiency: 'Avanzado' },
      { name: 'Django', icon: 'fab fa-python', category: 'Backend', proficiency: 'Intermedio' },
      { name: 'REST APIs', icon: 'fas fa-cogs', category: 'Backend', proficiency: 'Experto' },
      // Bases de Datos
      { name: 'PostgreSQL', icon: 'fas fa-database', category: 'Bases de Datos', proficiency: 'Avanzado' },
      { name: 'MongoDB', icon: 'fas fa-leaf', category: 'Bases de Datos', proficiency: 'Intermedio' },
      // DevOps & Herramientas
      { name: 'Docker', icon: 'fab fa-docker', category: 'DevOps & Herramientas', proficiency: 'Avanzado' },
      { name: 'Git', icon: 'fab fa-git-alt', category: 'DevOps & Herramientas', proficiency: 'Experto' },
      { name: 'NGINX', icon: 'fas fa-server', category: 'DevOps & Herramientas', proficiency: 'Intermedio' },
    ];
  }
  
  // Agrupa las tecnologías del arreglo `allTechnologies` en el Map `groupedStack`
  groupTechnologies(): void {
    for (const tech of this.allTechnologies) {
      if (!this.groupedStack.has(tech.category)) {
        this.groupedStack.set(tech.category, []);
      }
      this.groupedStack.get(tech.category)!.push(tech);
    }
  }

  // --- Helper para la plantilla ---
  // Devuelve las clases de Tailwind para el color de la "píldora" de dominio
  getProficiencyClass(proficiency: ProficiencyLevel): string {
    switch (proficiency) {
      case 'Experto': return 'bg-green-100 text-green-800';
      case 'Avanzado': return 'bg-blue-100 text-blue-800';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
    }
  }
}