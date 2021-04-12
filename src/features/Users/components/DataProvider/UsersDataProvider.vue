<template>
  <router-view v-if="$ready" />
</template>

<script>

  export default {
    name: 'UsersDataProvider',
    props: {
      username: {
        type: String,
        default: 'undefined',
        required: true
      }
    },
    created() {
      this.$store
        .dispatch('Users/get', this.username)
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
