import _ from 'lodash';
import deipRpc from '@deip/rpc-client';
import Vue from 'vue';

import { ResearchService } from '@deip/research-service';
import { UsersService } from '@deip/users-service';
import { ResearchContentService } from '@deip/research-content-service';
import { ProposalsService } from '@deip/proposals-service';

import { BlockchainService } from '@deip/blockchain-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';

import { PROPOSAL_TYPES, EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';

const researchService = ResearchService.getInstance();
const usersService = UsersService.getInstance();
const researchContentService = ResearchContentService.getInstance();
const blockchainService = BlockchainService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();
const proposalsService = ProposalsService.getInstance();

const state = {
  content: null,
  research: null,
  group: null,
  disciplinesList: [],
  membersList: [],
  contentList: [],
  contentReviewsList: [],
  expertsList: [],
  researchContentReferencesGraph: [],
  contentProposal: undefined,
  contentRef: null,
  researchContentEciStatsRecords: null,

  isLoadingResearchContentVotes: undefined,
  isLoadingResearchDetails: undefined,
  isLoadingResearchContentDetails: undefined,
  isLoadingResearchContentReviews: undefined,
  isLoadingResearchGroupDetails: undefined,

  contentMetadata: null
};

// getters
const getters = {

  content: (state, getters) => state.content,

  research: (state, getters) => state.research,

  group: (state, getters) => state.group,

  contentProposal: (state) => state.contentProposal,

  disciplinesList: (state, getters) => state.disciplinesList,

  contentList: (state, getters) => state.contentList,

  contentReviewsList: (state, getters) => state.contentReviewsList,

  expertsList: (state, getters) => state.expertsList,

  contentRef: (state, getters) => state.contentRef,

  researchContentEciStatsRecords: (state) => state.researchContentEciStatsRecords,

  isFilePackageContent(state, getters, rootState, rootGetters) {
    return state.contentRef && (state.contentRef.type === 'package' || state.contentRef.type === 'file' /* legacy */);
  },

  isDarContent(state, getters, rootState, rootGetters) {
    return state.contentRef && state.contentRef.type === 'dar';
  },

  isInProgress(state, getters, rootState, rootGetters) {
    return state.contentRef && state.contentRef.status === 'in-progress';
  },

  isPublished(state, getters, rootState, rootGetters) {
    return state.content != null;
  },

  isProposed(state, getters, rootState, rootGetters) {
    return state.contentRef && state.contentRef.status === 'proposed';
  },

  isPersonalGroup(state, getters, rootState, rootGetters) {
    const userPersonalGroup = rootGetters['auth/userPersonalGroup'];
    return state.research.research_group_id == userPersonalGroup.id;
  },

  isCentralizedGroup(state, getters, rootState, rootGetters) {
    return getters.group.is_centralized || getters.group.is_personal;
  },

  isResearchGroupMember(state, getters, rootState, rootGetters) {
    const isMember = rootGetters['auth/userIsResearchGroupMember'](state.research.research_group_id);
    return isMember;
  },

  userHasReview(state, getters, rootState, rootGetters) {
    const user = rootGetters['auth/user'];
    const userHasReview = getters.contentReviewsList.some((r) => r.author.account.name === user.username);
    return userHasReview;
  },

  userHasResearchExpertise(state, getters, rootState, rootGetters) {
    const userExperiseList = rootGetters['auth/userExperise'];
    return userExperiseList.some((exp) => state.research.disciplines.some((d) => d.id == exp.discipline_id && exp.amount > 0));
  },

  isCreatingReviewAvailable(state, getters, rootState, rootGetters) {
    return !getters.isResearchGroupMember && !getters.userHasReview && getters.userHasResearchExpertise && getters.isPublished;
  },

  isSavingDraftAvailable(state, getters, rootState, rootGetters) {
    return getters.isResearchGroupMember && getters.isDarContent && getters.isInProgress;
  },

  membersList: (state, getters) => state.membersList,

  researchMembersList: (state, getters) => state.membersList
    .filter((member) => state.research.members.some((m) => m == member.account.name)),

  contentMetadata: (state, getters) => state.contentMetadata,



  researchContentReferencesGraph: (state, getters) => {
    const nodes = [];
    for (let i = 0; i < state.researchContentReferencesGraph.nodes.length; i++) {
      const node = state.researchContentReferencesGraph.nodes[i];
      nodes.push({ ...node });
    }

    const links = [];
    for (let i = 0; i < state.researchContentReferencesGraph.links.length; i++) {
      const link = state.researchContentReferencesGraph.links[i];
      links.push({ ...link });
    }

    return { nodes, links };
  },
};

// actions
const actions = {

  loadResearchContentDetails({ state, commit, dispatch },
    {
      group_permlink, research_permlink, content_permlink, ref
    }) {
    commit('RESET_STATE');
    return dispatch('loadResearchDetails', { group_permlink, research_permlink })
      .then(() => {
        if (!content_permlink || content_permlink === '!draft') { // this is a draft that is not published yet
          commit('SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE', true);
          const contentRefLoad = new Promise((resolve, reject) => {
            dispatch('loadResearchContentRef', {
              researchExternalId: state.research.external_id,
              refId: ref,
              hash: null,
              notify: resolve
            });
          });
          const researchGroupDetailsLoad = new Promise((resolve, reject) => {
            dispatch('loadResearchGroupDetails', { group_permlink, notify: resolve });
          });

          return Promise.all([contentRefLoad, researchGroupDetailsLoad])
            .finally(() => {
              commit('SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE', false);
            });
        }

        commit('SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE', true);
        return deipRpc.api.getResearchContentByAbsolutePermlinkAsync(group_permlink, research_permlink, content_permlink)
          .then((contentObj) => {
            commit('SET_RESEARCH_CONTENT_DETAILS', contentObj);
            const { content: hash } = contentObj;

            const contentRefLoad = new Promise((resolve, reject) => {
              dispatch('loadResearchContentRef', {
                researchExternalId: state.research.external_id,
                refId: null,
                hash,
                notify: resolve
              });
            });

            const contentReviewsLoad = new Promise((resolve, reject) => {
              dispatch('loadContentReviews', { researchContentExternalId: contentObj.external_id, notify: resolve });
            });

            const contentVotesLoad = new Promise((resolve, reject) => {
              dispatch('loadResearchContentVotes', { researchId: contentObj.research_id, notify: resolve });
            });

            const researchGroupDetailsLoad = new Promise((resolve, reject) => {
              dispatch('loadResearchGroupDetails', { group_permlink, notify: resolve });
            });

            const referencesLoad = new Promise((resolve, reject) => {
              dispatch('loadResearchContentReferences', { researchContentId: contentObj.id, notify: resolve });
            });

            return Promise.all([
              contentRefLoad,
              contentReviewsLoad,
              contentVotesLoad,
              researchGroupDetailsLoad,
              referencesLoad,
              dispatch('loadResearchContentEciStatsRecords', {research_content_external_id: contentObj.external_id })
            ]);
          }, (err) => {
            console.error(err);
          })
          .finally(() => {
            commit('SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE', false);
          });
      });
  },

  loadResearchContentVotes({ state, commit }, { researchId, notify }) {
    commit('SET_RESEARCH_CONTENT_VOTES_LOADING_STATE', true);
    const disciplinesList = [];
    deipRpc.api.getDisciplinesByResearchAsync(researchId)
      .then((data) => {
        const expertsPromises = [];

        for (let i = 0; i < data.length; i++) {
          const discipline = data[i];
          disciplinesList.push(discipline);
          expertsPromises.push(deipRpc.api.getExpertTokensByDisciplineAsync(discipline.external_id));
        }

        return Promise.all([
          Promise.all(expertsPromises)
        ]);
      }, (err) => {
        console.error(err);
      })
      .then(([expertTokensPerDiscipline]) => {
        const expertsAccountNames = [];
        expertTokensPerDiscipline.forEach((e) => {
          expertsAccountNames.push(...e.map((et) => et.account_name));
        });
        commit('SET_RESEARCH_CONTENT_DISCIPLINES_LIST', disciplinesList);
        return usersService.getEnrichedProfiles(_.uniq(expertsAccountNames));
      }).then((expertsList) => {
        commit('SET_EXPERTS_LIST', expertsList);
      })
      .finally(() => {
        commit('SET_RESEARCH_CONTENT_VOTES_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchDetails({ state, commit, dispatch }, { group_permlink, research_permlink, notify }) {
    commit('SET_RESEARCH_DETAILS_LOADING_STATE', true);

    const rgtList = [];
    let researchExternalId;
    return deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
      .then((research) => {
        commit('SET_RESEARCH_DETAILS', research);
        researchExternalId = research.external_id;
        return deipRpc.api.getResearchGroupTokensByResearchGroupAsync(research.research_group_id);
      }).then((members) => {
        rgtList.push(...members);
        return usersService.getEnrichedProfiles(members.map((m) => m.owner));
      }, (err) => {
        console.error(err);
      })
      .then((users) => {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          user.rgt = rgtList.find((rgt) => rgt.owner === user.account.name);
        }
        commit('SET_RESEARCH_GROUP_MEMBERS_LIST', users);
        return researchContentService.getResearchContentByResearch(researchExternalId);
      }, (err) => {
        console.error(err);
      })
      .then((list) => {
        commit('SET_RESEARCH_CONTENT_LIST', list);
      }, (err) => {
        console.error(err);
      })
      .finally(() => {
        commit('SET_RESEARCH_DETAILS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchGroupDetails({ state, commit, dispatch }, { group_permlink, notify }) {
    commit('SET_RESEARCH_GROUP_DETAILS_LOADING_STATE', true);
    deipRpc.api.getResearchGroupByPermlinkAsync(group_permlink)
      .then((group) => {
        commit('SET_RESEARCH_GROUP_DETAILS', group);
      }, (err) => {
        console.error(err);
      })
      .finally(() => {
        commit('SET_RESEARCH_GROUP_DETAILS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchContentRef({ state, commit, dispatch }, {
    refId, researchExternalId, hash, notify
  }) {
    const refPromies = refId != null
      ? researchContentService.getContentRefById(refId)
      : researchContentService.getContentRefByHash(researchExternalId, hash);

    refPromies
      .then((contentRef) => {
        commit('SET_RESEARCH_CONTENT_REF', contentRef);
        return proposalsService.getProposalsByCreator(contentRef.researchGroupExternalId);
      })
      .then((proposals) => {
        const { contentRef } = state;
        const contentProposal = proposals.filter((p) => p.action === PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL).find((p) => p.payload.content == contentRef.hash && p.payload.research_external_id == researchExternalId);
        commit('SET_CONTENT_PROPOSAL', contentProposal || null);
      })
      .catch((err) => { console.error(err); })
      .finally(() => {
        commit('SET_RESEARCH_DETAILS_LOADING_STATE', false);
        if (notify) notify();
      });
    return refPromies;
  },

  loadContentReviews({ state, dispatch, commit }, { researchContentExternalId, notify }) {
    const reviews = [];
    commit('SET_RESEARCH_CONTENT_REVIEWS_LOADING_STATE', true);
    // todo: fix the method in database_api to return reviews for content only
    deipRpc.api.getReviewsByResearchContentAsync(researchContentExternalId)
      .then((items) => {
        reviews.push(...items);
        return Promise.all([
          Promise.all(reviews.map((item) => deipRpc.api.getReviewVotesByReviewIdAsync(item.id))),
          usersService.getEnrichedProfiles(reviews.map((r) => r.author))
        ]);
      }, (err) => {
        console.error(err);
      })
      .then(([votes, users]) => {
        const voters = [];
        for (let i = 0; i < reviews.length; i++) {
          const review = reviews[i];
          review.author = users.find((u) => u.account.name == review.author);

          const reviewVotes = votes[i].reduce((arr, vote) => (arr.some(({ voter }) => voter === vote.voter) ? arr : [...arr, vote]), []);
          review.votes = reviewVotes;

          for (let j = 0; j < reviewVotes.length; j++) {
            const vote = reviewVotes[j];
            if (!voters.some((v) => v == vote.voter)) {
              voters.push(vote.voter);
            }
          }
        }

        return usersService.getEnrichedProfiles(voters);
      }, (err) => {
        console.error(err);
      })
      .then((users) => {
        for (let i = 0; i < reviews.length; i++) {
          const review = reviews[i];
          for (let j = 0; j < review.votes.length; j++) {
            const vote = review.votes[j];
            vote.voterProfile = users.find((u) => vote.voter == u.account.name);
          }
        }
        commit('SET_RESEARCH_CONTENT_REVIEWS_LIST', reviews);
      })
      .finally(() => {
        commit('SET_RESEARCH_CONTENT_REVIEWS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  async loadResearchContentReferences({ state, dispatch, commit }, { researchContentId, notify }) {
    const graph = await researchService.getResearchContentReferencesGraph(researchContentId);
    commit('SET_RESEARCH_CONTENT_REFERENCES_GRAPH_DATA', graph);
    if (notify) notify();
  },

  setDraftAuthors({ state, commit, dispatch }, authors) {
    commit('SET_DRAFT_AUTHORS_LIST', authors);
  },

  setDraftReferences({ state, commit, dispatch }, references) {
    commit('SET_DRAFT_REFERENCES_LIST', references);
  },

  async loadResearchContentMetadata({ state, commit, dispatch },
    {
      group_permlink, research_permlink, content_permlink, notify
    }) {
    commit('RESET_STATE');

    try {
      const dgp = await blockchainService.getDynamicGlobalProperties();
      const conf = await blockchainService.getConfig();
      const content = await deipRpc.api.getResearchContentByAbsolutePermlinkAsync(group_permlink, research_permlink, content_permlink);
      const millisSinceGenesis = (dgp.current_aslot * conf.DEIP_BLOCK_INTERVAL) * 1000;
      const currentMillis = new Date(`${dgp.time}Z`).getTime();
      const genesisMillis = currentMillis - millisSinceGenesis;
      const isGenesisContent = new Date(`${content.created_at}Z`).getTime() === new Date(genesisMillis).getTime();
      const research = await deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink);
      const group = await deipRpc.api.getResearchGroupByPermlinkAsync(group_permlink);

      if ( false /*!isGenesisContent */) { // TODO: recover this
        const proposals = await deipRpc.api.getProposalsByResearchGroupIdAsync(research.research_group_id);

        const contentProposal = proposals.filter((p) => p.action === PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL && p.is_completed).find((p) => {
          const data = JSON.parse(p.data);
          return data.content == content.content && data.permlink == content.permlink;
        });

        if (!contentProposal) {
          // should never happen
          throw new Error('Fatal: content proposal is not found');
        }

        // to get the block with content tx details we need to run scanning
        const startTime = contentProposal.creation_time;

        /* todo: replace approximate estimated endTime with actual values
        once we have moved this to aggreagtion server */
        const endTime = contentProposal.expiration_time;

        // var contentCreatedTimePlus10Minutes = new Date(new Date(`${content.created_at}Z`).getTime() + 1 * 60000);
        // const endTimeIso = contentCreatedTimePlus10Minutes.toISOString();
        // const endTime = endTimeIso.slice(0, endTimeIso.indexOf('.'));
        const bounds = await blockchainService.findBlocksByRange(startTime, endTime);

        let block;
        let txIdx;
        let blockNum;
        for (let i = bounds.first.num; i <= bounds.last.num; i++) {
          block = await blockchainService.getBlock(i);

          let isFound = false;

          for (let k = 0; k < block.transactions.length; k++) {
            const tx = block.transactions[k];
            const createProposalOps = tx.operations.filter((o) => o[0] === 'create_proposal');
            const contentProposals = createProposalOps.filter((o) => o[1].action === PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL);
            const wanted = contentProposals.find((p) => {
              const data = JSON.parse(p[1].data);
              return data.content === content.content && data.permlink === content.permlink;
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
        const tx = await blockchainService.getTransaction(block.transaction_ids[txIdx]);
        const txHex = await blockchainService.getTransactionHex(tx);
        // const witness = await getWitnessByAccount(block.witness)
        const witnessUser = await usersService.getEnrichedProfiles([block.witness]);
        const votersMeta = [];

        if (group.is_dao) {
          const voters = await getProposalVotesMeta(contentProposal, endTime);
          votersMeta.push(...voters);
        }

        const contentMetadata = {
          blockId: block.block_id,
          blockNum,
          research,
          content,
          timestamp: `${block.timestamp}Z`,
          witness: {
            user: witnessUser[0],
            signingKey: block.signing_key,
            signature: block.witness_signature
          },
          voters: votersMeta,
          chainId: window.env.CHAIN_ID,
          transaction: {
            id: tx.transaction_id,
            hex: txHex
          }
        };

        commit('SET_RESEARCH_CONTENT_METADATA', contentMetadata);

        async function getProposalVotesMeta(proposal, endTime) {
          const votersMeta = [];
          const sortedVotes = proposal.votes.sort((a, b) => ((a.voting_time > b.voting_time) ? 1 : ((b.voting_time > a.voting_time) ? -1 : 0)));
          const firstVote = sortedVotes[0];
          const bounds = await blockchainService.findBlocksByRange(firstVote.voting_time, endTime /* proposal.expiration_time */);

          const blocks = {};

          for (let i = 0; i < sortedVotes.length; i++) {
            const vote = sortedVotes[i];

            for (let j = bounds.first.num; j <= bounds.last.num; j++) {
              const block = blocks[j] ? blocks[j] : await blockchainService.getBlock(j);
              if (!blocks[j]) {
                blocks[j] = block;
              }
              if (block.timestamp < vote.voting_time) {
                continue;
              }

              let isFound = false;

              for (let k = 0; k < block.transactions.length; k++) {
                const tx = block.transactions[k];
                const voteProposalOp = tx.operations.find((o) => o[0] === 'vote_proposal'
                  && o[1].proposal_id == proposal.id
                  && o[1].voter === vote.voter);

                if (voteProposalOp) {
                  const metadata = voteProposalOp[1];
                  metadata.signature = tx.signatures[0];
                  const enrichedProfiles = await usersService.getEnrichedProfiles([metadata.voter]);
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
        const genesisBlock = await blockchainService.getBlock(1);
        const witnessUser = await usersService.getEnrichedProfiles([genesisBlock.witness]);

        const contentMetadata = {
          blockId: genesisBlock.block_id,
          blockNum: 1,
          research,
          content,
          timestamp: `${genesisBlock.timestamp}Z`,
          witness: {
            user: witnessUser[0],
            signingKey: genesisBlock.signing_key,
            signature: genesisBlock.witness_signature
          },
          voters: [],
          chainId: window.env.CHAIN_ID,
          transaction: null
        };

        commit('SET_RESEARCH_CONTENT_METADATA', contentMetadata);
      }
    } catch (err) {
      console.error(err);
    }
  },

  loadResearchContentEciStatsRecords({ commit }, filter) {
    return expertiseContributionsService.getResearchContentExpertiseStats(filter.research_content_external_id, filter)
      .then((stats) => {
        commit('SET_RESEARCH_CONTENT_ECI_STATS', stats);
      });
  }
};

// mutations
const mutations = {

  SET_RESEARCH_CONTENT_DETAILS(state, content) {
    state.content = content;
  },

  SET_RESEARCH_CONTENT_DISCIPLINES_LIST(state, list) {
    state.disciplinesList = list;
  },

  SET_RESEARCH_CONTENT_REVIEWS_LIST(state, list) {
    state.contentReviewsList = list;
  },

  SET_RESEARCH_CONTENT_LIST(state, list) {
    state.contentList = list;
  },

  SET_EXPERTS_LIST(state, list) {
    state.expertsList = list;
  },

  SET_RESEARCH_DETAILS(state, research) {
    state.research = research;
  },

  SET_CONTENT_PROPOSAL(state, contentProposal) {
    state.contentProposal = contentProposal;
  },

  SET_RESEARCH_CONTENT_REF(state, contentRef) {
    state.contentRef = contentRef;
  },

  SET_RESEARCH_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingResearchDetails = value;
  },

  SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingResearchContentDetails = value;
  },

  SET_RESEARCH_CONTENT_VOTES_LOADING_STATE(state, value) {
    state.isLoadingResearchContentVotes = value;
  },

  SET_RESEARCH_CONTENT_REVIEWS_LOADING_STATE(state, value) {
    state.isLoadingResearchContentReviews = value;
  },

  SET_RESEARCH_GROUP_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingResearchGroupDetails = value;
  },

  SET_RESEARCH_GROUP_MEMBERS_LIST(state, list) {
    state.membersList = list;
  },

  SET_DRAFT_AUTHORS_LIST(state, list) {
    state.contentRef.authors = list;
  },

  SET_DRAFT_REFERENCES_LIST(state, list) {
    state.contentRef.references = list;
  },

  SET_RESEARCH_CONTENT_METADATA(state, value) {
    state.contentMetadata = value;
  },

  SET_RESEARCH_GROUP_DETAILS(state, value) {
    state.group = value;
  },

  SET_RESEARCH_CONTENT_REFERENCES_GRAPH_DATA(state, graph) {
    state.researchContentReferencesGraph = graph;
  },

  SET_RESEARCH_CONTENT_ECI_STATS(state, value) {
    state.researchContentEciStatsRecords = value;
  },

  RESET_STATE(state) {
    state.contentMetadata = null;
  }
};

const namespaced = true;

export const rcdStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
