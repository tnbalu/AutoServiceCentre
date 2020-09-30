import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ICasee, Casee } from 'app/shared/model/casee.model';
import { CaseeService } from './casee.service';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee/employee.service';

@Component({
  selector: 'jhi-casee-update',
  templateUrl: './casee-update.component.html',
})
export class CaseeUpdateComponent implements OnInit {
  isSaving = false;
  employees: IEmployee[] = [];
  createdOnDp: any;

  editForm = this.fb.group({
    id: [],
    name: [],
    createdOn: [],
    caseType: [],
    employee: [],
  });

  constructor(
    protected caseeService: CaseeService,
    protected employeeService: EmployeeService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ casee }) => {
      this.updateForm(casee);

      this.employeeService.query().subscribe((res: HttpResponse<IEmployee[]>) => (this.employees = res.body || []));
    });
  }

  updateForm(casee: ICasee): void {
    this.editForm.patchValue({
      id: casee.id,
      name: casee.name,
      createdOn: casee.createdOn,
      caseType: casee.caseType,
      employee: casee.employee,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const casee = this.createFromForm();
    if (casee.id !== undefined) {
      this.subscribeToSaveResponse(this.caseeService.update(casee));
    } else {
      this.subscribeToSaveResponse(this.caseeService.create(casee));
    }
  }

  private createFromForm(): ICasee {
    return {
      ...new Casee(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      createdOn: this.editForm.get(['createdOn'])!.value,
      caseType: this.editForm.get(['caseType'])!.value,
      employee: this.editForm.get(['employee'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICasee>>): void {
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

  trackById(index: number, item: IEmployee): any {
    return item.id;
  }
}
