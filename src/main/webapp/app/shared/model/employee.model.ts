import { ICasee } from 'app/shared/model/casee.model';

export interface IEmployee {
  id?: number;
  firstName?: string;
  lastName?: string;
  role?: string;
  casees?: ICasee[];
}

export class Employee implements IEmployee {
  constructor(public id?: number, public firstName?: string, public lastName?: string, public role?: string, public casees?: ICasee[]) {}
}
