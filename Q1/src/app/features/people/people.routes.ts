import { Routes } from '@angular/router';
import { PeopleListComponent } from './people-list/people-list.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { PersonDeleteComponent } from './person-delete/person-delete.component';

export const PEOPLE_ROUTES: Routes = [
  {
    path: '',
    component: PeopleListComponent
  },
  {
    path: 'new',
    component: PersonEditComponent
  },
  {
    path: ':id/edit',
    component: PersonEditComponent
  },
  {
    path: ':id/delete',
    component: PersonDeleteComponent
  }
];