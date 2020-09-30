import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AmsSharedModule } from 'app/shared/shared.module';
import { CarComponent } from './car.component';
import { CarDetailComponent } from './car-detail.component';
import { CarUpdateComponent } from './car-update.component';
import { CarDeleteDialogComponent } from './car-delete-dialog.component';
import { carRoute } from './car.route';

@NgModule({
  imports: [AmsSharedModule, RouterModule.forChild(carRoute)],
  declarations: [CarComponent, CarDetailComponent, CarUpdateComponent, CarDeleteDialogComponent],
  entryComponents: [CarDeleteDialogComponent],
})
export class AmsCarModule {}
