<template>
  <v-sheet class="d-flex">
    <v-sheet class="d-flex flex-column align-center" :width="40" :min-height="40">
      <div :style="lineTopStyle" class="mb-1" />
      <v-avatar
        :size="dotSize"
        :color="dotColor"
        class="d-flex flex-shrink-0 flex-grow-0"
      >
        {{ dotText }}
        <slot name="dot" />
      </v-avatar>
      <div :style="lineBottomStyle" class="mt-1 flex-grow-1 flex-shrink-1" />
    </v-sheet>
    <div class="spacer my-2 ml-4 align-self-center">
      <slot />
    </div>
    <div
      v-if="$hasSlot('action')"
      class="d-flex align-self-start align-center ml-4 my-2"
      :style="{ height: ctrlHeight + 'px' }"
    >
      <slot name="action" />
    </div>
  </v-sheet>
</template>

<script>
  export default {
    name: 'DTimelineItem',
    props: {
      dotText: {
        type: [String, Number],
        default: ''
      },
      dotTop: {
        type: Number,
        default: 4
      },
      dotSize: {
        type: Number,
        default: 24
      },
      dotColor: {
        type: String,
        default: 'primary'
      },

      ctrlHeight: {
        type: Number,
        default: 40
      },

      lineColor: {
        type: String,
        default: 'rgba(26, 27, 34, 0.12)'
      },
      lineWidth: {
        type: Number,
        default: 2
      },
      lineTop: {
        type: Boolean,
        default: true
      },
      lineBottom: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      lineStyle() {
        return {
          width: `${this.lineWidth}px`,
          background: this.lineColor
        };
      },
      lineTopStyle() {
        return {
          minHeight: `${this.dotTop}px`,
          ...this.lineStyle,
          ...(!this.lineTop ? { opacity: 0 } : {})
        };
      },
      lineBottomStyle() {
        return {
          ...this.lineStyle,
          ...(!this.lineBottom ? { opacity: 0 } : {})
        };
      }
    }
  };
</script>
