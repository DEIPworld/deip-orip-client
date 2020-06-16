<template>
  <v-footer height="auto" v-bind="$themeSettings.footer" class="pa-0">
    <v-sheet color="grey darken-2" width="100%" class="pa-6" tile>
      <v-row>
        <v-col cols="auto">
          <div class="text-uppercase grey--text font-weight-bold mb-4">Contact info</div>
          <div class="body-2">
            <div>Phone: +1 647 417 0823</div>
            <div>Email: info@ar3c.com</div>
            <div>Web: www.ar3c.com</div>
          </div>
        </v-col>
        <v-col cols="auto">
          <router-link :to="{ name: 'FAQ'}" class="a grey--text font-weight-bold">FAQ</router-link>
        </v-col>
      </v-row>
    </v-sheet>
    <v-sheet color="body-2 grey darken-3" width="100%" class="pa-6" tile>
      &copy; 2020 AR3C
    </v-sheet>
  </v-footer>
</template>

<script>
  export default {
    name: 'FooterBar',

    data() {
      return {};
    }
  };
</script>

<style scoped>
</style>
