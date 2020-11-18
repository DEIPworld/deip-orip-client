<template>
  <v-tooltip v-bind="componentProps">
    <template #activator="{ on }">
      <component :is="tag" v-on="on">
        <slot />
      </component>
    </template>
    <span v-if="tooltip">{{ tooltip }}</span>
    <slot name="tooltip" />
  </v-tooltip>
</template>

<script>
  export default {
    name: 'DSimpleTooltip',
    props: {
      tooltip: {
        type: String,
        default: undefined
      },
      tag: {
        type: String,
        default: 'span'
      },
      position: {
        type: String,
        default: 'bottom'
      },
      openDelay: {
        type: [Number, String],
        default: 500
      },
      maxWidth: {
        type: [Number, String],
        default: 260
      },
      nudge: {
        type: [Number, String],
        default: 0
      },
      attach: {
        type: String,
        default: null
      }
    },
    computed: {
      componentProps() {
        return {
          [this.position]: true,
          openDelay: this.openDelay,
          maxWidth: this.maxWidth,
          ...(this.nudge ? { [`nudge-${this.position}`]: this.nudge } : {})
        };
      }
    }
  };
</script>
