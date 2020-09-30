import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { AmsTestModule } from '../../../test.module';
import { CaseeUpdateComponent } from 'app/entities/casee/casee-update.component';
import { CaseeService } from 'app/entities/casee/casee.service';
import { Casee } from 'app/shared/model/casee.model';

describe('Component Tests', () => {
  describe('Casee Management Update Component', () => {
    let comp: CaseeUpdateComponent;
    let fixture: ComponentFixture<CaseeUpdateComponent>;
    let service: CaseeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AmsTestModule],
        declarations: [CaseeUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(CaseeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CaseeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CaseeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Casee(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Casee();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
