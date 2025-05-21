import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/403']);
      return false;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      const tipoUsuario = payload.tipo;

      const tiposPermitidos: number[] = route.data['tiposPermitidos'];

      if (!tiposPermitidos || tiposPermitidos.includes(tipoUsuario)) {
        return true;
      }

      // Se tipo não permitido
      this.router.navigate(['/403']);
      return false;
    } catch (error) {
      this.router.navigate(['/403']);
      return false;
    }
  }
}