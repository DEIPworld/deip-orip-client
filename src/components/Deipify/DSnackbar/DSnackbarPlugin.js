import { store } from '@/store';

export const DSnackbarPlugin = {
  install(Vue) {
    const show = (message = '', type = '') => {
      let payload = null;

      if (message === 'success' && !type) {
        payload = {
          message: 'Successfully!',
          type: 'success'
        };
      } else if (message === 'error' && !type) {
        payload = {
          message: 'An error occurred while sending the request, please try again later.',
          type: 'error'
        };
      } else {
        payload = {
          message,
          type
        };
      }

      store.commit('snackbar/showMessage', payload);
    };

    const hide = () => {
      store.commit('snackbar/hideMessage');
    };

    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$notifier = {
      show,
      hide
    };
  }
};
