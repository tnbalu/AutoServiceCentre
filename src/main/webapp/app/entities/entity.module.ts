import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'car',
        loadChildren: () => import('./car/car.module').then(m => m.AmsCarModule),
      },
      {
        path: 'contact',
        loadChildren: () => import('./contact/contact.module').then(m => m.AmsContactModule),
      },
      {
        path: 'employee',
        loadChildren: () => import('./employee/employee.module').then(m => m.AmsEmployeeModule),
      },
      {
        path: 'casee',
        loadChildren: () => import('./casee/casee.module').then(m => m.AmsCaseeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class AmsEntityModule {}
