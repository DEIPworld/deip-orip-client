<template>
  <v-container fluid class="ma-0 pa-0 fill-height">
    <v-row no-gutters class="text-align-center">
      <v-col cols="12">
        <div>
          <img class="center-text" style="height: 200px" src="/assets/img/landing-logo.svg">
        </div>
      </v-col>
      <v-col cols="12">
        <div class="text-subtitle-1">
          {{ $t('userApplicationAccepted.thank') }}
        </div>
      </v-col>
      <v-col cols="12">
        <router-link class="a caption" :to="{ name: 'explore' }">
          {{ $t('userApplicationAccepted.browse') }}
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import ContentBlock from '@/components/layout/components/ContentBlock';

  export default {
    name: 'UserApplicationAccepted',
    components: { ContentBlock, LayoutSection },
    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        portal: 'auth/portal'
      })
    }
  };
</script>

<style lang="less" scoped>
</style>
