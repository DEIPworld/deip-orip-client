import axios from 'axios';

import { AppConfigService } from '@deip/app-config-service';

import { ResearchGroupService } from '@deip/research-group-service';
import { ResearchGroupProposalVotingService } from '@deip/research-group-proposal-voting-service';

const setConfig = async () => {
  const env = await axios.get('/env');

  window.env = env.data;

  AppConfigService.getInstance().init({ env: env.data })

  ResearchGroupService.getInstance().setMethods({
    voting: ResearchGroupProposalVotingService.getInstance()
  });
};

export {
  setConfig
}
