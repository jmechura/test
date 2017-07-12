import { Component, Input } from '@angular/core';
import { AccountModel } from '../../../models/account.model';

export type ToolbarPosition = 'side' | 'top';

interface ToolbarItem {
  path: string;
  label: string;
  icon: string;
}

const TOOLBAR_ITEMS: ToolbarItem[] = [
  {path: 'dashboard', label: 'Přehled', icon: 'dashboard'},
  {path: 'card', label: 'Moje Karta', icon: 'credit_card'},
  {path: 'settings', label: 'Nastavení', icon: 'settings'},
  {path: 'employees', label: 'Zaměstnanci', icon: 'group'},
  {path: 'employer-card', label: 'Přehled karet', icon: 'markunread_mailbox'},
  {path: 'card-groups', label: 'Zaměstnavatelé', icon: 'markunread_mailbox'},
  {path: 'issuers', label: 'Vydavatelé karet', icon: 'card_giftcard'},
  {path: 'card-request', label: 'Žádosti o kartu', icon: 'markunread_mailbox'},
  {path: 'routing-table', label: 'Routovací tabulka', icon: 'view_list'},
  {path: 'merchants', label: 'Obchodníci', icon: 'monetization_on'},
  {path: 'org-units', label: 'Obchodní místa', icon: 'place'},
  {path: 'sequences', label: 'Sequence', icon: 'timeline'},
  {path: 'terminal', label: 'Terminal', icon: 'local_atm'},
  {path: 'campaigns', label: 'Kampaně', icon: 'dns'},
  {path: 'showcase', label: 'Showcase', icon: 'view_list'},
  {path: 'templates', label: 'Šablony', icon: 'insert_drive_file'},
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
}
