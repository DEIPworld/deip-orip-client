<template>
  <v-btn
    icon
    small
    :to="{
      name: 'team.edit',
      params: {
        teamId: team.externalId
      }
    }"
  >
    <v-icon>
      edit
    </v-icon>
  </v-btn>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'ResearchDetailsEditCta',
    computed: {
      ...mapGetters({
        team: 'Team/teamDetails'
      })
    }
  };
</script>