import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/people', 
    pathMatch: 'full' 
  },
  {
    path: 'people',
    loadChildren: () => import('./features/people/people.routes').then(m => m.PEOPLE_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/people'
  }
];