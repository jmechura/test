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
