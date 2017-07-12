export interface TemplateModel {
  code?: string;
  description?: string;
  id?: number;
  name?: string;
  resource?: string;
  resources?: ResourceModel[];
  system?: string;
  systemReceiver?: string;
}

export interface ResourceModel {
  id?: number;
  resource?: string;
  roles?: string[];
}

export interface TemplatePredicateObject {
  code?: string;
  name?: string;
  networkCode?: string;
  networkName?: string;
}
