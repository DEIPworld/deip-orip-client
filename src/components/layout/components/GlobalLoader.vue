<template>
  <div>
    <!-- move progress bar to separate component, which should control length of filling -->
    <v-progress-linear
      class="ma-0 global-loader"
      :active="globalLoader.isLoading"
      :indeterminate="true"
      :height="3"
      background-color="white"
      background-opacity="0.4"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'GlobalLoader',

    computed: {
      ...mapGetters({
        globalLoader: 'layout/globalLoader'
      })
    },

    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
