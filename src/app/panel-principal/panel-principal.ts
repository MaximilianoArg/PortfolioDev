import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraLateral } from "../barra-lateral/barra-lateral";

@Component({
  selector: 'app-panel-principal',
  standalone: true,
  imports: [CommonModule, BarraLateral, RouterOutlet],
  templateUrl: './panel-principal.html',
  styleUrl: './panel-principal.scss',
})

export class PanelPrincipal {
  estaColapsado = false;
  constructor() {}
  
  ngOnInit(){}

  alHacerClick() {
    this.estaColapsado = !this.estaColapsado;
  }
}
