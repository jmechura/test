export interface TemplateSimpleModel {
  id?: number;
  name?: string;
  resources?: ResourceSimpleModel[];
}

export interface ResourceSimpleModel {
  id?: number;
  resource?: string;
  resourceId?: string;
}
