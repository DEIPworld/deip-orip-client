import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client'
import Vue from 'vue'
import { getEnrichedProfiles } from './../../../utils/user'
import darService from './../../../services/dar'
import { 
    findBlocksByRange, getDynamicGlobalProperties, getConfig, 
    getBlock, getTransaction, getTransactionHex } from './../../../utils/blockchain';
    
var texture = undefined;

const state = {
    content: null,
    research: null,
    disciplinesList: [],
    totalVotesList: [],
    membersList: [],

    darRef: null,
    textureApiRef: null,

    isLoadingResearchContentPage: undefined,
    isLoadingResearchContentVotes: undefined,
    isLoadingResearchDetails: undefined,
    isLoadingResearchContentDetails: undefined,

    contentMetadata: null,
    isLoadingResearchContentMetadataPage: undefined
}

// getters
const getters = {

    content: (state, getters) => {
        return state.content;
    },

    research: (state, getters) => {
        return state.research;
    },

    disciplinesList: (state, getters) => {
        return state.disciplinesList;
    },

    totalVotesList: (state, getters) => {
        return state.totalVotesList;
    },

    darRef: (state, getters) => {
        return state.darRef;
    },

    texture: (state, getters) => {
        return texture;
    },

    membersList: (state, getters) => {
        return state.membersList;
    },

    isLoadingResearchContentPage: (state, getters) => {
        return state.isLoadingResearchContentPage;
    },

    contentMetadata: (state, getters) => {
        return state.contentMetadata;
    },

    isLoadingResearchContentMetadataPage: (state, getters) => {
        return state.isLoadingResearchContentMetadataPage;
    },

    contentWeightByDiscipline: function() {
        const map = {};
        const flattened = state.totalVotesList.reduce(
            function(accumulator, currentValue) {
                return accumulator.concat(currentValue);
            }, []);

        for (var i = 0; i < flattened.length; i++) {
            const tvo = flattened[i];
            const discipline_id = tvo.discipline_id.toString();
            const research_content_id = tvo.research_content_id.toString();
            const total_research_reward_weight = tvo.total_research_reward_weight;

            if (map[research_content_id] === undefined)
                map[research_content_id] = {};

            map[research_content_id][discipline_id] = total_research_reward_weight;
        }

        return map;
    }
}

