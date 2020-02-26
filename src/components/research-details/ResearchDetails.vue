<template>
  <v-card class="fill-height pb-5">
    <base-page-layout>
      <research-details-header slot="header"></research-details-header>
      <research-details-body slot="content"></research-details-body>
      <research-details-sidebar slot="right-sidebar"></research-details-sidebar>
    </base-page-layout>
  </v-card>
</template>

<script>
export default {
  name: "ResearchDetails"
};
</script>

<style scoped>
</style>
