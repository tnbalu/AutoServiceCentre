export interface IContact {
  id?: number;
  firstName?: string;
  lastName?: string;
  company?: string;
}

export class Contact implements IContact {
  constructor(public id?: number, public firstName?: string, public lastName?: string, public company?: string) {}
}
