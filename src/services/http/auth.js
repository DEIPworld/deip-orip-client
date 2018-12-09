import http from './http'

const service = {

    signIn: function(model) {
        return http.post('/sign-in/', model, { baseURL: `${window.env.DEIP_SERVER_URL}/auth/` });
    },
    preliminaryRegistration: function(model) {
        return http.post('/preliminary-registration', model, { baseURL: `${registrationCommitteeUrl}/api` });
    },
    signUp: function(model) {
        return http.post('/sign-up/', model, { baseURL: `${window.env.DEIP_SERVER_URL}/auth/` });
    }
}

export default service;