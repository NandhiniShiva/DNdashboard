import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IDnTransporterDashboardProps {
  description: string;
  siteurl: string;
  context:WebPartContext;
  Percentage: any;
  Isdownloading: boolean;
  Downloadstatus: string;
}
