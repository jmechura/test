export interface CampaignModel {
  campaignName: string;
  name: string;
  orderCampaign: number;
  runAfterStart: boolean;
  running?: boolean;
}

export interface CampaignPredicateObject {
  campaignName?: string;
  name?: string;
  orderCampaign?: number;
  runAfterStart?: boolean;
}

export function fillCampaign(): CampaignModel {
  return {
    campaignName: 'UNKNOWN',
    name: '',
    orderCampaign: 0,
    runAfterStart: false,
  };
}
