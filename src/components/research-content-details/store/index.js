import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client'
import Vue from 'vue'
import { getEnrichedProfiles } from './../../../utils/user'
import contentHttpService from './../../../services/http/content'
import { 
    findBlocksByRange, getDynamicGlobalProperties, getConfig, 
    getBlock, getTransaction, getTransactionHex } from './../../../utils/blockchain';
import { CREATE_RESEARCH_MATERIAL } from './../../../services/ProposalService';
    
var texture = undefined;
var reviewEditor = undefined;

const state = {
    content: null,
    research: null,
    group: null,
    disciplinesList: [],
    totalVotesList: [],
    membersList: [],
    contentList: [],
    contentReviewsList: [],
    contentProposal: undefined,

    contentRef: null,

    isLoadingResearchContentPage: undefined,
    isLoadingResearchContentVotes: undefined,
    isLoadingResearchDetails: undefined,
    isLoadingResearchContentDetails: undefined,
    isLoadingResearchContentReviews: undefined,
    isLoadingResearchGroupDetails: undefined,

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

    group: (state, getters) => {
        return state.group;
    },
    
    contentProposal: (state) => {
        return state.contentProposal;
    },

    disciplinesList: (state, getters) => {
        return state.disciplinesList;
    },

    totalVotesList: (state, getters) => {
        return state.totalVotesList;
    },

    contentList: (state, getters) => {
        return state.contentList;
    },

    contentReviewsList: (state, getters) => {
        return state.contentReviewsList;
    },

    contentRef: (state, getters) => {
        return state.contentRef;
    },

    texture: (state, getters) => {
        return texture;
    },

    reviewEditor: (state, getters) => {
        return reviewEditor;
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
            const total_weight = tvo.total_weight;

            if (map[research_content_id] === undefined)
                map[research_content_id] = {};

            map[research_content_id][discipline_id] = total_weight;
        }
        return map;
    }
}

