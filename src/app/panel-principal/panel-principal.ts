import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraLateral } from "../barra-lateral/barra-lateral";
import { Autenticacion } from '../servicio/autenticacion';
import { UserProfile } from '../servicio/auth.interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-panel-principal',
  standalone: true,
  imports: [CommonModule, BarraLateral, RouterOutlet],
  templateUrl: './panel-principal.html',
  styleUrl: './panel-principal.scss',
})

export class PanelPrincipal {
  estaColapsado = false;
  private servicioAutenticacion = inject(Autenticacion);
  public currentUser$: Observable<UserProfile | null> = this.servicioAutenticacion.currentUser$;
  constructor() {}
  
  ngOnInit(){}

  alHacerClick() {
    this.estaColapsado = !this.estaColapsado;
  }
}
