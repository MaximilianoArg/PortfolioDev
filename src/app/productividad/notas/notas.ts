import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown'; // <-- 1. Importa el módulo de Markdown

// --- Interface para una nota ---
export interface Note {
  id: number;
  title: string;
  content: string; // El contenido se guardará como Markdown
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // <-- 2. Importa FormsModule
    MarkdownModule // <-- 3. Importa MarkdownModule
  ],
  templateUrl: './notas.html',
  styleUrls: ['./notas.scss']
})
export class NotasComponente implements OnInit {

  // --- Propiedades de estado ---
  allNotes: Note[] = [];
  filteredNotes: Note[] = [];
  selectedNote: Note | null = null;
  
  isEditing = false;
  searchTerm = '';

  // Propiedades para la edición
  editedTitle = '';
  editedContent = '';

  constructor() { }

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    // --- SIMULACIÓN DE LLAMADA A UN SERVICIO ---
    this.allNotes = [
      { id: 1, title: 'Configuración de Nginx', content: '```nginx\nserver {\n  listen 80;\n  server_name example.com;\n  root /var/www/html;\n}\n```', createdAt: new Date('2025-11-01'), updatedAt: new Date('2025-11-09') },
      { id: 2, title: 'Ideas para Proyecto X', content: '# Lista de Tareas\n- [x] Definir la arquitectura\n- [ ] Crear los componentes base\n- [ ] Configurar el backend', createdAt: new Date('2025-11-05'), updatedAt: new Date('2025-11-08') },
      { id: 3, title: 'Comandos útiles de Git', content: '`git fetch --prune` - Limpia las ramas locales que ya no existen en el remoto.', createdAt: new Date('2025-10-20'), updatedAt: new Date('2025-10-20') },
    ];
    this.filterNotes();
    // Seleccionamos la primera nota por defecto
    if (this.filteredNotes.length > 0) {
      this.selectNote(this.filteredNotes[0]);
    }
  }
  
  filterNotes(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredNotes = this.allNotes
      .filter(note => note.title.toLowerCase().includes(term) || note.content.toLowerCase().includes(term))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()); // Más recientes primero
  }

  selectNote(note: Note): void {
    this.selectedNote = note;
    this.isEditing = false; // Siempre salimos del modo edición al cambiar de nota
  }

  enterEditMode(): void {
    if (!this.selectedNote) return;
    this.editedTitle = this.selectedNote.title;
    this.editedContent = this.selectedNote.content;
    this.isEditing = true;
  }

  saveNote(): void {
    if (!this.selectedNote) return;

    // Aquí llamarías a tu servicio para guardar en el backend
    // this.noteService.update({ ...this.selectedNote, title: this.editedTitle, content: this.editedContent })...
    
    // Simulación de guardado
    this.selectedNote.title = this.editedTitle;
    this.selectedNote.content = this.editedContent;
    this.selectedNote.updatedAt = new Date();
    
    this.isEditing = false;
    this.filterNotes(); // Re-ordenamos por si la fecha de actualización cambió
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  createNewNote(): void {
    const newNote: Note = {
      id: Date.now(), // ID simple para el ejemplo
      title: 'Nueva Nota',
      content: 'Empieza a escribir aquí...',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.allNotes.unshift(newNote); // Añadimos al principio
    this.filterNotes();
    this.selectNote(newNote);
    this.enterEditMode(); // Entramos directamente a editar la nueva nota
  }

  deleteNote(): void {
    if (!this.selectedNote) return;

    // Lógica para eliminar del backend
    this.allNotes = this.allNotes.filter(n => n.id !== this.selectedNote!.id);
    this.filterNotes();

    // Seleccionamos la siguiente nota o ninguna si no quedan
    this.selectedNote = this.filteredNotes.length > 0 ? this.filteredNotes[0] : null;
  }
}