// actions
const actions = {

    loadResearchContentDetails({ state, commit, dispatch },
            { group_permlink, research_permlink, content_permlink, ref }) {

        commit('RESET_STATE');
        commit('SET_RESEARCH_CONTENT_PAGE_LOADING_STATE', true)

        if (!content_permlink || content_permlink === '!draft') {
            // this is draft
            const contentRefLoad = new Promise((resolve, reject) => {
                dispatch('loadResearchContentRef', { hashOrId: ref, notify: resolve })
            });
            const researchDetailsLoad = new Promise((resolve, reject) => {
                dispatch('loadResearchDetails', { group_permlink, research_permlink, notify: resolve })
            });
            const researchGroupDetailsLoad = new Promise((resolve, reject) => {
                dispatch('loadResearchGroupDetails', { group_permlink, notify: resolve })
            });
            Promise.all([contentRefLoad, researchDetailsLoad, researchGroupDetailsLoad])
                .finally(() => {
                    commit('SET_RESEARCH_CONTENT_PAGE_LOADING_STATE', false)
                });
        } else {
            commit('SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE', true)
            deipRpc.api.getResearchContentByAbsolutePermlinkAsync(group_permlink, research_permlink, content_permlink)
                .then((contentObj) => {
                    commit('SET_RESEARCH_CONTENT_DETAILS', contentObj)
                    const content = contentObj.content;
                    const ref = content.indexOf('file:') == 0 ? content.slice(5) : content.indexOf('dar:') == 0 ? content.slice(4) : content;

                    const contentRefLoad = new Promise((resolve, reject) => {
                        dispatch('loadResearchContentRef', { hashOrId: ref, notify: resolve })
                    });
                    const researchDetailsLoad = new Promise((resolve, reject) => {
                        dispatch('loadResearchDetails', { group_permlink, research_permlink, notify: resolve })
                    });
                    const contentReviewsLoad = new Promise((resolve, reject) => {
                        dispatch('loadContentReviews', { researchContentId: contentObj.id, notify: resolve })
                    });
                    const contentVotesLoad = new Promise((resolve, reject) => {
                        dispatch('loadResearchContentVotes', { researchId: contentObj.research_id, notify: resolve })
                    });

                    return Promise.all([contentRefLoad, researchDetailsLoad, contentReviewsLoad, contentVotesLoad])
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
        var researchId;
        deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
            .then((research) => {
                commit('SET_RESEARCH_DETAILS', research)
                researchId = research.id;
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
                return deipRpc.api.getAllResearchContentAsync(researchId)
            }, (err) => {console.log(err)})
            .then((list) => {
                commit('SET_RESEARCH_CONTENT_LIST', list)
            }, (err) => { console.log(err) })
            .finally(() => {
                commit('SET_RESEARCH_DETAILS_LOADING_STATE', false)
                if (notify) notify();
            });
    },

    loadResearchGroupDetails({ state, commit, dispatch }, { group_permlink, notify }) {
        commit('SET_RESEARCH_GROUP_DETAILS_LOADING_STATE', true)
        deipRpc.api.getResearchGroupByPermlinkAsync(group_permlink)
            .then((group) => {
                commit('SET_RESEARCH_GROUP_DETAILS', group)
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_GROUP_DETAILS_LOADING_STATE', false)
                if (notify) notify();
            });
    },

    loadResearchContentRef({ state, commit, dispatch }, { hashOrId, notify }) {
        return contentHttpService.getContentRef(hashOrId)
            .then((contentRef) => {
                commit('SET_RESEARCH_CONTENT_REF', contentRef);
                return deipRpc.api.getProposalsByResearchGroupIdAsync(contentRef.researchGroupId) 
            }, (err) => {console.log(err)})
            .then((proposals) => {
                const contentRef = state.contentRef;
                const contentProposal = proposals.filter(p => p.action == CREATE_RESEARCH_MATERIAL).find(p => {
                    const data = JSON.parse(p.data);
                    const proposalContent = data.content;
                    return proposalContent === `${contentRef.type}:${contentRef.hash}`;
                });                
                commit('SET_CONTENT_PROPOSAL', contentProposal || null)
            })
            .finally(() => {
                commit('SET_RESEARCH_DETAILS_LOADING_STATE', false)
                if (notify) notify();
            });
    },

    loadContentReviews({ state, dispatch, commit }, { researchContentId, notify }) {
        const reviews = [];
        commit('SET_RESEARCH_CONTENT_REVIEWS_LOADING_STATE', true);

        deipRpc.api.getReviewsByContentAsync(researchContentId)
            .then(items => {
                reviews.push(...items);
                return Promise.all([
                    Promise.all(
                        reviews.map(item => deipRpc.api.getReviewVotesByReviewIdAsync(item.id))
                    ),
                    getEnrichedProfiles(reviews.map(r => r.author))
                ]);
            }, (err) => {console.log(err)})
            .then(([reviewVotes, users]) => {
                reviews.forEach((review, i) => {
                    review.author = users.find(u => u.account.name == review.author);
                    review.votes = reviewVotes[i];
                });

                commit('SET_RESEARCH_CONTENT_REVIEWS_LIST', reviews);
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_CONTENT_REVIEWS_LOADING_STATE', false)
                if (notify) notify();
            })
    },

    setTexture({ state, commit, dispatch }, instance) {
        // temporal hack to avoid blocking while converting texture nested props to reactive ones, 
        // do not do this in regular code without 'commit' call!
        texture = instance.texture;
    },

    setReviewEditor({ state, commit, dispatch }, instance) {
        // temporal hack to avoid blocking while converting substance nested props to reactive ones, 
        // do not do this in regular code without 'commit' call!
        reviewEditor = instance.reviewEditor;
    },

    setDraftAuthors({ state, commit, dispatch }, authors) {
        commit('SET_DRAFT_AUTHORS_LIST', authors);
    },

    setDraftReferences({ state, commit, dispatch }, references) {
        commit('SET_DRAFT_REFERENCES_LIST', references);
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
                const research = await deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink);
                const group = await deipRpc.api.getResearchGroupByPermlinkAsync(group_permlink);

                if (!isGenesisContent) {
                    const proposals = await deipRpc.api.getProposalsByResearchGroupIdAsync(research.research_group_id)

                    const contentProposal = proposals.filter(p => p.action == CREATE_RESEARCH_MATERIAL && p.is_completed).find(p => {
                        const data = JSON.parse(p.data)
                        return data.content == content.content && data.permlink == content.permlink;
                    });

                    if (!contentProposal) {
                        // should never happen
                        throw new Error("Fatal: content proposal is not found")
                    }

                    // to get the block with content tx details we need to run scanning
                    const startTime = contentProposal.creation_time;
                    
                    /* todo: replace approximate estimated endTime with actual values 
                       once we have moved this to aggreagtion server */
                    const endTime = contentProposal.expiration_time;

                    // var contentCreatedTimePlus10Minutes = new Date(new Date(`${content.created_at}Z`).getTime() + 1 * 60000);
                    // const endTimeIso = contentCreatedTimePlus10Minutes.toISOString();
                    // const endTime = endTimeIso.slice(0, endTimeIso.indexOf('.'));
                    const bounds = await findBlocksByRange(startTime, endTime);

                    var block;
                    var txIdx;
                    var blockNum;
                    for (let i = bounds.first.num; i <= bounds.last.num; i++) {
                        block = await getBlock(i);

                        var isFound = false;

                        for (let k = 0; k < block.transactions.length; k++) {
                            const tx = block.transactions[k];
                            const createProposalOps = tx.operations.filter(o => o[0] === 'create_proposal');
                            const contentProposals = createProposalOps.filter(o => o[1].action == CREATE_RESEARCH_MATERIAL);
                            const wanted = contentProposals.find(p => {
                                const data = JSON.parse(p[1].data);
                                return data.content == content.content && data.permlink == content.permlink;
                            });

                            if (wanted) {
                                isFound = true;
                                txIdx = k;
                                break;
                            }
                        }

                        if (isFound) {
                            blockNum = i;
                            break;
                        }
                    }
                    const tx = await getTransaction(block.transaction_ids[txIdx])
                    const txHex = await getTransactionHex(tx)
                    // const witness = await getWitnessByAccount(block.witness)
                    const witnessUser = await getEnrichedProfiles([block.witness])
                    const votersMeta = [];
                    
                    if (!group.is_personal) {
                         const voters = await getProposalVotesMeta(contentProposal, endTime);
                         votersMeta.push(...voters);
                    }
                    
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

                    async function getProposalVotesMeta(proposal, endTime) {
                        const votersMeta = [];
                        const sortedVotes = proposal.votes.sort((a,b) => {return (a.voting_time > b.voting_time) ? 1 : ((b.voting_time > a.voting_time) ? -1 : 0);}); 
                        const firstVote = sortedVotes[0];
                        const bounds = await findBlocksByRange(firstVote.voting_time, endTime /* proposal.expiration_time */);

                        const blocks = {};

                        for (let i = 0; i < sortedVotes.length; i++) {
                            const vote = sortedVotes[i];
                                                            
                            for (let j = bounds.first.num; j <= bounds.last.num; j++) {
                                const block = blocks[j] ? blocks[j] : await getBlock(j);
                                if (!blocks[j]) {
                                    blocks[j] = block;
                                }
                                if (block.timestamp < vote.voting_time) {
                                    continue;
                                }

                                var isFound = false;

                                for (let k = 0; k < block.transactions.length; k++) {
                                    const tx = block.transactions[k];
                                    const voteProposalOp = tx.operations.find(o => 
                                        o[0] === 'vote_proposal' && 
                                        o[1].proposal_id == proposal.id && 
                                        o[1].voter === vote.voter);

                                    if (voteProposalOp) {
                                        const metadata = voteProposalOp[1];
                                        metadata.signature = tx.signatures[0];
                                        const enrichedProfiles = await getEnrichedProfiles([metadata.voter]);
                                        metadata.user = enrichedProfiles[0];
                                        votersMeta.push(metadata);
                                        isFound = true;
                                        break;
                                    }
                                }

                                if (isFound) {
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

    ['SET_RESEARCH_CONTENT_REVIEWS_LIST'](state, list) {
        Vue.set(state, 'contentReviewsList', list)
    },

    ['SET_RESEARCH_CONTENT_LIST'](state, list) {
        Vue.set(state, 'contentList', list)
    },

    ['SET_RESEARCH_DETAILS'](state, research) {
        Vue.set(state, 'research', research)
    },

    ['SET_CONTENT_PROPOSAL'](state, contentProposal) {
        Vue.set(state, 'contentProposal', contentProposal)
    },

    ['SET_RESEARCH_CONTENT_REF'](state, contentRef) {
        state.contentRef = contentRef
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

    ['SET_RESEARCH_CONTENT_REVIEWS_LOADING_STATE'](state, value) {
        state.isLoadingResearchContentReviews = value
    },
    
    ['SET_RESEARCH_GROUP_DETAILS_LOADING_STATE'](state, value) {
        state.isLoadingResearchGroupDetails = value
    },

    ['SET_RESEARCH_MEMBERS_LIST'](state, list) {
        Vue.set(state, 'membersList', list)
    },

    ['SET_DRAFT_AUTHORS_LIST'](state, list) {
        Vue.set(state.contentRef, 'authors', list)
    },

    ['SET_DRAFT_REFERENCES_LIST'](state, list) {
        Vue.set(state.contentRef, 'references', list)
    },
    
    ['SET_RESEARCH_CONTENT_METADATA_PAGE_LOADING_STATE'](state, value) {
        Vue.set(state, 'isLoadingResearchContentMetadataPage', value)
    },

    ['SET_RESEARCH_CONTENT_METADATA'](state, value) {
        Vue.set(state, 'contentMetadata', value)
    },

    ['SET_RESEARCH_GROUP_DETAILS'](state, value) {
        Vue.set(state, 'group', value)
    },

    ['RESET_STATE'](state) {
        texture = undefined;
        reviewEditor = undefined;
        Vue.set(state, 'membersList', [])
        Vue.set(state, 'disciplinesList', [])
        Vue.set(state, 'totalVotesList', [])
        Vue.set(state, 'contentReviewsList', [])
        Vue.set(state, 'contentList', [])
        Vue.set(state, 'content', null)
        Vue.set(state, 'contentProposal', undefined)
        Vue.set(state, 'research', null)
        Vue.set(state, 'contentRef', null)
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