<template>
  <v-sheet class="d-flex">
    <v-sheet class="d-flex flex-column align-center" :width="40" :min-height="40">
      <div
        :class="$style['top-stroke']"
        :style="{ minHeight: dotTop + 'px' }"
      />
      <v-avatar
        :size="dotSize"
        :color="dotColor"
        class="d-flex flex-shrink-0 flex-grow-0"
      >
        {{ dotText }}
        <slot name="dot" />
      </v-avatar>
      <div :class="$style['bottom-stroke']" />
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
      }
    }
  };
</script>

<style module>
  .top-stroke {
    width: 2px;
    background: rgba(26, 27, 34, 0.12);
    margin-bottom: 4px;
  }

  .bottom-stroke {
    margin-top: 4px;
    flex: 1;
    width: 2px;
    background: rgba(26, 27, 34, 0.12);
  }
</style>
