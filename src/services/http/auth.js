import http from './http'
const registrationCommitteeUrl = process.env.DEIP_FOUNDATION_URL;
const authorizationUrl = process.env.DEIP_SERVER_URL;

const service = {

    signIn: function(model) {
        return http.post('/sign-in/', model, { baseURL: `${authorizationUrl}/auth/` });
    },
    preliminaryRegistration: function(model) {
        console.log(process.env.NODE_ENV);
        return http.post('/preliminary-registration', model, { baseURL: `${registrationCommitteeUrl}/api` });
    },
    signUp: function(model) {
        return http.post('/sign-up/', model, { baseURL: `${authorizationUrl}/auth/` });
    }
}

export default service;