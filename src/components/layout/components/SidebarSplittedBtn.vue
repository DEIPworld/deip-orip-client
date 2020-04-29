<!--TODO: what is it-->
<template>
  <div class="sidebar-fullwidth">
    <v-divider />

    <div class="legacy-row-nowrap">
      <div class="legacy-col-6" :class="{ 'clickable': leftRipple !== false }">
        <div v-ripple="leftRipple" class="display-flex full-height">
          <slot name="left" />
        </div>
      </div>

      <div class="btn-vertical-splitter" />

      <div class="legacy-col-6" :class="{ 'clickable': rightRipple !== false }">
        <div v-ripple="rightRipple" class="display-flex full-height">
          <slot name="right" />
        </div>
      </div>
    </div>

    <v-divider />
  </div>
</template>

<script>
  export default {
    name: 'SidebarSplittedBtn',
    props: {
      rightRipple: {
        required: false,
        default: true
      },
      leftRipple: {
        required: false,
        default: true
      }
    }
  };
</script>

<style lang="less">
  .btn-vertical-splitter {
    background-color: rgba(0, 0, 0, 0.12);
    width: 1px;
    margin: 12px 0;
  }

  .default-half-splitted {
    padding-top: 24px;
    padding-bottom: 24px;
    width: 100%;
    display: flex;
    text-align: center;
  }
</style>
