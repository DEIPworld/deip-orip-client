import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue'

import { isLoggedIn, getDecodedToken, getOwnerWif } from './../../../utils/auth'

const state = {
    user: {
        username: isLoggedIn() ? getDecodedToken().username : null,
        pubKey: isLoggedIn() ? getDecodedToken().pubKey : null,
        privKey: isLoggedIn() ? getOwnerWif() : null
    }
}

// getters
const getters = {
    user: (state, getters) => {
        return state.user
    }
}

// actions
const actions = {

}

// mutations
const mutations = {

}

export default {
    state,
    getters,
    actions,
    mutations
}