<template>
  <div class="">
    <div class="sidebar-fullwidth">
      <v-divider />
    </div>

    <div v-if="claimerInfo.profile.email" class="c-pt-6 c-pb-6">
      <span>
        <v-icon size="18" class="c-mr-2">mail</v-icon> {{ claimerInfo.profile.email }}
      </span>
    </div>

    <div v-if="claimerInfo.profile.email" class="sidebar-fullwidth">
      <v-divider />
    </div>

    <div class="">
      <div class="title bold c-pt-6">
        <span class="">Personal information</span>
      </div>

      <div class="c-pt-4 c-pb-6">
        <div v-if="claimerInfo.profile.birthdate" class="legacy-row legacy-justify-between">
          <span class="half-bold">Birthday</span>
          <span class="">{{ claimerInfo.profile.birthdate | dateFormat("D MMM YYYY") }}</span>
        </div>

        <div v-if="claimerInfo.profile.created" class="legacy-row legacy-justify-between">
          <span class="half-bold">Registered</span>
          <span class="">{{ claimerInfo.profile.created | dateFormat("D MMM YYYY") }}</span>
        </div>
      </div>
    </div>

    <div class="sidebar-fullwidth">
      <v-divider />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'ClaimUserExpertiseDetailsSidebar',
    data() {
      return {
      };
    },
    computed: {
      ...mapGetters({
        claimerInfo: 'claimExpertiseDetails/claimerInfo'
      })
    },
    methods: {
    }
  };
</script>

<style lang="less" scoped>
</style>