// actions
const actions = {

    loadResearchContentDetails({ state, commit, dispatch },
            { group_permlink, research_permlink, content_permlink, darRef }) {

        commit('RESET_STATE');

        commit('SET_RESEARCH_CONTENT_PAGE_LOADING_STATE', true)

        if (!content_permlink || content_permlink == '!draft') {
            // this is dar draft
            commit('SET_RESEARCH_CONTENT_DAR_REF', darRef)
            deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
                .then((research) => {

                    const darRefLoad = darRef ? new Promise((resolve, reject) => {
                        dispatch('loadResearchContentDarRef', { hashOrId: darRef, notify: resolve })
                    }) : Promise.resolve();

                    const researchDetailsLoad = new Promise((resolve, reject) => {
                        dispatch('loadResearchDetails', { group_permlink, research_permlink, notify: resolve })
                    });

                    return Promise.all([researchDetailsLoad, darRefLoad])
                })
                .finally(() => {
                    commit('SET_RESEARCH_CONTENT_PAGE_LOADING_STATE', false)
                });

        } else {
            commit('SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE', true)
            deipRpc.api.getResearchContentByAbsolutePermlinkAsync(group_permlink, research_permlink, content_permlink)
                .then((content) => {
                    commit('SET_RESEARCH_CONTENT_DETAILS', content)

                    const darRefLoad = content.content.slice(0, 4) === 'dar:' ? new Promise((resolve, reject) => {
                        dispatch('loadResearchContentDarRef', { hashOrId: content.content.slice(4), notify: resolve })
                    }) : Promise.resolve();

                    const researchDetailsLoad = new Promise((resolve, reject) => {
                        dispatch('loadResearchDetails', { group_permlink, research_permlink, notify: resolve })
                    });
                    const contentVotesLoad = new Promise((resolve, reject) => {
                        dispatch('loadResearchContentVotes', { researchId: content.research_id, notify: resolve })
                    });

                    return Promise.all([darRefLoad, researchDetailsLoad, contentVotesLoad])
                }, (err) => {console.log(err)})
                .finally(() => {
                    commit('SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE', false)
                    commit('SET_RESEARCH_CONTENT_PAGE_LOADING_STATE', false)
                });
        }
    },

    loadResearchContentVotes({ state, commit }, { researchId, notify }) {
        commit('SET_RESEARCH_CONTENT_VOTES_LOADING_STATE', true)
        const disciplinesList = []
        deipRpc.api.getDisciplinesByResearchAsync(researchId)
            .then((data) => {
                const promises = [];
                for (var i = 0; i < data.length; i++) {
                    var discipline = data[i];
                    disciplinesList.push(discipline);
                    promises.push(deipRpc.api.getTotalVotesByResearchAndDisciplineAsync(researchId, discipline.id))
                }
                return Promise.all(promises);
            }, (err) => {console.log(err)})
            .then((tvoList) => {
                commit('SET_RESEARCH_CONTENT_DISCIPLINES_LIST', disciplinesList)
                commit('SET_RESEARCH_CONTENT_TOTAL_VOTES_LIST', tvoList)
            }).finally(() => {
                commit('SET_RESEARCH_CONTENT_VOTES_LOADING_STATE', false)
                if (notify) notify();
            });
    },

    loadResearchDetails({ state, commit, dispatch }, { group_permlink, research_permlink, notify }) {
        commit('SET_RESEARCH_DETAILS_LOADING_STATE', true)

        const rgtList = [];
        deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
            .then((research) => {
                commit('SET_RESEARCH_DETAILS', research)
                return deipRpc.api.getResearchGroupTokensByResearchGroupAsync(research.research_group_id)
            }).then((members) => {
                rgtList.push(...members)
                return getEnrichedProfiles(members.map(m => m.owner))

            }, (err) => {console.log(err)}) 
            .then((users) => {
                for (let i = 0; i < users.length; i++) {
                    const user = users[i];
                    user.rgt = rgtList.find(rgt => rgt.owner == user.account.name);
                }
                commit('SET_RESEARCH_MEMBERS_LIST', users)
                
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_DETAILS_LOADING_STATE', false)
                if (notify) notify();
            });
    },

    loadResearchContentDarRef({ state, commit, dispatch }, { hashOrId, notify }) {
        darService.getDraftMeta(hashOrId)
            .then((res) => {
                commit('SET_RESEARCH_CONTENT_DAR_REF', res)
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_DETAILS_LOADING_STATE', false)
                if (notify) notify();
            });
    },


    setTexture({ state, commit, dispatch }, instance) {
        // temporal hack to avoid blocking while converting texture nested props to reactive ones, 
        // do not do this in regular code without 'commit' call!
        texture = instance.texture;
    },


    async loadResearchContentMetadata({ state, commit, dispatch }, 
        { group_permlink, research_permlink, content_permlink,  notify }) {

            commit('RESET_METADATA_STATE');
            commit('SET_RESEARCH_CONTENT_METADATA_PAGE_LOADING_STATE', true)

            try {
                const dgp = await getDynamicGlobalProperties();
                const conf = await getConfig();
                const content = await deipRpc.api.getResearchContentByAbsolutePermlinkAsync(group_permlink, research_permlink, content_permlink);
                const millisSinceGenesis = (dgp.current_aslot * conf.DEIP_BLOCK_INTERVAL) * 1000;
                const currentMillis = new Date(`${dgp.time}Z`).getTime();
                const genesisMillis = currentMillis - millisSinceGenesis;
                const isGenesisContent = new Date(`${content.created_at}Z`).getTime() === new Date(genesisMillis).getTime();
                const research = await deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)

                if (!isGenesisContent) {
                    const proposals = await deipRpc.api.getProposalsByResearchGroupIdAsync(research.research_group_id)

                    const contentProposal = proposals.filter(p => p.action == 11 && p.is_completed).find(p => {
                        const data = JSON.parse(p.data)
                        return data.content == content.content && data.permlink == content.permlink;
                    });

                    if (!contentProposal) {
                        // should never happen
                        throw new Error("Fatal: content proposal is not found")
                    }

                    // to get the block with content tx details we need to run scanning
                    const startTime = contentProposal.creation_time;
                    const endTime = contentProposal.expiration_time;
                    const bounds = await findBlocksByRange(startTime, endTime);

                    var block;
                    var txIdx;
                    var blockNum;
                    for (let i = bounds.first.num; i <= bounds.last.num; i++) {
                        block = await getBlock(i);
                        
                        const isFound = block.transactions.some((tx, idx) => {
                            const createProposalOps = tx.operations.filter(o => o[0] === 'create_proposal');
                            const contentProposals = createProposalOps.filter(o => o[1].action == 11);
                            const wanted = contentProposals.find(p => {
                                const data = JSON.parse(p[1].data);
                                return data.content == content.content;
                            });
                            txIdx = idx;

                            return wanted != undefined;
                        })


                        if (isFound) {
                            blockNum = i;
                            break;
                        }
                    }
                    const tx = await getTransaction(block.transaction_ids[txIdx])
                    const txHex = await getTransactionHex(tx)
                    // const witness = await getWitnessByAccount(block.witness)
                    const witnessUser = await getEnrichedProfiles([block.witness])
                    const votersMeta = await getProposalVotesMeta(contentProposal)

                    const contentMetadata = {
                        blockId: block.block_id,
                        blockNum: blockNum,
                        research: research,
                        content: content,
                        timestamp: `${block.timestamp}Z`,
                        witness: {
                            user: witnessUser[0],
                            signingKey: block.signing_key,
                            signature: block.witness_signature
                        },
                        voters: votersMeta,
                        chainId: process.env.CHAIN_ID,
                        transaction: {
                            id: tx.transaction_id,
                            hex: txHex
                        }
                    };
                    commit('SET_RESEARCH_CONTENT_METADATA', contentMetadata)

                    async function getProposalVotesMeta(proposal) {
                        const votersMeta = [];
                        for (let i = 0; i < proposal.votes.length; i++) {
                            const vote = proposal.votes[i];
                            const bounds = await findBlocksByRange(vote.voting_time, proposal.expiration_time);
                            for (let j = bounds.first.num; j <= bounds.last.num; j++) {
                                const block = await getBlock(j);
                                const proposalVoteOp = block.transactions.reduce(
                                    function(accumulator, tx) {
                                        const voteProposalOp = tx.operations.find(o => 
                                            o[0] === 'vote_proposal' && 
                                            o[1].proposal_id == proposal.id && 
                                            o[1].voter === vote.voter);

                                        if (voteProposalOp) {
                                            const payload = voteProposalOp[1];
                                            payload.signature = tx.signatures[0];
                                            accumulator.push(payload)
                                        }
                                        return accumulator;
                                    }, []);

                                if (proposalVoteOp[0]) {
                                    const metadata = proposalVoteOp[0]
                                    const enrichedProfiles = await getEnrichedProfiles([metadata.voter]);
                                    metadata.user = enrichedProfiles[0];
                                    votersMeta.push(metadata);
                                    break;
                                }
                            }
                        }
                        return votersMeta;
                    }
                    
                } else {
                    const genesisBlock = await getBlock(1);
                    const witnessUser = await getEnrichedProfiles([genesisBlock.witness])

                    const contentMetadata = {
                        blockId: genesisBlock.block_id,
                        blockNum: 1,
                        research: research,
                        content: content,
                        timestamp: `${genesisBlock.timestamp}Z`,
                        witness: {
                            user: witnessUser[0],
                            signingKey: genesisBlock.signing_key,
                            signature: genesisBlock.witness_signature
                        },
                        voters: [],
                        chainId: process.env.CHAIN_ID,
                        transaction: null
                    };

                    commit('SET_RESEARCH_CONTENT_METADATA', contentMetadata)
                }

                commit('SET_RESEARCH_CONTENT_METADATA_PAGE_LOADING_STATE', false)

            } catch (err) {
                console.error(err)
            }

    }

}



