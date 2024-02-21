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
    path: 'services',
    canActivate: [AuthGuard],
    loadChildren: () => import('./services/services.module').then((m) => m.ServicesModule),
  },
  {
    path: 'programs',
    canActivate: [AuthGuard],
    loadChildren: () => import('./programs/programs.module').then((m) => m.ProgramsModule),
  },
  {
    path: 'approvals',
    canActivate: [AuthGuard],
    loadChildren: () => import('./requestforapproval/requestforapproval.module').then((m) => m.RequestforapprovalModule),
  },
  {
    path: 'contracts',
    canActivate: [AuthGuard],
    loadChildren: () => import('./contracts/contracts.module').then((m) => m.ContractsModule),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
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
