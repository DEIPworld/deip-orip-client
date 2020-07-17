<template>
  <v-tooltip v-if="status" bottom>
    <template v-slot:activator="{ on }">
      <v-icon color="success" v-on="on">
        check_circle
      </v-icon>
    </template>
    <span>Research is {{ status }}</span>
  </v-tooltip>
</template>

<script>
  export default {
    name: 'ResearchListStatus',
    props: {
      status: {
        type: String,
        default: null
      }
    }
  };
</script>

<style scoped>

</style>
