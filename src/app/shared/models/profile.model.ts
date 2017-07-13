export interface ProfileModel {
  blocked: boolean;
  cardGroupCode: string;
  city: string;
  email: string;
  expiredDateForWarning: string; // yyyy-MM-dd'T'HH:mm:ss
  firstLogon: boolean;
  firstName: string;
  id: number;
  issuerCode: string;
  langKey: string;
  lastName: string;
  login: string;
  merchantCode: string;
  networkCode: string;
  orgUnitCode: string;
  password: string;
  passwordExpired: boolean;
  passwordLength: number;
  phone: string;
  resource: 'SYSTEM' | null;
  resourceAcquirer: 'SYSTEM' | null;
  resourceAcquirerId: string;
  resourceId: string;
  roles: {
    authorities: string[];
    resource: 'SYSTEM' | null;
    resourceId: string
  }[];
  street: string;
  system: string;
  zip: string;
}
