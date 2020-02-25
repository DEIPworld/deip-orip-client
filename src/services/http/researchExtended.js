import http from './http'

const service = {

  getResearch(researchId) {
    return http.get(`/research/${researchId}`, {baseURL: `${window.env.DEIP_SERVER_URL}/api/`});
  },

  updateResearch(researchId, update) {
    return http.put(`/research/${researchId}`, update, {baseURL: `${window.env.DEIP_SERVER_URL}/api/`});
  }
}

export default service;
