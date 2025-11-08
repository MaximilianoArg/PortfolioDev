import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree  } from '@angular/router';
import { Autenticacion } from './servicio/autenticacion';

@Injectable({
  providedIn: 'root'
})

export class GuardiaAutenticacion implements CanActivate {

   constructor(private servicioAutenticacion: Autenticacion, private router: Router) {}

   canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean | UrlTree {
      let url: string = state.url;
      return this.checkLogin(url);
   }

   checkLogin(url: string): true | UrlTree {
      console.log("Url: " + url);
      if (typeof window !== 'undefined' && window.sessionStorage) {
        let val = sessionStorage.getItem('estaLogueado');
        if (val === "true" && val != null) {
           if (url === "/login") {
              return this.router.parseUrl('/panel-principal');
           } else {
              return true;
           }
        } else {
           return this.router.parseUrl('/login');
        }
      }
      return this.router.parseUrl('/login');
   }
}
