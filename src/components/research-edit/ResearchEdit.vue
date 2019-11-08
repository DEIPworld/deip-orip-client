<template>
  <base-page-layout>
    <research-edit-body slot="content"></research-edit-body>
  </base-page-layout>
</template>

<script>
import { mapGetters } from "vuex";
import deipRpc from '@deip/deip-oa-rpc-client';
import moment from 'moment';

export default {
  name: "ResearchEdit",
  
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
