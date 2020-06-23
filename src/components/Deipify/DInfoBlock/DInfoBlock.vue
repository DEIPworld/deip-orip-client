<template>
  <div :class="componentClassList">
    <h4
      v-if="title"
      class="text-subtitle-1 font-weight-medium mb-2"
    >
      {{ title }}
    </h4>
    <div class="text--primary">
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DInfoBlock',
    props: {
      title: {
        type: String,
        default: null
      },
      isLast: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      componentClassList() {
        return {
          'mb-6': !this.isLast
        };
      }
    }
  };
</script>

<style scoped>

</style>
