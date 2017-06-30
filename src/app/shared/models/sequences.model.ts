export interface SequencesModel {
  order: number;
  template: string;
  pk: {
    resource: string;
    resourceId: string;
    type: string
  };
}


export function fillSequence(): SequencesModel {
  return {
    order: null,
    template: '',
    pk: {
      resource: '',
      resourceId: '',
      type: ''
    }
  };
}
