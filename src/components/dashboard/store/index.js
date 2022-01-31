import { UserService } from '@deip/user-service';
import { ProjectService } from '@deip/project-service';
import { InvestmentsService } from '@deip/investments-service';
import { ReviewService } from '@deip/review-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { TeamService } from '@deip/team-service';

const teamService = TeamService.getInstance();
const userService = UserService.getInstance();
const projectService = ProjectService.getInstance();
const investmentsService = InvestmentsService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();
const reviewService = ReviewService.getInstance();

const state = {
  isLoadingDashboardPage: false,

  investedProjects: [],
  investedProjectShares: [],

  investingProjects: [],
  investingProjectsOngoingTokenSales: [],
  investingProjectsOngoingTokenSalesContributions: [],

  myMembershipProjects: [],
  myMembershipProjectsOngoingTokenSales: [],
  myMembershipProjectsOngoingTokenSalesContributions: [],

  bookmarkedProjects: [],
  bookmarkedProjectsOngoingTokenSales: [],
  bookmarkedProjectsOngoingTokenSalesContributions: [],

  teams: [],
  teamsMembers: [],

  expertsList: [],
  expertsExpertiseTokensList: [],

  myInvitesList: [],
  myReviewRequests: [],
  myReviews: []

};

// getters
const getters = {
  isLoadingDashboardPage: (state) => state.isLoadingDashboardPage,

  projects: (state) => {
    const unique = [
      ...state.investedProjects,
      ...state.investingProjects,
      ...state.myMembershipProjects,
      ...state.bookmarkedProjects
    ]
      .reduce((acc, project) => {
        if (acc.some((a) => a.project.id == project.id)) return acc;

        const projectMembers = state.teamsMembers
          .filter((member) => project.members.some((name) => name == member.account.name));

        const tokenSale = [
          ...state.investingProjectsOngoingTokenSales,
          ...state.myMembershipProjectsOngoingTokenSales,
          ...state.bookmarkedProjectsOngoingTokenSales
        ]
          .find((s) => s.projectId == project.id);

        const group = state.teams.find((rg) => rg.id === project.teamId);
        const isTop = false;

        if (tokenSale) {
          const tokenSaleContributions = [
            ...state.investingProjectsOngoingTokenSalesContributions,
            ...state.myMembershipProjectsOngoingTokenSalesContributions,
            ...state.bookmarkedProjectsOngoingTokenSalesContributions
          ]
            .reduce((acc, tokenSale) => {
              if (acc.some((ts) => ts.id.id == tokenSale.id)) return acc;
              return [tokenSale, ...acc];
            }, [])
            .filter((c) => c.projectTokenSaleId == tokenSale.id);

          return [...acc, {
            project: { ...project, isTop },
            authors: projectMembers,
            group,
            tokenSale,
            tokenSaleContributions
          }];
        }
        return [...acc, { project: { ...project, isTop }, authors: projectMembers, group }];
      }, []);

    unique.sort((a, b) => ((a.project.title > b.project.title) ? 1 : ((b.project.title > a.project.title) ? -1 : 0)));
    return unique;
  },

  myMembershipAndBookmarkedProjects: (state) => {
    const unique = [
      ...state.myMembershipProjects.map((item) => ({ ...item, is_following: false })),
      ...state.bookmarkedProjects.map((item) => ({ ...item, is_following: true }))
    ]
      .reduce((acc, project) => {
        if (acc.some((a) => a.project.id == project.id)) return acc;

        const projectMembers = state.teamsMembers
          .filter((member) => project.members.some((name) => name == member.account.name));

        const group = state.teams.find((rg) => rg.id === project.teamId);
        const isTop = false;

        return [...acc, { project: { ...project, isTop }, authors: projectMembers, group }];
      }, []);

    unique.sort((a, b) => ((a.project.title > b.project.title) ? 1 : ((b.project.title > a.project.title) ? -1 : 0)));
    return unique;
  },

  investments: (state) => state.investedProjects,

  reviewsOnMyProjectCount: (state, getters) => getters.projects.reduce((acc, { project }) => acc + project.number_of_negative_reviews + project.number_of_positive_reviews, 0),

  reviewsOnMyRequestsCount: (state, getters) => {
    const approvedReviews = state.myReviewRequests.filter((req) => req.status == 'approved');
    return approvedReviews.length;
  },

  myInvitesCount: (state, getters) => state.myInvitesList.length,

  myReviewsCount: (state) => state.myReviews.length,

  currentShares: (state) => state.investedProjectShares
    .map((share) => {
      const project = state.investedProjects.find((r) => r.id == share.projectId);
      return { share, project };
    })
    .filter((share) => !!share.project),

  experts: (state) => state.expertsList.map((expert) => {
    const expertiseTokens = state.expertsExpertiseTokensList.filter((exp) => exp.account_name == expert.account.name);
    return { ...expert, expertiseTokens };
  })
};

