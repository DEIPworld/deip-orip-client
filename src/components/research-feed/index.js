import Vue from 'vue'

import ResearchFeedFilter from './components/ResearchFeedFilter';
import ResearchFeedOrderBy from './components/ResearchFeedOrderBy';
import ResearchFeedOrderByItem from './components/ResearchFeedOrderByItem';
import ResearchListItem from './components/ResearchListItem';
import ResearchFeedListItem from './components/ResearchFeedListItem';
import ResearchFeed from './ResearchFeed';

Vue.component('research-feed-filter', ResearchFeedFilter);
Vue.component('research-feed-order-by', ResearchFeedOrderBy);
Vue.component('research-feed-order-by-item', ResearchFeedOrderByItem);
Vue.component('research-list-item', ResearchListItem);
Vue.component('research-feed-list-item', ResearchFeedListItem);
Vue.component('research-feed', ResearchFeed);