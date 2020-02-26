<template>
  <v-footer dark height="auto">
    <v-card class="flex" flat tile>
      <v-card-text class="grey darken-2 pa-4">
        <v-layout row mb-5>
          <v-flex shrink mr-5>
            <div class="text-uppercase grey--text font-weight-bold mb-4">Contact info</div>
            <div>
              <div>329 East County Road 34,</div>
              <div>Ruthven, Ontario,</div>
              <div>N0P 2G0, Canada</div>
              <div>Phone: +1 647 417 0823</div>
              <div>Email: info@ar3c.com</div>
              <div>Web: www.ar3c.com</div>
            </div>
          </v-flex>
          <v-flex shrink>
            <router-link :to="{ name: 'FAQ'}" class="a grey--text font-weight-bold">FAQ</router-link>
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-card-actions class="grey darken-3 pa-4">&copy; 2020 AR3C</v-card-actions>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "FooterBar",

  data() {
    return {};
  }
};
</script>

<style scoped>
</style>