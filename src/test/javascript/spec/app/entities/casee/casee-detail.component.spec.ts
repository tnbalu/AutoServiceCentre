import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AmsTestModule } from '../../../test.module';
import { CaseeDetailComponent } from 'app/entities/casee/casee-detail.component';
import { Casee } from 'app/shared/model/casee.model';

describe('Component Tests', () => {
  describe('Casee Management Detail Component', () => {
    let comp: CaseeDetailComponent;
    let fixture: ComponentFixture<CaseeDetailComponent>;
    const route = ({ data: of({ casee: new Casee(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AmsTestModule],
        declarations: [CaseeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(CaseeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CaseeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load casee on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.casee).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
