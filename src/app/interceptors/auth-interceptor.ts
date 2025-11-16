import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Autenticacion } from '../servicio/autenticacion'; // Asegúrate de que la ruta sea correcta

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos el servicio de autenticación
  const authService = inject(Autenticacion);
  
  // Obtenemos el token de acceso
  const authToken = authService.getAccessToken();

  // Si el token existe, clonamos la petición y le añadimos la cabecera
  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    // Enviamos la petición clonada con la cabecera
    return next(authReq);
  }

  // Si no hay token, enviamos la petición original sin modificar
  return next(req);
};