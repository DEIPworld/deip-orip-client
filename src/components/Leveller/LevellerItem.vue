<template>
  <v-list-item :dense="dense" class="d-stepper-step">
    <v-list-item-icon
      class="ma-0 align-self-stretch"
    >
      <leveller-num class="mr-4" :height="ctrlHeight" :num="dotNum" />
    </v-list-item-icon>
    <v-list-item-content class="py-0">
      <v-list-item-title>
        <slot />
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-action
      v-if="$hasSlot('action')"
      class="my-0 align-self-start align-center"
      :style="{height: ctrlHeight + 'px'}"
    >
      <slot name="action" />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
  import LevellerNum from '@/components/Leveller/LevellerNum';

  export default {
    name: 'LevellerItem',
    components: { LevellerNum },
    props: {
      dotNum: {
        type: Number,
        default: null
      },
      dense: Boolean,
      ctrlHeight: {
        type: Number,
        default: 40
      }
    }
  };
</script>

<style lang="scss">
  .d-stepper-step {
    .v-list-item__icon {
      height: auto;
    }
  }
</style>
