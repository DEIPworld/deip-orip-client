import http from './base/http'


const service = {
    getUser: function(id) {
        return http.get('/users/' + id);
    },
    setActiveMembership: function(membershipId) {
        return http.post('/users/active-membership', { activeMembershipId: membershipId });
    },
    setAccount: function(account) {
        return http.post('/profile/set-account', account);
    },
    searchUsersByName: function(name) {
        return http.get('/users/search/' + name);
    },
    getUserProfile: function(id) {
        return http.get('/users/' + id + '/profile');
    }
}

export default service;