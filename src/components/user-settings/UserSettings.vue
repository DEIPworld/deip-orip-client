<template>
  <base-page-layout>
    <user-settings-body slot="content"></User-settings-body>
  </base-page-layout>
</template>

<script>
import { mapGetters } from "vuex";
import deipRpc from '@deip/deip-oa-rpc-client';
import moment from 'moment';

export default {
  name: "UserSettings",
  
  computed: {
    ...mapGetters({
      user: "auth/user"
    }),
  },
  data() {
    return {
    };
  },

  methods: {
  },

  created() {
  }
};
</script>

<style lang="less" scoped>

</style>
