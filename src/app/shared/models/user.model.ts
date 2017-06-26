export interface User {
  id: number;
  name: string;
  surname: string;
  address: string;
  city: string;
  country: string;
  postal: string;
  phone: string;
  email: string;
}

export function fillEmployee(): User {
  return {
    id: 0,
    name: '',
    surname: '',
    address: '',
    city: '',
    country: '',
    postal: '',
    phone: '',
    email: '',
  };
}


export interface UserPredicateObject {
  cardGroupCode?: string;
  cln?: string;
  email?: string;
  firstName?: string;
  issuerCode?: string;
  langKey?: string;
  lastName?: string;
  login?: string;
  merchantCode?: string;
  networkCode?: string;
  orgUnitCode?: string;
  terminalCode?: string;
}
