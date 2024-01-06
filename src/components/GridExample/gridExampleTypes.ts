export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: IUserAddress;
  phone: string;
  website: string;
  company: IUserCompany;
}

export interface IUserAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: { lat: number; lng: number };
}

export interface IUserCompany {
  name: string;
  catchPhrase: string;
  bs: string;
}

export const UserDataKeys = {
  id: 'id',
  name: 'name',
  username: 'username',
  email: 'email',
  address: 'address',
  phone: 'phone',
  website: 'website',
  company: 'company',
  street: 'street',
  suite: 'suite',
  city: 'city',
  zipcode: 'zipcode',
  geo: 'geo',
} as const;
