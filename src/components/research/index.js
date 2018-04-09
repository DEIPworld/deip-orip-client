import Vue from 'vue';

// components/creating
import CreateResearchPickDiscipline from './components/creating/CreateResearchPickDiscipline';
import CreateResearchPickGroup from './components/creating/CreateResearchPickGroup';
import CreateResearchMeta from './components/creating/CreateResearchMeta';
import CreateResearchShare from './components/creating/CreateResearchShare';
import CreateResearchRoadmap from './components/creating/CreateResearchRoadmap';
Vue.component('create-research-pick-discipline', CreateResearchPickDiscipline);
Vue.component('create-research-pick-group', CreateResearchPickGroup);
Vue.component('create-research-meta', CreateResearchMeta);
Vue.component('create-research-share', CreateResearchShare);
Vue.component('create-research-roadmap', CreateResearchRoadmap);

// components/details
import ResearchDetailsSidebar from './components/details/ResearchDetailsSidebar';
import ResearchDetailsBody from './components/details/ResearchDetailsBody';
Vue.component('research-details-sidebar', ResearchDetailsSidebar);
Vue.component('research-details-body', ResearchDetailsBody);

// components/feed
import ResearchFeedFilter from './components/feed/ResearchFeedFilter';
import ResearchFeedSortBy from './components/feed/ResearchFeedSortBy';
import ResearchFeedSortByItem from './components/feed/ResearchFeedSortByItem';
Vue.component('research-feed-filter', ResearchFeedFilter);
Vue.component('research-feed-sort-by', ResearchFeedSortBy);
Vue.component('research-feed-sort-by-item', ResearchFeedSortByItem);

// components/group-details
import ResearchGroupDetailsBody from './components/group-details/ResearchGroupDetailsBody';
import ResearchGroupDetailsSidebar from './components/group-details/ResearchGroupDetailsSidebar';
import ResearchGroupDetailsProposals from './components/group-details/ResearchGroupDetailsProposals';
Vue.component('research-group-details-body', ResearchGroupDetailsBody);
Vue.component('research-group-details-sidebar', ResearchGroupDetailsSidebar);
Vue.component('research-group-details-proposals', ResearchGroupDetailsProposals);

// components
import ResearchListItem from './components/ResearchListItem';
import DisciplineTreePicker from './components/DisciplineTreePicker';
import DisciplineTreeItem from './components/DisciplineTreeItem';
import ResearchCreating from './components/ResearchCreating';
import ResearchDetails from './components/ResearchDetails';
import ResearchFeed from './components/ResearchFeed';
import ResearchStartCreating from './components/ResearchStartCreating';
import StateResearchList from './components/StateResearchList';
import ResearchGroupDetails from './components/ResearchGroupDetails';
Vue.component('research-list-item', ResearchListItem);
Vue.component('discipline-tree-picker', DisciplineTreePicker);
Vue.component('discipline-tree-item', DisciplineTreeItem);
Vue.component('research-creating', ResearchCreating);
Vue.component('research-details', ResearchDetails);
Vue.component('research-feed', ResearchFeed);
Vue.component('research-start-creating', ResearchStartCreating);
Vue.component('state-research-list', StateResearchList);
Vue.component('research-group-details', ResearchGroupDetails);