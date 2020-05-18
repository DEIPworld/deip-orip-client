<template>
  <div class="d-stepper-num">
    <div
      class="d-flex align-self-start align-center"
      :style="{height: height + 'px'}"
    >
      <v-avatar
        color="primary"
        size="24"
        class="mx-auto"
      >
        <span class="white--text caption font-weight-medium">{{ num }}</span>
      </v-avatar>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LevellerNum',
    props: {
      height: {
        type: Number,
        default: 40
      },
      num: {
        type: Number,
        default: null
      }
    }
  };
</script>

<style lang="scss">
  .d-stepper-num {
    width: 40px;
    position: relative;

    .v-avatar {
      box-shadow: 0 0 0 4px #fff;
    }

    &::before {
      position: absolute;
      left: calc(50% - 1px);
      top: 0;
      bottom: 0;
      content: '';
      width: 2px;
      background: rgba(#000, .12);
    }
  }
</style>
