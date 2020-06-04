import { CustomDirective } from '@/plugins/deipAddons/CustomDirective';
import { CommonMixin } from '@/plugins/deipAddons/CommonMixin';

export const deipAddons = {
  install(_Vue) {
    _Vue.mixin(CommonMixin);
    _Vue.directive('custom', CustomDirective);
  }
};
