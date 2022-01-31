import _ from 'lodash';
import { ProjectService } from '@deip/project-service';
import { UserService } from '@deip/user-service';
import { ProjectContentService } from '@deip/project-content-service';
import { ReviewService } from '@deip/review-service';
import { ProposalsService } from '@deip/proposals-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { TeamService } from '@deip/team-service';
import { DomainsService } from '@deip/domains-service';
import { PROPOSAL_TYPES, PROJECT_CONTENT_STATUS, PROJECT_CONTENT_FORMAT } from '@/variables';

const teamService = TeamService.getInstance();
const projectService = ProjectService.getInstance();
const userService = UserService.getInstance();
const projectContentService = ProjectContentService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();
const proposalsService = ProposalsService.getInstance();
const reviewService = ReviewService.getInstance();
const domainsService = DomainsService.getInstance();

const state = {
  content: {},
  project: {},
  group: {},
  domainsList: [],
  membersList: [],
  contentList: [],
  contentReviewsList: [],
  expertsList: [],
  projectContentReferencesGraph: [],
  contentProposal: undefined,
  contentRef: null,
  projectContentEciStatsRecords: null,

  isLoadingProjectContentVotes: undefined,
  isLoadingProjectDetails: undefined,
  isLoadingProjectContentDetails: undefined,
  isLoadingProjectContentReviews: undefined,
  isLoadingTeamDetails: undefined,

  contentMetadata: null
};

// getters
const getters = {

  content: (state, getters) => state.content,

  project: (state, getters) => state.project,

  group: (state, getters) => state.group,

  contentProposal: (state) => state.contentProposal,

  domainsList: (state, getters) => state.domainsList,

  contentList: (state, getters) => state.contentList,

  contentReviewsList: (state, getters) => state.contentReviewsList,

  expertsList: (state, getters) => state.expertsList,

  contentRef: (state, getters) => state.contentRef,

  projectContentEciStatsRecords: (state) => state.projectContentEciStatsRecords,

  isFilePackageContent(state, getters, rootState, rootGetters) {
    return state.contentRef && (state.contentRef.formatType === PROJECT_CONTENT_FORMAT.PACKAGE
        || state.contentRef.formatType === PROJECT_CONTENT_FORMAT.FILE /* legacy */);
  },

  isDarContent(state, getters, rootState, rootGetters) {
    return state.contentRef && state.contentRef.formatType === PROJECT_CONTENT_FORMAT.DAR;
  },

  isInProgress(state, getters, rootState, rootGetters) {
    return state.contentRef && state.contentRef.status === PROJECT_CONTENT_STATUS.IN_PROGRESS;
  },

  isPublished(state, getters, rootState, rootGetters) {
    return state.content != null;
  },

  isProposed(state, getters, rootState, rootGetters) {
    return state.contentRef && state.contentRef.status === PROJECT_CONTENT_STATUS.PROPOSED;
  },

  isPersonalGroup(state, getters, rootState, rootGetters) {
    const userPersonalGroup = rootGetters['auth/userPersonalGroup'];
    return state.project.teamId == userPersonalGroup.id;
  },

  isTeamMember(state, getters, rootState, rootGetters) {
    const isMember = rootGetters['auth/userIsTeamMember'](state.project.teamId);
    return isMember;
  },

  userHasReview(state, getters, rootState, rootGetters) {
    const user = rootGetters['auth/user'];
    const userHasReview = getters.contentReviewsList.some((r) => r.author.account.name === user.username);
    return userHasReview;
  },

  userHasProjectExpertise(state, getters, rootState, rootGetters) {
    const userExperiseList = rootGetters['auth/userExperise'];
    return userExperiseList.some((exp) => exp.amount > 0 && state.project.domains.some((id) => id == exp.domainId));
  },

  isCreatingReviewAvailable(state, getters, rootState, rootGetters) {
    return !getters.isTeamMember && !getters.userHasReview && getters.userHasProjectExpertise && getters.isPublished;
  },

  isSavingDraftAvailable(state, getters, rootState, rootGetters) {
    return getters.isTeamMember && getters.isDarContent && getters.isInProgress;
  },

  membersList: (state, getters) => state.membersList,

  projectMembersList: (state, getters) => state.membersList
    .filter((member) => state.project.members.some((m) => m == member.account.name)),

  contentMetadata: (state, getters) => state.contentMetadata,

  projectContentReferencesGraph: (state, getters) => {
    const nodes = [];
    for (let i = 0; i < state.projectContentReferencesGraph.nodes.length; i++) {
      const node = state.projectContentReferencesGraph.nodes[i];
      nodes.push({ ...node });
    }

    const links = [];
    for (let i = 0; i < state.projectContentReferencesGraph.links.length; i++) {
      const link = state.projectContentReferencesGraph.links[i];
      links.push({ ...link });
    }

    return { nodes, links };
  }
};

