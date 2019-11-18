import http from './http'

const service = {
  getResearchBookmarks: function(username) {
    return http.get(`/bookmarks/user/${username}?type=research`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
  },
  createResearchBookmark: function(username, researchId) {
    return http.post(`/bookmarks/user/${username}`, { type: 'research', researchId }, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
  },
  removeResearchBookmark: function(username, bookmarkId) {
    return http.delete_(`/bookmarks/user/${username}/remove/${bookmarkId}`, { baseURL: `${window.env.DEIP_SERVER_URL}/api/` });
  },
}

export default service;