<template>
  <v-list-item :dense="dense">
    <v-list-item-action class="my-0 pt-2 rl-list-action">
      <v-btn
        icon
        color="primary"
        outlined
        @click="handleClick"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
  export default {
    name: 'ReadinessLevelListButton',
    props: {
      icon: {
        type: String,
        default: null
      },
      dense: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      handleClick() {
        this.$emit('click');
      }
    }
  };
</script>

<style lang="scss">
  .rl-list-action {
    position: relative;

    &::before {
      position: absolute;
      left: calc(50% - 1px);
      content: '';
      height: 4px;
      width: 2px;
      background: rgba(#000, .12);
    }

    &::before {
      top: 0;
    }
  }
</style>
