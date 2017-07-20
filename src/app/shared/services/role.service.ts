import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../models/app-state.model';
import { ProfileModel } from '../models/profile.model';
import { StateModel } from '../models/state.model';

const RESOURCE_ROLES = ['ROLE_RESOURCE_READ', 'ROLE_RESOURCE_CREATE', 'ROLE_RESOURCE_EDIT'];

@Injectable()
export class RoleService {

  constructor(private configService: AppConfigService, private store: Store<AppStateModel>) {
  }

  isVisible(key: string): Observable<boolean> {
    return Observable.combineLatest(
      this.store.select('profile')
        .filter((state: StateModel<ProfileModel>) => state.data != null)
        .map((state: StateModel<ProfileModel>) => state.data)
        .take(1),
      this.configService.get('roles')
    ).map(
      (([profile, roles]: [ProfileModel, any]) => {
        const [scope, privilege] = key.split('.');
        const authortities = profile.roles
          .map(role => {
            const resourceRoles = RESOURCE_ROLES
              .filter(resourceRole => role.authorities.indexOf(resourceRole) > -1)
              .map(resRole => `${role.resource}_${resRole}`);
            return [...role.authorities, ...resourceRoles];
          })
          .reduce((acc, current) => [...current, ...acc], [])
          .filter((authority, index, array) => array.indexOf(authority) === index);
        return roles[scope][privilege].some(role => authortities.some(authority => authority === role));
      })
    );
  }
}
