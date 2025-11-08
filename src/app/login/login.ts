import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Form } from '@angular/forms';
import { Autenticacion } from '../servicio/autenticacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class ComponenteLogueo implements OnInit {
  
  usuario: string = "";
  contra: string = "";
  datosFormulario!: FormGroup;
  
  constructor(private servicioAutenticacion: Autenticacion, private ruteo: Router) {}

  ngOnInit(): void {
    this.datosFormulario = new FormGroup(
      {
        usuario: new FormControl("admin"),
        contra: new FormControl("admin"),
      }
    )
  }

  onClickSubmit(datos: any)
  {
    this.usuario = datos.usuario;
    this.contra = datos.contra;
    //
    console.log("Pagina login: " + this.usuario);
    console.log("Pagina login: " + this.contra);

    this.servicioAutenticacion.loguear(this.usuario, this.contra)
    .subscribe( datos => {
      console.log("El logueo fue exitoso: " + datos);
      if(datos) this.ruteo.navigate(['']);
    });
  }
}
