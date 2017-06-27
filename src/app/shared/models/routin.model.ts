export interface RoutingTable {
  description: string;
  name: string;
}

export interface TableRoutes {
  id: number;
  description: string;
  orderInTable: number;
  routingTableName: string;
  ruleName: string;
  ruleParam: string;
  targetName: string;
  targetParam: string;
}

export function fillRoute(): TableRoutes {
  return {
    id: null,
    description: '',
    orderInTable: null,
    routingTableName: '',
    ruleName: '',
    ruleParam: '',
    targetName: '',
    targetParam: ''
  };
}
