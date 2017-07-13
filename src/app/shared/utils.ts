import { Response, ResponseOptions } from '@angular/http';
import { Subject } from 'rxjs';

export class UnsubscribeSubject extends Subject<void> {
  fire(): void {
    super.next();
    super.complete();
  }
}

export class MissingTokenResponse extends Response {
  constructor() {
    super(new ResponseOptions({status: 401, statusText: 'Missing token; request aborted'}));
  }
}

export function parseResponse(response: Response): any {
  try {
    return response.json();
  } catch (error) {
    return response.text();
  }
}
