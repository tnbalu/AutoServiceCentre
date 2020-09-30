import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AmsSharedModule } from 'app/shared/shared.module';
import { CaseeComponent } from './casee.component';
import { CaseeDetailComponent } from './casee-detail.component';
import { CaseeUpdateComponent } from './casee-update.component';
import { CaseeDeleteDialogComponent } from './casee-delete-dialog.component';
import { caseeRoute } from './casee.route';

@NgModule({
  imports: [AmsSharedModule, RouterModule.forChild(caseeRoute)],
  declarations: [CaseeComponent, CaseeDetailComponent, CaseeUpdateComponent, CaseeDeleteDialogComponent],
  entryComponents: [CaseeDeleteDialogComponent],
})
export class AmsCaseeModule {}
