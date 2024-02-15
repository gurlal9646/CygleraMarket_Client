import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

const Routing: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    loadChildren: () => import('./products/products.module').then((m) => m.ProductsModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
