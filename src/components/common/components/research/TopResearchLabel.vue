<template>
  <v-row no-gutters align="center">
    <div :style="{'width': width + 'px', 'height': height + 'px'}">
      <img width="100%" height="100%" src="/assets/img/top-100.svg">
    </div>
    <span :class="`pl-2 bold uppercase top-text ${colorClass}`">
      TOP {{ number }}
    </span>
  </v-row>
</template>

<script>
  export default {
    name: 'TopProjectLabel',
    props: {
      width: { required: false, type: Number, default: 21 },
      height: { required: false, type: Number, default: 21 },
      number: { required: false, type: Number, default: 100 },
      colorClass: { required: false, type: String, default: 'white--text lighten-1' }
    }
  };
</script>

<style lang="less" scoped>
  .top-text {
    font-family: Roboto;
    line-height: 14px;
  }
</style>
