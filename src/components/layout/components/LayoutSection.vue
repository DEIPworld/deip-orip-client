<template>
  <div class="app-layout__section">
    <slot name="sidebar" />

    <div :style="`maxWidth:${layoutContentWidth}`" class="app-layout__content pa-6 pa-sm-12">
      <slot name="default" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LayoutSection',
    methods: {
      hasSlot(name) {
        return this.$slots[name] !== undefined;
      }
    },
    computed:{
      layoutContentWidth(){
        return this.hasSlot('sidebar') ? this.$slots.sidebar.length === 2 ? '50%' : '75%' : null;
      }
    }
  };
</script>

<style scoped>

</style>
