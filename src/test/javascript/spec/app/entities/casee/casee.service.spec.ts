import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { CaseeService } from 'app/entities/casee/casee.service';
import { ICasee, Casee } from 'app/shared/model/casee.model';
import { CaseType } from 'app/shared/model/enumerations/case-type.model';

describe('Service Tests', () => {
  describe('Casee Service', () => {
    let injector: TestBed;
    let service: CaseeService;
    let httpMock: HttpTestingController;
    let elemDefault: ICasee;
    let expectedResult: ICasee | ICasee[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(CaseeService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Casee(0, 'AAAAAAA', currentDate, CaseType.INQUIREY);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            createdOn: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Casee', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            createdOn: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdOn: currentDate,
          },
          returnedFromService
        );

        service.create(new Casee()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Casee', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            createdOn: currentDate.format(DATE_FORMAT),
            caseType: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdOn: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Casee', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            createdOn: currentDate.format(DATE_FORMAT),
            caseType: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdOn: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Casee', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
