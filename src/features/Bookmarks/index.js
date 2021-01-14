import { store } from '@/store';
import { bookmarksStore } from '@/features/Bookmarks/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  store.registerModule('Bookmarks', bookmarksStore);
};

const BookmarksFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(BookmarksFeature);
}

export default BookmarksFeature;
