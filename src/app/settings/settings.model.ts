export interface User {
  firstName: string;
  surname: string;
  id: number;
  email: string;
  phone: number;
}

export function fillUser(): User {
  return {
    'firstName': '',
    'surname': '',
    'id': null,
    'email': '',
    'phone': null
  };
}
