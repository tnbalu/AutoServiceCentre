import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICasee } from 'app/shared/model/casee.model';

type EntityResponseType = HttpResponse<ICasee>;
type EntityArrayResponseType = HttpResponse<ICasee[]>;

@Injectable({ providedIn: 'root' })
export class CaseeService {
  public resourceUrl = SERVER_API_URL + 'api/casees';

  constructor(protected http: HttpClient) {}

  create(casee: ICasee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(casee);
    return this.http
      .post<ICasee>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(casee: ICasee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(casee);
    return this.http
      .put<ICasee>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICasee>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICasee[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(casee: ICasee): ICasee {
    const copy: ICasee = Object.assign({}, casee, {
      createdOn: casee.createdOn && casee.createdOn.isValid() ? casee.createdOn.format(DATE_FORMAT) : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdOn = res.body.createdOn ? moment(res.body.createdOn) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((casee: ICasee) => {
        casee.createdOn = casee.createdOn ? moment(casee.createdOn) : undefined;
      });
    }
    return res;
  }
}
