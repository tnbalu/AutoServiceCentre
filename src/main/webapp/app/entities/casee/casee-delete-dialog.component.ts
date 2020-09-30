import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICasee } from 'app/shared/model/casee.model';
import { CaseeService } from './casee.service';

@Component({
  templateUrl: './casee-delete-dialog.component.html',
})
export class CaseeDeleteDialogComponent {
  casee?: ICasee;

  constructor(protected caseeService: CaseeService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.caseeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('caseeListModification');
      this.activeModal.close();
    });
  }
}
