import { store } from '@/store';
import { reviewsStore } from '@/features/Reviews/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  // eslint-disable-next-line no-unused-vars
  install.installed = true;

  store.registerModule('Reviews', reviewsStore);
};

const ReviewsFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ReviewsFeature);
}

export default ReviewsFeature;
