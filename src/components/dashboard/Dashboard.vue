<template>
  <base-page-layout :no-sidebar="true">
    <v-container fluid fill-height pa-0 ma-0>
      <v-layout row wrap>
        <v-flex xl4 lg4 md4 sm12 xs12>
          Projects
        </v-flex>
        <v-flex xl4 lg4 md4 sm12 xs12>
          Investments
          <!-- <v-card height="100%" class="pa-4">
          </v-card> -->
        </v-flex>
        <v-flex xl4 lg4 md4 sm12 xs12>
          Reviews
        </v-flex>
      </v-layout>
    </v-container>
  </base-page-layout>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  
  computed: {
    ...mapGetters({
      user: "auth/user",
    })
  },
  data() {
    return {
    };
  },

  created() {}
};
</script>

<style lang="less" scoped>
</style>
