<template>
  <modal-route-view :title="title">
    qwe
  </modal-route-view>
</template>

<script>
  import ModalRouteView from '@/components/layout/ModalRouteView';
  import moment from 'moment';
  import deipRpc from '@deip/rpc-client';
  import { AuthService } from '@deip/auth-service';
  import _ from 'lodash';

  import { mapGetters } from 'vuex';

  const authService = AuthService.getInstance();

  export default {
    name: 'AdminQuestionEdit',
    components: { ModalRouteView },
    props: {
      title: {
        type: String,
        default: 'Sign Up'
      },
      hideAgree: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {};
    },
    created() {
      console.log(2);
    }
  };
</script>

<style scoped>
</style>
