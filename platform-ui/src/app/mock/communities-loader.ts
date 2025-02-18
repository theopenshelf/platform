import { UICommunity } from '../models/UICommunity';
import communitiesData from './communities.json';


export const loadCommunitiesData = (): UICommunity[] => {
    return communitiesData;
};
