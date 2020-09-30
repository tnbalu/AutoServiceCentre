import { Moment } from 'moment';
import { IContact } from 'app/shared/model/contact.model';

export interface ICar {
  id?: number;
  name?: string;
  company?: string;
  modal?: string;
  make?: string;
  enteredTime?: Moment;
  leftTime?: Moment;
  contact?: IContact;
}

export class Car implements ICar {
  constructor(
    public id?: number,
    public name?: string,
    public company?: string,
    public modal?: string,
    public make?: string,
    public enteredTime?: Moment,
    public leftTime?: Moment,
    public contact?: IContact
  ) {}
}
