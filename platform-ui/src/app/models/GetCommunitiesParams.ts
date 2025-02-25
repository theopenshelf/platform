import { UILocation } from "./UILocation";

export interface GetCommunitiesParams {
    searchText?: string;
    requiresApproval?: boolean;
    location?: UILocation;
    distance?: number;
    page?: number;
    pageSize?: number;
    isMember?: boolean;
}
