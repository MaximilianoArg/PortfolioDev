import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BarraLateral } from "../barra-lateral/barra-lateral";

@Component({
  selector: 'app-panel-principal',
  standalone: true,
  imports: [CommonModule, BarraLateral],
  templateUrl: './panel-principal.html',
  styleUrl: './panel-principal.scss',
})

export class PanelPrincipal {
  estaColapsado = false;
  // Constructor por defecto
  constructor() {}
  ngOnInit()
  {
    // Aqui hiria algo por ejemplo.
    // Proyectos recientes.
    // Por hacer
    // Cantidades...
    // a definir.
  }

  // Funciones extras.
  alHacerClick() {
    this.estaColapsado = !this.estaColapsado;
  }
}
