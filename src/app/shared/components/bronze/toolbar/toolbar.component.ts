import { Component, Input } from '@angular/core';
import { AccountModel } from '../../../models/account.model';
import { LanguageService } from '../../../language/language.service';

export type ToolbarPosition = 'side' | 'top';

interface ToolbarItem {
  path: string;
  label?: string;
  icon: string;
}

const TOOLBAR_ITEMS: ToolbarItem[] = [
  {path: 'dashboard', icon: 'dashboard'},
  {path: 'card', icon: 'credit_card'},
  {path: 'settings', icon: 'settings'},
  {path: 'employees', icon: 'group'},
  {path: 'employer-card', icon: 'markunread_mailbox'},
  {path: 'card-groups', icon: 'markunread_mailbox'},
  {path: 'issuers', icon: 'card_giftcard'},
  {path: 'card-request', icon: 'markunread_mailbox'},
  {path: 'routing-table', icon: 'view_list'},
  {path: 'merchants', icon: 'monetization_on'}, {path: 'org-units', icon: 'place'},
  {path: 'sequences', icon: 'timeline'},
  {path: 'terminal', icon: 'local_atm'},
  {path: 'campaigns', icon: 'dns'},
  {path: 'showcase', icon: 'view_list'},
  {path: 'templates', icon: 'insert_drive_file'},
];

@Component({
  selector: 'mss-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  readonly toolbarItems = TOOLBAR_ITEMS.map(item => ({...item, path: `/platform/${item.path}`}));
  @Input() position: ToolbarPosition = 'top';
  @Input() userData: AccountModel;

  constructor(private language: LanguageService) {
    this.toolbarItems = TOOLBAR_ITEMS.map(item => ({
      ...item, label: this.language.translate(`menu.${item.path}`), path: `/platform/${item.path}`
    }));
  }
}
