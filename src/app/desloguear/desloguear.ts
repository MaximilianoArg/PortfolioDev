import { Component, OnInit } from '@angular/core';
import { Autenticacion } from '../servicio/autenticacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-desloguear',
  standalone: true,
  imports: [],
  templateUrl: './desloguear.html',
  styleUrl: './desloguear.scss',
})
export class Desloguear implements OnInit {

  constructor(private servicioAutenticacion: Autenticacion, private router: Router) {}

  ngOnInit(): void {
    this.servicioAutenticacion.desloguear();
    this.router.navigate(['/']);
  }

}
