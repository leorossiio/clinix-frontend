// import { inject } from '@angular/core';
// import { HttpInterceptorFn } from '@angular/common/http';
// import { AuthService } from '../../features/auth/services/auth.service';

// export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);
//   const token = authService.obterToken();

//   const reqClone = req.clone({
//     setHeaders: {
//       Authorization: `Bearer ${token}`
//     }
//   });

//   return next(reqClone);
// };