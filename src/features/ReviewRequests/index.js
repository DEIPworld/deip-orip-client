import { store } from '@/store';
import { reviewRequestsStore } from '@/features/ReviewRequests/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  store.registerModule('ReviewRequests', reviewRequestsStore);
};

const ReviewRequestsFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ReviewRequestsFeature);
}

export default ReviewRequestsFeature;
