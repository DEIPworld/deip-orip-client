<template>
  <layout-section v-if="$ready">
    <research-list
      v-if="researches.length"
      namespace="dashboard"
      :items="researches"
      no-filter
    />

    <v-row v-else justify="center">
      <v-col cols="auto" class="text-center">
        <img width="64px" class="mb-3" src="/assets/img/follow-project.png">
        <div class="text-h5 mb-3">
          You’re not following any project yet
        </div>
        <div class="text-body-1 mb-12">
          We have a lot of incredible projects on our platform. Take a look
        </div>
        <div>
          <v-btn
            :to="{ name: 'ResearchFeed' }"
            color="primary"
          >
            Browse projects
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import ResearchList from '@/components/ResearchList/ResearchList';

  export default {
    name: 'AccountFollowingProjects',

    components: { ResearchList, LayoutSection },
    computed: {
      ...mapGetters({
        researches: 'account/followingProjects'
      })
    },
    created() {
      this.$store.dispatch('account/getFollowingProjects')
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
