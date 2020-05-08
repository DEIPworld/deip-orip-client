<template>
  <v-list-item :dense="dense">
    <v-list-item-avatar :class="{'rl-num': !clean}" class="my-0 align-self-stretch" height="auto">
      <v-avatar color="primary" size="24">
        <span class="white--text caption font-weight-medium">{{ dotNum }}</span>
      </v-avatar>
    </v-list-item-avatar>
    <v-list-item-content class="py-0">
      <v-list-item-title>
        <slot />
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-action v-if="hasSlot('action')">
      <slot name="action" />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
  export default {
    name: 'LevellerItem',
    props: {
      dotNum: {
        type: Number,
        default: null
      },
      dense: Boolean,
      clean: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      hasSlot(name) {
        return this.$slots[name] !== undefined;
      }
    }
  };
</script>

<style lang="scss">
  .rl-num {
    &::before,
    &::after {
      position: absolute;
      left: calc(50% - 1px);
      content: '';
      height: calc(50% - 16px);
      width: 2px;
      background: rgba(#000, .12);
    }

    &::before {
      top: 0;
    }

    &::after {
      bottom: 0;
    }
  }
</style>
