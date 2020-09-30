import { Moment } from 'moment';
import { IEmployee } from 'app/shared/model/employee.model';
import { CaseType } from 'app/shared/model/enumerations/case-type.model';

export interface ICasee {
  id?: number;
  name?: string;
  createdOn?: Moment;
  caseType?: CaseType;
  employee?: IEmployee;
}

export class Casee implements ICasee {
  constructor(
    public id?: number,
    public name?: string,
    public createdOn?: Moment,
    public caseType?: CaseType,
    public employee?: IEmployee
  ) {}
}
