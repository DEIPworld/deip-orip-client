<template>
  <v-btn
    icon
    small
    :to="{
      name: 'team.edit',
      params: {
        teamId: team._id
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
    name: 'ProjectDetailsEditCta',
    computed: {
      ...mapGetters({
        team: 'Team/teamDetails'
      })
    }
  };
</script>