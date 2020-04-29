<template>
  <base-page-layout>
    <research-edit-body />
  </base-page-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import moment from 'moment';

  export default {
    name: 'ResearchEdit',

    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    data() {
      return {
      };
    },

    created() {
    },

    methods: {
    }
  };
</script>

<style lang="less" scoped>

</style>
