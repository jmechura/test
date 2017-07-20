import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { RoleService } from '../services/role.service';

@Directive({selector: '[mssRoleIf]'})
export class RoleCheckDirective {
  private hasView = false;

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private roleService: RoleService) {
  }

  // unset key === component is displayed
  // invalid key === baklazan
  @Input()
  set mssRoleIf(key: string) {
    if (key == null || !key.length) {
      if (!this.hasView) {
        this.hasView = true;
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
      return;
    }
    this.roleService.isVisible(key).subscribe(
      (state: boolean) => {
        if (state && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        } else if (!state && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        }
      }
    );
  }
}
