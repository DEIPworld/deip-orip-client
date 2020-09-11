<template>
  <v-navigation-drawer
    class="flex-shrink-0"
    :width="width"
    height="auto"
    permanent
    :right="isRight"
  >
    <div>
      <slot />
    </div>
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'DLayoutSectionSidebar',
    props: {
      left: {
        type: Boolean,
        default: false
      },
      width: {
        type: [String, Number],
        default: 280
      }
    },
    computed: {
      isRight() {
        return !this.left;
      }
    }
  };
</script>
