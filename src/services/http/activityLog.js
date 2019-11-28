import http from './http'

const service = {
  getActivityLogsEntriesByResearchGroup: (researchGroupId) => {
    return http.get(`/activity-log/${researchGroupId}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/groups/` });
  }
}

export default service;