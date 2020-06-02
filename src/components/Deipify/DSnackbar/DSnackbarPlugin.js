import { store } from '@/store';

export const DSnackbarPlugin = {
  install(Vue) {
    const showSuccess = (message = 'error') => {
      store.commit('snackbar/showMessage', {
        message: message === 'error'
          ? 'Successfully!'
          : message,
        type: 'success'
      });
    };

    const showError = (message = 'error') => {
      store.commit('snackbar/showMessage', {
        message: message === 'error'
          ? 'An error occurred while sending the request, please try again later.'
          : message,
        type: 'error'
      });
    };

    const show = (message = '', type = '') => {
      if (message === 'success' && !type) {
        showSuccess();
      } else if (message === 'error' && !type) {
        showError();
      } else {
        store.commit('snackbar/showMessage', {
          message,
          type
        });
      }
    };

    const hide = () => {
      store.commit('snackbar/hideMessage');
    };

    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$notifier = {
      showSuccess,
      showError,
      show,
      hide
    };
  }
};
