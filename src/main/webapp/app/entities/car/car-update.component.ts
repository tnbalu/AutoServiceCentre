import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ICar, Car } from 'app/shared/model/car.model';
import { CarService } from './car.service';
import { IContact } from 'app/shared/model/contact.model';
import { ContactService } from 'app/entities/contact/contact.service';

@Component({
  selector: 'jhi-car-update',
  templateUrl: './car-update.component.html',
})
export class CarUpdateComponent implements OnInit {
  isSaving = false;
  contacts: IContact[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    company: [],
    modal: [null, [Validators.required]],
    make: [],
    enteredTime: [],
    leftTime: [],
    contact: [],
  });

  constructor(
    protected carService: CarService,
    protected contactService: ContactService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ car }) => {
      if (!car.id) {
        const today = moment().startOf('day');
        car.enteredTime = today;
        car.leftTime = today;
      }

      this.updateForm(car);

      this.contactService
        .query({ filter: 'car-is-null' })
        .pipe(
          map((res: HttpResponse<IContact[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IContact[]) => {
          if (!car.contact || !car.contact.id) {
            this.contacts = resBody;
          } else {
            this.contactService
              .find(car.contact.id)
              .pipe(
                map((subRes: HttpResponse<IContact>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IContact[]) => (this.contacts = concatRes));
          }
        });
    });
  }

  updateForm(car: ICar): void {
    this.editForm.patchValue({
      id: car.id,
      name: car.name,
      company: car.company,
      modal: car.modal,
      make: car.make,
      enteredTime: car.enteredTime ? car.enteredTime.format(DATE_TIME_FORMAT) : null,
      leftTime: car.leftTime ? car.leftTime.format(DATE_TIME_FORMAT) : null,
      contact: car.contact,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const car = this.createFromForm();
    if (car.id !== undefined) {
      this.subscribeToSaveResponse(this.carService.update(car));
    } else {
      this.subscribeToSaveResponse(this.carService.create(car));
    }
  }

  private createFromForm(): ICar {
    return {
      ...new Car(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      company: this.editForm.get(['company'])!.value,
      modal: this.editForm.get(['modal'])!.value,
      make: this.editForm.get(['make'])!.value,
      enteredTime: this.editForm.get(['enteredTime'])!.value
        ? moment(this.editForm.get(['enteredTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      leftTime: this.editForm.get(['leftTime'])!.value ? moment(this.editForm.get(['leftTime'])!.value, DATE_TIME_FORMAT) : undefined,
      contact: this.editForm.get(['contact'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICar>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IContact): any {
    return item.id;
  }
}
