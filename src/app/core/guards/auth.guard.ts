import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const routerFixture = inject(Router);
  
  const token = localStorage.getItem('token'); // Obtener el token desde el almacenamiento local
  const isAuthenticated = !!token; // Verificar si el token existe
  
  if (state.url === '/register' && isAuthenticated) {
    routerFixture.navigate(['/']); // Redirigir a la página principal u otra página si está autenticado
    return false;
  }

  // Si no está autenticado y no es la ruta de registro, redirigir al login
  if (!isAuthenticated && state.url !== '/register') {
    routerFixture.navigate(['/login']);
    return false;
  }

  return true;
};
