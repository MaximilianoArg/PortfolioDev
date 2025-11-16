import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Autenticacion } from './servicio/autenticacion';
import { map, take } from 'rxjs/operators';

export const GuardiaAutenticacion: CanActivateFn = (route, state) => {
  
  const servicioAutenticacion = inject(Autenticacion);
  const ruteo = inject(Router);

  return servicioAutenticacion.estaLogueado$.pipe(
    take(1),
    map(estaLogueado => {
      if (estaLogueado) {
        return true;
      }
      return ruteo.createUrlTree(['/login']);
    })
  );
};