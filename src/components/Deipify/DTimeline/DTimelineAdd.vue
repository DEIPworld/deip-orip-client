<template>
  <v-btn
    class="mt-1"
    icon
    color="primary"
    outlined
    @click="handleClick"
  >
    <v-icon>{{ icon }}</v-icon>
  </v-btn>
</template>

<script>
  export default {
    name: 'DTimelineAdd',
    props: {
      icon: {
        type: String,
        default: 'add'
      },
    },
    methods: {
      handleClick() {
        this.$emit('click');
      }
    }
  };
</script>

<style scoped>

</style>
