<template>
  <router-view v-if="$ready" />
</template>

<script>
  export default {
    name: 'Content',
    props: {
      contentId: {
        type: String,
        required: true
      }
    },
    created() {
      this.$setReady();
    }
  };
</script>
