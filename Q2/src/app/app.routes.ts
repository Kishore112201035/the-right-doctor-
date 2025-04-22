import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'person',
    pathMatch: 'full'
  },
  {
    path: 'person',
    loadComponent: () => import('./features/person/pages/person-list/person-list.component').then(c => c.PersonListComponent)
  },
  {
    path: 'person/new',
    loadComponent: () => import('./features/person/pages/person-form/person-form.component').then(c => c.PersonFormComponent)
  },
  {
    path: 'person/edit/:id',
    loadComponent: () => import('./features/person/pages/person-form/person-form.component').then(c => c.PersonFormComponent)
  },
  {
    path: 'person/delete/:id',
    loadComponent: () => import('./features/person/pages/person-delete/person-delete.component').then(c => c.PersonDeleteComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./shared/pages/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];