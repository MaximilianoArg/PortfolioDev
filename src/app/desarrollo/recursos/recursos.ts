import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- Interface para un Recurso ---
interface DevResource {
  id: number;
  title: string;
  description: string;
  category: string;
  url: string;
  icon: string; // Clase de Font Awesome
}

@Component({
  selector: 'app-recursos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './recursos.html',
  styleUrls: ['./recursos.scss']
})
export class RecursosComponente implements OnInit {

  // --- Propiedades de estado ---
  allResources: DevResource[] = [];
  filteredResources: DevResource[] = [];
  availableCategories: string[] = [];
  
  selectedCategory: string = 'Todos';

  constructor() { }

  ngOnInit(): void {
    this.loadResources();
    this.extractCategories();
    this.filterResources(); // Aplicar el filtro inicial
  }

  loadResources(): void {
    // --- SIMULACIÓN DE DATOS ---
    this.allResources = [
      { id: 1, title: 'MDN Web Docs', description: 'La fuente de verdad para la documentación web estándar (HTML, CSS, JS).', category: 'Documentación', url: 'https://developer.mozilla.org/', icon: 'fas fa-book' },
      { id: 2, title: 'Dev.to', description: 'Una comunidad de desarrolladores con artículos y tutoriales prácticos.', category: 'Comunidad', url: 'https://dev.to/', icon: 'fas fa-users' },
      { id: 3, title: 'Can I use...', description: 'Tablas de compatibilidad para tecnologías web front-end.', category: 'Herramientas', url: 'https://caniuse.com/', icon: 'fas fa-check-double' },
      { id: 4, title: 'Stack Overflow', description: 'La comunidad de preguntas y respuestas más grande para programadores.', category: 'Comunidad', url: 'https://stackoverflow.com/', icon: 'fab fa-stack-overflow' },
      { id: 5, title: 'Tailwind CSS Docs', description: 'Documentación oficial y completa del framework CSS.', category: 'Documentación', url: 'https://tailwindcss.com/docs', icon: 'fas fa-palette' },
      { id: 6, title: 'Figma', description: 'Herramienta de diseño de interfaces colaborativa basada en la web.', category: 'Diseño', url: 'https://www.figma.com/', icon: 'fab fa-figma' },
      { id: 7, title: 'Excalidraw', description: 'Pizarra virtual para dibujar diagramas de arquitectura con un estilo hecho a mano.', category: 'Herramientas', url: 'https://excalidraw.com/', icon: 'fas fa-pencil-ruler' },
      { id: 8, title: 'Smashing Magazine', description: 'Revista en línea para diseñadores y desarrolladores web con artículos de alta calidad.', category: 'Artículos', url: 'https://www.smashingmagazine.com/', icon: 'fas fa-newspaper' },
    ];
  }

  // Extrae las categorías únicas del arreglo de recursos
  extractCategories(): void {
    const categories = new Set(this.allResources.map(res => res.category));
    this.availableCategories = ['Todos', ...Array.from(categories)];
  }

  // Filtra los recursos basándose en la categoría seleccionada
  filterResources(): void {
    if (this.selectedCategory === 'Todos') {
      this.filteredResources = this.allResources;
    } else {
      this.filteredResources = this.allResources.filter(res => res.category === this.selectedCategory);
    }
  }

  // Se llama cuando el usuario cambia el valor del <select>
  onCategoryChange(): void {
    this.filterResources();
  }
}