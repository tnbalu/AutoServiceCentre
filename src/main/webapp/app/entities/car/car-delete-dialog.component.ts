import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICar } from 'app/shared/model/car.model';
import { CarService } from './car.service';

@Component({
  templateUrl: './car-delete-dialog.component.html',
})
export class CarDeleteDialogComponent {
  car?: ICar;

  constructor(protected carService: CarService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.carService.delete(id).subscribe(() => {
      this.eventManager.broadcast('carListModification');
      this.activeModal.close();
    });
  }
}