// actions
const actions = {

  loadProjectContentDetails({ state, commit, dispatch }, { projectId, contentId, ref, isReferencesPage }) {
    commit('RESET_STATE');
    return dispatch('loadProjectDetails', { projectId })
      .then(() => {
        if (!contentId || contentId === '!draft') { // this is a draft that is not published yet
          commit('SET_PROJECT_CONTENT_DETAILS_LOADING_STATE', true);
          const contentRefLoad = new Promise((resolve, reject) => {
            dispatch('loadProjectContentRef', {
              projectId: state.project._id,
              refId: ref,
              notify: resolve,
              isReferencesPage: false
            });
          });

          return Promise.all([contentRefLoad])
            .finally(() => {
              commit('SET_PROJECT_CONTENT_DETAILS_LOADING_STATE', false);
            });
        }

        commit('SET_PROJECT_CONTENT_DETAILS_LOADING_STATE', true);
        return projectContentService.getProjectContent(contentId)
          .then(({ data: contentObj }) => {
            commit('SET_PROJECT_CONTENT_DETAILS', contentObj);
            const contentRefLoad = new Promise((resolve, reject) => {
              dispatch('loadProjectContentRef', {
                projectId: state.project._id,
                refId: contentId,
                notify: resolve
              });
            });

            const contentReviewsLoad = new Promise((resolve, reject) => {
              dispatch('loadContentReviews', { contentId: contentObj._id, notify: resolve });
            });

            const contentVotesLoad = new Promise((resolve, reject) => {
              dispatch('loadProjectContentVotes', { projectId: contentObj.projectId, notify: resolve });
            });
            isReferencesPage

            const loading = [
              contentRefLoad,
              contentReviewsLoad,
              contentVotesLoad,
              dispatch('loadProjectContentEciStatsRecords', { projectContentId: contentObj._id })
            ];

            if (isReferencesPage) {
              loading.push(dispatch('loadProjectContentReferences', contentObj._id));
            }

            return Promise.all(loading);
          }, (err) => {
            console.error(err);
          })
          .finally(() => {
            commit('SET_PROJECT_CONTENT_DETAILS_LOADING_STATE', false);
          });
      });
  },

  loadProjectContentVotes({ state, commit }, { projectId, notify }) {
    commit('SET_PROJECT_CONTENT_VOTES_LOADING_STATE', true);
    const domainsList = [];

    domainsService.getDomainsByProject(projectId)
      .then(({ data: { items: data } }) => {
        const expertsPromises = [];

        for (let i = 0; i < data.length; i++) {
          const domain = data[i];
          domainsList.push(domain);
          expertsPromises.push(expertiseContributionsService.getDomainExpertiseTokens(domain._id));
        }

        return Promise.all(expertsPromises);
      })
      .then((res) => {
        const expertTokensPerDomain = res.map(({ data: { items } }) => items)
        const expertsAccountNames = [];
        expertTokensPerDomain.forEach((e) => {
          expertsAccountNames.push(...e.map((et) => et.account_name));
        });
        commit('SET_PROJECT_CONTENT_DOMAINS_LIST', domainsList);
        return userService.getUsers(_.uniq(expertsAccountNames));
      }).then(({ data: { items: expertsList } }) => {
        commit('SET_EXPERTS_LIST', expertsList);
      })
      .finally(() => {
        commit('SET_PROJECT_CONTENT_VOTES_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadProjectDetails({ state, commit, dispatch }, { projectId }) {
    commit('SET_PROJECT_DETAILS_LOADING_STATE', true);

    return projectService.getProject(projectId)
      .then(({ data: project }) => {
        commit('SET_PROJECT_DETAILS', project);
        return userService.getUsersByTeam(project.teamId);
      })
      .then(({ data: { items: users } }) => {
        commit('SET_TEAM_MEMBERS_LIST', users);
        return projectContentService.getProjectContentsByProject(projectId);
      })
      .then(({ data: { items: list } }) => {
        commit('SET_PROJECT_CONTENT_LIST', list);
      })
      .finally(() => {
        commit('SET_PROJECT_DETAILS_LOADING_STATE', false);
      });
  },

  loadTeamDetails({ state, commit, dispatch }, { teamId }) {
    commit('SET_TEAM_DETAILS_LOADING_STATE', true);
    return teamService.getTeam(teamId)
      .then(({ data: team }) => {
        commit('SET_TEAM_DETAILS', team);
        return team;
      }, (err) => {
        console.error(err);
      })
      .finally(() => {
        commit('SET_TEAM_DETAILS_LOADING_STATE', false);
      });
  },

  loadProjectContentRef({ state, commit, dispatch }, { refId, projectId, notify }) {
    return projectContentService.getProjectContentRef(refId)
      .then(({ data: contentRef }) => {
        commit('SET_PROJECT_CONTENT_REF', contentRef);
        return dispatch('loadTeamDetails', { teamId: contentRef.teamId });
      })
      .then((team) => proposalsService.getProposalsByCreator(team._id))
      .then(({ data: { items: proposals } }) => {
        const { contentRef } = state;
        const contentProposal = proposals.filter((p) => p.action === PROPOSAL_TYPES.CREATE_PROJECT_MATERIAL).find((p) => p.payload.content == contentRef.hash && p.payload.projectId == projectId);
        commit('SET_CONTENT_PROPOSAL', contentProposal || null);
      })
      .catch((err) => { console.error(err); })
      .finally(() => {
        commit('SET_PROJECT_DETAILS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadContentReviews({ state, dispatch, commit }, { contentId, notify }) {
    const reviews = [];
    commit('SET_PROJECT_CONTENT_REVIEWS_LOADING_STATE', true);
    reviewService.getReviewsByProjectContent(contentId)
      .then(({ data: { items } }) => {
        reviews.push(...items);
        return Promise.all([
          Promise.all(reviews.map((item) => reviewService.getReviewUpvotes(item._id))),
          userService.getUsers(reviews.map((r) => r.author))
        ]);
      })
      .then(([res, { data: { items: users } }]) => {
        const votes = res.map(({ data: { items } }) => items)
        const voters = [];
        for (let i = 0; i < reviews.length; i++) {
          const review = reviews[i];
          review.author = users.find((u) => u.account.name == review.author);

          const reviewVotes = votes[i].reduce((arr, vote) => (arr.some(({ upvoter }) => upvoter === vote.upvoter) ? arr : [...arr, vote]), []);
          review.votes = reviewVotes;

          for (let j = 0; j < reviewVotes.length; j++) {
            const vote = reviewVotes[j];
            if (!voters.some((v) => v == vote.upvoter)) {
              voters.push(vote.upvoter);
            }
          }
        }

        return userService.getUsers(voters);
      })
      .then(({ data: { items: users } }) => {
        for (let i = 0; i < reviews.length; i++) {
          const review = reviews[i];
          for (let j = 0; j < review.votes.length; j++) {
            const vote = review.votes[j];
            vote.voterProfile = users.find((u) => vote.upvoter == u.account.name);
          }
        }
        commit('SET_PROJECT_CONTENT_REVIEWS_LIST', reviews);
      })
      .finally(() => {
        commit('SET_PROJECT_CONTENT_REVIEWS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadProjectContentReferences({ state, dispatch, commit }, projectContentId) {
    let graph = {};
    return projectContentService.getProjectContentReferencesGraph(projectContentId)
      .then(({ data: graphData }) => {
        graph = graphData;
        return Promise.all(graphData.nodes.map(
          ({ team }) => teamService.getTeam(team._id)
        ));
      })
      .then((res) => {
        const teams = res.map(({ data }) => data)
        graph.nodes = graph.nodes.map((n) => ({
          ...n,
          team: teams.find(
            (rg) => rg._id === n.teamId
          ) || n.teamId
        }));
        commit('SET_PROJECT_CONTENT_REFERENCES_GRAPH_DATA', graph);
      });
  },

  setDraftAuthors({ state, commit, dispatch }, authors) {
    commit('SET_DRAFT_AUTHORS_LIST', authors);
  },

  setDraftReferences({ state, commit, dispatch }, references) {
    commit('SET_DRAFT_REFERENCES_LIST', references);
  },

  async loadProjectContentMetadata({ state, commit, dispatch }, { notify }) {
    // TODO: use plugin
    commit('RESET_STATE');
    if (notify) notify();
  },

  loadProjectContentEciStatsRecords({ commit }, filter) {
    return expertiseContributionsService.getProjectContentExpertiseStats(filter.projectContentId, filter)
      .then(({ data: { items: stats } }) => {
        commit('SET_PROJECT_CONTENT_ECI_STATS', stats);
      });
  }
};

// mutations
const mutations = {

  SET_PROJECT_CONTENT_DETAILS(state, content) {
    state.content = content;
  },

  SET_PROJECT_CONTENT_DOMAINS_LIST(state, list) {
    state.domainsList = list;
  },

  SET_PROJECT_CONTENT_REVIEWS_LIST(state, list) {
    state.contentReviewsList = list;
  },

  SET_PROJECT_CONTENT_LIST(state, list) {
    state.contentList = list;
  },

  SET_EXPERTS_LIST(state, list) {
    state.expertsList = list;
  },

  SET_PROJECT_DETAILS(state, project) {
    state.project = project;
  },

  SET_CONTENT_PROPOSAL(state, contentProposal) {
    state.contentProposal = contentProposal;
  },

  SET_PROJECT_CONTENT_REF(state, contentRef) {
    state.contentRef = contentRef;
  },

  SET_PROJECT_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingProjectDetails = value;
  },

  SET_PROJECT_CONTENT_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingProjectContentDetails = value;
  },

  SET_PROJECT_CONTENT_VOTES_LOADING_STATE(state, value) {
    state.isLoadingProjectContentVotes = value;
  },

  SET_PROJECT_CONTENT_REVIEWS_LOADING_STATE(state, value) {
    state.isLoadingProjectContentReviews = value;
  },

  SET_TEAM_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingTeamDetails = value;
  },

  SET_TEAM_MEMBERS_LIST(state, list) {
    state.membersList = list;
  },

  SET_DRAFT_AUTHORS_LIST(state, list) {
    state.contentRef.authors = list;
  },

  SET_DRAFT_REFERENCES_LIST(state, list) {
    state.contentRef.references = list;
  },

  SET_PROJECT_CONTENT_METADATA(state, value) {
    state.contentMetadata = value;
  },

  SET_TEAM_DETAILS(state, value) {
    state.group = value;
  },

  SET_PROJECT_CONTENT_REFERENCES_GRAPH_DATA(state, graph) {
    state.projectContentReferencesGraph = graph;
  },

  SET_PROJECT_CONTENT_ECI_STATS(state, value) {
    state.projectContentEciStatsRecords = value;
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
