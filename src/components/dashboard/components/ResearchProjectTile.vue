<template>
  <v-layout column>
    <div><img style="width: 100%; height: 150px" :src="researchLogoSrc" /></div>
    <div class="subheading half-bold py-2">Characterization of fluorine-centred interactions</div>
    
    <v-layout row wrap>
      <div class="pt-2 pr-2">
        <platform-avatar :user="user" link-to-profile link-to-profile-class="pl-3 grey--text lighten-2"></platform-avatar>
      </div>
    </v-layout>

    <v-layout row class="pt-1">
      <v-layout column>
        <v-progress-linear v-model="fundraisePercent"></v-progress-linear>
        <v-layout row>
          <span class="pr-3">
            <span class="black--text half-bold pr-1">45%</span>
            <span class="grey--text lighten-2">funded</span>
          </span>
          <span class="px-3" style="border-left: 1px solid #e0e0e0;">
            <span class="black--text half-bold pr-1">$50</span>
            <span class="grey--text lighten-2">goal</span>
          </span>
          <span class="pl-3" style="border-left: 1px solid #e0e0e0;">
            <span class="black--text half-bold pr-1">23</span>
            <span class="grey--text lighten-2">days left</span>
          </span>
        </v-layout>
      </v-layout>
    </v-layout>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: "ResearchProjectTile",
    props: {
      research: { required: true, default: () => {} },
    },
    data() {
      return {
        fundraisePercent: 35,
        researchLogoSrc: `./../../../static/research-logo/${this.research.id < 3 ? this.research.id : 'default'}.png`
      };
    },
    computed: {
      ...mapGetters({
        user: "auth/user",
      })
    },
    methods: {

    }
  };
</script>

<style lang="less" scoped>

</style>
