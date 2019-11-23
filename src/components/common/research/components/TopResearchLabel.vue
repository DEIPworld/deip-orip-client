<template>    
  <v-layout row align-center>
    <div :style="{'width': width + 'px', 'height': height + 'px'}">
      <img width="100%" height="100%" :src="'./static/top-100.png'"/>      
    </div>
    <div class="pl-2">
      <span class="bold uppercase white--text lighten-1">TOP {{number}}</span>
    </div>
  </v-layout>
</template>

<script>
  export default {
    name: 'TopResearchLabel',
    props: {
      width: { required: false, type: Number, default: 20 },
      height: { required: false, type: Number, default: 20 },
      number: { required: false, type: Number, default: 100 },
    }
  }
</script>

<style lang="less" scoped>

</style>

       
       
       
