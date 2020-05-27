<template>
  <v-container fluid class="pa-0 fill-height">
    <div class="ma-auto">
      <div class="font-20px bold">
        Would you like to import an exising research or create a new one?
      </div>
      <div class="text-align-center pt-6">
        <v-btn
          large
          color="primary"
          dark
          class="ma-0"
          to="/create-new-research"
        >
          Create new
        </v-btn>
      </div>
      <!--    <div class="text-align-center pt-6">
                <span class="a">Import exising standalone publication</span>
            </div> -->
    </div>
  </v-container>
</template>

<script>
  export default {
    name: 'ResearchStartCreating',

    data() {
      return {};
    }
  };
</script>

<style lang="less" scoped>
</style>
