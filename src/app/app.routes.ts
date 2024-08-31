import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MenuComponent } from './features/menu/menu.component';

export const routes: Routes = [
    { 
        path: '', 
        component: MenuComponent,
        canActivate: [authGuard],
        children: [
          { path: 'carousel', loadChildren: () => import('./features/breed-carousel/breed-carousel.module').then(m => m.BreedCarouselModule) },
          { path: 'table', loadChildren: () => import('./features/breed-table/breed-table.module').then(m => m.BreedTableModule) },
          { path: 'user-info', loadChildren: () => import('./features/protected/protected.module').then(m => m.ProtectedModule), canActivate: [authGuard] },
        ]
      },
      { path: 'login', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
      { path: '**', redirectTo: '' }
];