// mutations
const mutations = {

    ['SET_RESEARCH_CONTENT_DETAILS'](state, content) {
        Vue.set(state, 'content', content)
    },

    ['SET_RESEARCH_CONTENT_DISCIPLINES_LIST'](state, list) {
        Vue.set(state, 'disciplinesList', list)
    },

    ['SET_RESEARCH_CONTENT_TOTAL_VOTES_LIST'](state, list) {
        Vue.set(state, 'totalVotesList', list)
    },

    ['SET_RESEARCH_DETAILS'](state, research) {
        Vue.set(state, 'research', research)
    },

    ['SET_RESEARCH_CONTENT_DAR_REF'](state, darRef) {
        state.darRef = darRef
    },

    ['SET_RESEARCH_CONTENT_PAGE_LOADING_STATE'](state, value) {
        state.isLoadingResearchContentPage = value
    },

    ['SET_RESEARCH_DETAILS_LOADING_STATE'](state, value) {
        state.isLoadingResearchDetails = value
    },

    ['SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE'](state, value) {
        state.isLoadingResearchContentDetails = value
    },

    ['SET_RESEARCH_CONTENT_VOTES_LOADING_STATE'](state, value) {
        state.isLoadingResearchContentVotes = value
    },

    ['SET_RESEARCH_MEMBERS_LIST'](state, list) {
        Vue.set(state, 'membersList', list)
    },


    ['SET_RESEARCH_CONTENT_METADATA_PAGE_LOADING_STATE'](state, value) {
        Vue.set(state, 'isLoadingResearchContentMetadataPage', value)
    },

    ['SET_RESEARCH_CONTENT_METADATA'](state, value) {
        Vue.set(state, 'contentMetadata', value)
    },

    ['RESET_STATE'](state) {
        Vue.set(state, 'membersList', [])
        Vue.set(state, 'disciplinesList', [])
        Vue.set(state, 'totalVotesList', [])
        Vue.set(state, 'content', null)
        Vue.set(state, 'research', null)
        Vue.set(state, 'darRef', null)
        Vue.set(state, 'textureApiRef', null)
    },

    ['RESET_METADATA_STATE'](state) {
        Vue.set(state, 'contentMetadata', null)
    }    
}

const namespaced = true;

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
}