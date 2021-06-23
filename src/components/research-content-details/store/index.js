import _ from 'lodash';
import { ProjectService } from '@deip/project-service';
import { UserService } from '@deip/user-service';
import { ResearchContentService } from '@deip/research-content-service';
import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
import { ProposalsService } from '@deip/proposals-service';
import { BlockchainService } from '@deip/blockchain-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { TeamService } from '@deip/team-service';
import { DomainsService } from '@deip/domains-service';
import { PROPOSAL_TYPES, EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';

const teamService = TeamService.getInstance();
const projectService = ProjectService.getInstance();
const userService = UserService.getInstance();
const researchContentService = ResearchContentService.getInstance();
const blockchainService = BlockchainService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();
const proposalsService = ProposalsService.getInstance();
const researchContentReviewsService = ResearchContentReviewsService.getInstance();
const domainsService = DomainsService.getInstance();

const state = {
  content: {},
  research: {},
  group: {},
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
    return userExperiseList.some((exp) => exp.amount > 0 && state.research.disciplines.some((d) => d.id == exp.discipline_id));
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
  }
};

// actions
const actions = {

  loadResearchContentDetails({ state, commit, dispatch }, { projectId, contentId, ref, isReferencesPage }) {
    commit('RESET_STATE');
    return dispatch('loadResearchDetails', { projectId })
      .then(() => {
        if (!contentId || contentId === '!draft') { // this is a draft that is not published yet
          commit('SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE', true);
          const contentRefLoad = new Promise((resolve, reject) => {
            dispatch('loadResearchContentRef', {
              projectId: state.research.external_id,
              refId: ref,
              notify: resolve,
              isReferencesPage: false
            });
          });

          return Promise.all([contentRefLoad])
            .finally(() => {
              commit('SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE', false);
            });
        }

        commit('SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE', true);
        return researchContentService.getResearchContent(contentId)
          .then((contentObj) => {
            commit('SET_RESEARCH_CONTENT_DETAILS', contentObj);
            const contentRefLoad = new Promise((resolve, reject) => {
              dispatch('loadResearchContentRef', {
                projectId: state.research.external_id,
                refId: contentId,
                notify: resolve
              });
            });

            const contentReviewsLoad = new Promise((resolve, reject) => {
              dispatch('loadContentReviews', { contentId: contentObj.external_id, notify: resolve });
            });

            const contentVotesLoad = new Promise((resolve, reject) => {
              dispatch('loadResearchContentVotes', { researchId: contentObj.research_external_id, notify: resolve });
            });
            isReferencesPage

            const loading = [
              contentRefLoad,
              contentReviewsLoad,
              contentVotesLoad,
              dispatch('loadResearchContentEciStatsRecords', { research_content_external_id: contentObj.external_id })
            ];

            if (isReferencesPage) {
              loading.push(dispatch('loadResearchContentReferences', contentObj.external_id));
            }

            return Promise.all(loading);
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

    domainsService.getDomainsByProject(researchId)
      .then((data) => {
        const expertsPromises = [];

        for (let i = 0; i < data.length; i++) {
          const discipline = data[i];
          disciplinesList.push(discipline);
          expertsPromises.push(expertiseContributionsService.getDisciplineExpertiseTokens(discipline.externalId));
        }

        return Promise.all([
          Promise.all(expertsPromises)
        ]);
      })
      .then(([expertTokensPerDiscipline]) => {
        const expertsAccountNames = [];
        expertTokensPerDiscipline.forEach((e) => {
          expertsAccountNames.push(...e.map((et) => et.account_name));
        });
        commit('SET_RESEARCH_CONTENT_DISCIPLINES_LIST', disciplinesList);
        return userService.getUsers(_.uniq(expertsAccountNames));
      }).then((expertsList) => {
        commit('SET_EXPERTS_LIST', expertsList);
      })
      .finally(() => {
        commit('SET_RESEARCH_CONTENT_VOTES_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchDetails({ state, commit, dispatch }, { projectId }) {
    commit('SET_RESEARCH_DETAILS_LOADING_STATE', true);

    return projectService.getProject(projectId)
      .then((research) => {
        commit('SET_RESEARCH_DETAILS', research);
        return userService.getUsersByTeam(research.research_group.external_id);
      })
      .then((users) => {
        commit('SET_RESEARCH_GROUP_MEMBERS_LIST', users);
        return researchContentService.getResearchContentAndDraftsByResearch(projectId);
      })
      .then((list) => {
        commit('SET_RESEARCH_CONTENT_LIST', list);
      })
      .finally(() => {
        commit('SET_RESEARCH_DETAILS_LOADING_STATE', false);
      });
  },

  loadResearchGroupDetails({ state, commit, dispatch }, { teamId }) {
    commit('SET_RESEARCH_GROUP_DETAILS_LOADING_STATE', true);
    return teamService.getTeam(teamId)
      .then((team) => {
        commit('SET_RESEARCH_GROUP_DETAILS', team);
        return team;
      }, (err) => {
        console.error(err);
      })
      .finally(() => {
        commit('SET_RESEARCH_GROUP_DETAILS_LOADING_STATE', false);
      });
  },

  loadResearchContentRef({ state, commit, dispatch }, { refId, projectId, notify }) {
    return researchContentService.getResearchContentRef(refId)
      .then((contentRef) => {
        commit('SET_RESEARCH_CONTENT_REF', contentRef);
        return dispatch('loadResearchGroupDetails', { teamId: contentRef.researchGroupExternalId });
      })
      .then((team) => proposalsService.getProposalsByCreator(team.external_id))
      .then((proposals) => {
        const { contentRef } = state;
        const contentProposal = proposals.filter((p) => p.action === PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL).find((p) => p.payload.content == contentRef.hash && p.payload.research_external_id == projectId);
        commit('SET_CONTENT_PROPOSAL', contentProposal || null);
      })
      .catch((err) => { console.error(err); })
      .finally(() => {
        commit('SET_RESEARCH_DETAILS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadContentReviews({ state, dispatch, commit }, { contentId, notify }) {
    const reviews = [];
    commit('SET_RESEARCH_CONTENT_REVIEWS_LOADING_STATE', true);
    researchContentReviewsService.getReviewsByResearchContent(contentId)
      .then((items) => {
        reviews.push(...items);
        return Promise.all([
          Promise.all(reviews.map((item) => researchContentReviewsService.getReviewVotes(item.external_id))),
          userService.getUsers(reviews.map((r) => r.author))
        ]);
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

        return userService.getUsers(voters);
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

  loadResearchContentReferences({ state, dispatch, commit }, researchContentId) {
    let graph = {};
    return researchContentService.getResearchContentReferencesGraph(researchContentId)
      .then((graphData) => {
        graph = graphData;
        return Promise.all(graphData.nodes.map(
          ({ researchGroup }) => teamService.getTeam(researchGroup.external_id)
        ));
      })
      .then((researchGroups) => {
        graph.nodes = graph.nodes.map((n) => ({
          ...n,
          researchGroup: researchGroups.find(
            (rg) => rg.external_id === n.researchGroup.external_id
          ) || n.researchGroup.external_id
        }));
        commit('SET_RESEARCH_CONTENT_REFERENCES_GRAPH_DATA', graph);
      });
  },

  setDraftAuthors({ state, commit, dispatch }, authors) {
    commit('SET_DRAFT_AUTHORS_LIST', authors);
  },

  setDraftReferences({ state, commit, dispatch }, references) {
    commit('SET_DRAFT_REFERENCES_LIST', references);
  },

  async loadResearchContentMetadata({ state, commit, dispatch }, { notify }) {
    // TODO: use plugin
    commit('RESET_STATE');
    if (notify) notify();
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
