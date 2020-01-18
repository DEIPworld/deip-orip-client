import http from './http'

const service = {
  getResearchContentAccessRequests: function() {
    return http.get(`/research-content-access-requests`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
  },
  getResearchContentAccessRequestFormData: function (refId) {
    return http.get(`research-content-access-requests/form/${refId}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
  },
  createResearchContentAccessRequest: function(data) {
    return http.post(`/research-content-access-requests`, data, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
  },
  approveResearchContentAccessRequest: function(id) {
    return http.post(`/research-content-access-requests/${id}/approve`, null, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
  },
  denyResearchContentAccessRequest: function(id) {
    return http.post(`/research-content-access-requests/${id}/deny`, null, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
  },
}

export default service;