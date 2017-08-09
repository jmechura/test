import { Component, Input } from '@angular/core';
import { ProfileModel } from '../../../models/profile.model';
import { LanguageService } from '../../../services/language.service';
import { routeToRule } from '../../../guards/auth.guard';

export type ToolbarPosition = 'side' | 'top';

interface ToolbarItem {
  path: string;
  label?: string;
  icon: string;
  rule?: string;
}

const TOOLBAR_ITEMS: ToolbarItem[] = [
  {path: 'dashboard', icon: 'dashboard'},
  {path: 'employee-card', icon: 'credit_card'},
  {path: 'settings', icon: 'settings'},
  {path: 'users', icon: 'group'},
  {path: 'cards', icon: 'markunread_mailbox'},
  {path: 'employee-cards', icon: 'markunread_mailbox'},
  {path: 'card-groups', icon: 'markunread_mailbox'},
  {path: 'issuers', icon: 'card_giftcard'},
  {path: 'card-request', icon: 'markunread_mailbox'},
  {path: 'routing-table', icon: 'view_list'},
  {path: 'merchants', icon: 'monetization_on'}, {path: 'org-units', icon: 'place'},
  {path: 'sequences', icon: 'timeline'},
  {path: 'terminal', icon: 'local_atm'},
  {path: 'campaigns', icon: 'dns'},
  {path: 'topups-schedule', icon: 'dns'},
  {path: 'templates', icon: 'insert_drive_file'},
  {path: 'imports', icon: 'import_export'},
  {path: 'admin-reports', icon: 'insert_drive_file'},
  {path: 'reports', icon: 'insert_drive_file'},
  {path: 'acquirers', icon: 'shopping_basket'},
  {path: 'payment-topups', icon: 'person'},
  {path: 'file-upload', icon: 'file_upload'},
  {path: 'showcase', icon: 'view_list'},
];

@Component({
  selector: 'mss-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  readonly toolbarItems = TOOLBAR_ITEMS.map(item => ({...item, path: `/platform/${item.path}`}));
  @Input() position: ToolbarPosition = 'top';
  @Input() userData: ProfileModel;

  constructor(private language: LanguageService) {
    this.toolbarItems = TOOLBAR_ITEMS.map(item => ({
      ...item, label: this.language.translate(`menu.${item.path}`), path: `/platform/${item.path}`, rule: routeToRule[item.path]
    }));
  }
}

