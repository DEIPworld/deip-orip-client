<template>
  <v-layout row wrap>
    <v-flex xl12 lg12 md12 sm12 xs12>
      Activity Log
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "ActivityLogSectionGskDemo",
  props: {

  },

  computed: {
    ...mapGetters({
      user: "auth/user",
      isManager: 'auth/isManager',
      isResearcher: 'auth/isResearcher',
      isPrincipalInvestigator: 'auth/isPrincipalInvestigator',
      isProjectManager: 'auth/isProjectManager',
    })
  },

  methods: {

  },

  data() {
    return {

    }
  }
};
</script>

<style lang="less" scoped>

</style>