// actions
const actions = {
  loadDashboardPage({ commit, dispatch, state }, { username }) {
    commit('SET_DASHBOARD_PAGE_LOADING_STATE', true);

    const membershipProjectsLoad = new Promise((resolve, reject) => {
      dispatch('loadMembershipProjects', { username, notify: resolve });
    });
    const expertsLoad = new Promise((resolve, reject) => {
      dispatch('loadExperts', { username, notify: resolve });
    });
    const myReviewRequestsLoad = new Promise((resolve, reject) => {
      dispatch('loadMyReviewRequests', { username, notify: resolve });
    });
    const myReviewsLoad = new Promise((resolve, reject) => {
      dispatch('loadMyReviews', { username, notify: resolve });
    });

    return Promise.all([
      membershipProjectsLoad,
      expertsLoad,
      myReviewRequestsLoad,
      myReviewsLoad
    ])
      .then(() => {
        const pulled = [
          ...state.investedProjects,
          ...state.investingProjects,
          ...state.myMembershipProjects
        ].map((project) => project._id);

        const bookmarkedProjectsLoad = new Promise((resolve, reject) => {
          dispatch('loadBookmarkedProjects', { username, excludeIds: pulled, notify: resolve });
        });
        return Promise.all([
          bookmarkedProjectsLoad
        ]);
      })
      .then(() => {
        const teamIds = [
          ...state.investedProjects,
          ...state.investingProjects,
          ...state.myMembershipProjects,
          ...state.bookmarkedProjects
        ]
          .reduce((unique, project) => {
            if (unique.some((rgId) => rgId == project.teamId)) return unique;
            return [project.teamId, ...unique];
          }, []);

        return teamService.getTeams(teamIds);
      })
      .then(({ data: { items: teams } }) => {
        commit('SET_TEAMS', teams);
        return userService.getUsersByTeam(teams.map((team) => team._id));
      })
      .then(({ data: { items: result } }) => {
        const flatten1 = [].concat.apply([], result);
        const flatten2 = [].concat.apply([], flatten1);
        const teamsMembers = flatten2.reduce((unique, user) => {
          if (unique.some((name) => name == user.account.name)) return unique;
          return [user.account.name, ...unique];
        }, []);

        commit('SET_TEAMS_MEMBERS', teamsMembers);
      })
      .finally(() => {
        commit('SET_DASHBOARD_PAGE_LOADING_STATE', false);
      });
  },

  loadMembershipProjects({ commit }, { username, notify } = {}) {
    return projectService.getUserProjectListing(username)
      .then(({ data: { items } }) => {
        const projects = [].concat.apply([], items);
        commit('SET_MY_MEMBERSHIP_PROJECTS', projects);
        return Promise.all(projects.map((project) => investmentsService.getCurrentTokenSaleByProject(project._id)));
      })
      .then((res) => {
        const response = res.map((r) => (r ? r.data : r));
        const sales = response.filter((ts) => ts !== undefined);
        commit('SET_MY_MEMBERSHIP_PROJECTS_ONGOING_TOKEN_SALES', sales);
        return Promise.all(sales.map((ts) => investmentsService.getInvestmentsHistoryByTokenSale(ts._id)));
      })
      .then((res) => {
        const response = res.map(({ data: { items } }) => items)
        const contributions = [].concat.apply([], response);
        commit('SET_MY_MEMBERSHIP_PROJECTS_ONGOING_TOKEN_SALES_CONTRIBUTIONS', contributions);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadBookmarkedProjects({ commit, rootGetters }, { excludeIds, notify } = { excludeIds: [] }) {
    const user = rootGetters['auth/user'];

    const ids = user.projectBookmarks.map((b) => b.projectId).filter((id) => !excludeIds.some((rId) => rId == id));
    return Promise.all(ids.map((_id) => projectService.getProject(_id)))
      .then((res) => {
        const items = res.map(({ data }) => data)
        const projects = items.filter((r) => !!r);
        commit('SET_BOOKMARKED_PROJECTS', projects);
        return Promise.all(projects.map((project) => investmentsService.getCurrentTokenSaleByProject(project._id)));
      })
      .then((res) => {
        const response = res.map((r) => (r ? r.data : r));
        const sales = response.filter((ts) => ts !== undefined);
        commit('SET_BOOKMARKED_PROJECTS_ONGOING_TOKEN_SALES', sales);
        return Promise.all(sales.map((ts) => investmentsService.getInvestmentsHistoryByTokenSale(ts._id)));
      })
      .then((res) => {
        const response = res.map(({ data: { items } }) => items)
        const contributions = [].concat.apply([], response);
        commit('SET_BOOKMARKED_PROJECTS_ONGOING_TOKEN_SALES_CONTRIBUTIONS', contributions);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadExperts({ commit }, { username, notify } = {}) {
    userService.getUsersListing()
      .then(({ data: { items: users } }) => {
        commit('SET_EXPERTS', users.filter((u) => u.account.name == username));
        return Promise.all(users.map((user) => expertiseContributionsService.getAccountExpertiseTokens(user.account.name)));
      })
      .then((res) => {
        const tokens = res.map(({ data: { items } }) => items)
        const flatten = [].concat.apply([], tokens);
        commit('SET_EXPERTS_EXPERTISE_TOKENS', flatten);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadMyReviewRequests({ commit }, { username, notify } = {}) {
    return reviewService.getReviewRequestsByRequestor(username)
      .then(({ data: { items: reviews } }) => {
        commit('SET_MY_REVIEW_REQUESTS', reviews);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadMyReviews({ commit }, { username, notify } = {}) {
    return reviewService.getReviewsByAuthor(username)
      .then(({ data: { items: reviews } }) => {
        commit('SET_MY_REVIEWS', reviews);
      }).finally(() => {
        if (notify) notify();
      });
  }

};

// mutations
const mutations = {
  SET_DASHBOARD_PAGE_LOADING_STATE(state, value) {
    state.isLoadingDashboardPage = value;
  },

  SET_INVESTED_PROJECT_SHARES(state, list) {
    state.investedProjectShares = list;
  },

  SET_INVESTED_PROJECTS(state, list) {
    state.investedProjects = list;
  },

  SET_INVESTING_PROJECTS_ONGOING_TOKEN_SALES_CONTRIBUTIONS(state, list) {
    state.investingProjectsOngoingTokenSalesContributions = list;
  },

  SET_INVESTING_PROJECTS_ONGOING_TOKEN_SALES(state, list) {
    state.investingProjectsOngoingTokenSales = list;
  },

  SET_INVESTING_PROJECTS_TOKEN_SALES(state, list) {
    state.investingProjects = list;
  },

  SET_MY_MEMBERSHIP_PROJECTS(state, list) {
    state.myMembershipProjects = list;
  },

  SET_MY_MEMBERSHIP_PROJECTS_ONGOING_TOKEN_SALES(state, list) {
    state.myMembershipProjectsOngoingTokenSales = list;
  },

  SET_MY_MEMBERSHIP_PROJECTS_ONGOING_TOKEN_SALES_CONTRIBUTIONS(state, list) {
    state.myMembershipProjectsOngoingTokenSalesContributions = list;
  },

  SET_TEAMS(state, list) {
    state.teams = list;
  },

  SET_TEAMS_MEMBERS(state, list) {
    state.teamsMembers = list;
  },

  SET_EXPERTS(state, list) {
    state.expertsList = list;
  },

  SET_EXPERTS_EXPERTISE_TOKENS(state, list) {
    state.expertsExpertiseTokensList = list;
  },

  SET_BOOKMARKED_PROJECTS(state, list) {
    state.bookmarkedProjects = list;
  },

  SET_BOOKMARKED_PROJECTS_ONGOING_TOKEN_SALES(state, list) {
    state.bookmarkedProjectsOngoingTokenSales = list;
  },

  SET_BOOKMARKED_PROJECTS_ONGOING_TOKEN_SALES_CONTRIBUTIONS(state, list) {
    state.bookmarkedProjectsOngoingTokenSalesContributions = list;
  },

  SET_MY_INVITES(state, list) {
    state.myInvitesList = list;
  },

  SET_MY_REVIEW_REQUESTS(state, list) {
    state.myReviewRequests = list;
  },

  SET_MY_REVIEWS(state, list) {
    state.myReviews = list;
  }
};

const namespaced = true;

export const dashboardStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
