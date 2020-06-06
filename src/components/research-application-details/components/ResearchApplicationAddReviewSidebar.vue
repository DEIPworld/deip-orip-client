<template>
  <div>
    <div v-if="research" class="c-mb-8 text-align-center">
      <router-link
        class="a title"
        :to="{
          name: 'ResearchApplicationDetails',
          params: {
            research_group_permlink: encodeURIComponent(research.research_group.permlink),
            research_permlink: encodeURIComponent(research.permlink),
            application_id: application.id
          }
        }"
      >
        {{ application.title || application.letterHash.slice(0, 8) }}
      </router-link>
    </div>

    <div class="legacy-row legacy-justify-center">
      <div>
        <span class="c-pr-2">
          <v-btn
            class="ma-0"
            :dark="isPositive === true"
            :color="isPositive === true ? 'green darken-2' : undefined"
            small
            depressed
            @click="isPositive = true"
          >Approve</v-btn>
        </span>
        <span>
          <v-btn
            class="ma-0"
            :dark="isPositive === false"
            :color="isPositive === false ? 'red darken-2' : undefined"
            small
            depressed
            @click="isPositive = false"
          >Reject</v-btn>
        </span>
      </div>
    </div>

    <div class="legacy-row legacy-justify-center c-mt-10 c-mb-10">
      <div>
        <v-btn
          color="primary"
          class="width-9"
          :loading="isLoading"
          @click="publishApplicationReview()"
        >
          Send
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';

  export default {
    name: 'ResearchApplicationAddReviewSidebar',
    data() {
      return {
        isPositive: true,
        isLoading: false
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        userExperise: 'auth/userExperise',
        application: 'rad/application',
        research: 'rad/research',
        program: 'rad/program'
      }),
      relatedExpertise() {
        return this.userExperise != null && this.research != null
          ? this.userExperise.filter((exp) => this.research.disciplines.find((d) => d.id == exp.discipline_id))
          : false;
      }
    },

    methods: {
      publishApplicationReview() {
        const applicationReviewEditor = this.$store.getters['rad/applicationReviewEditor'];
        this.isLoading = true;
        applicationReviewEditor.save()
          .then((html) => deipRpc.broadcast.createReviewForApplicationAsync(
            this.user.privKey,
            this.user.username,
            this.application.id,
            this.isPositive,
            html, 
            []
          ))
          .then((data) => {
            this.$notifier.showSuccess('Your review has been published successfully !')
            this.$router.push({
              name: 'ResearchApplicationDetails',
              params: {
                research_group_permlink: encodeURIComponent(this.research.research_group.permlink),
                research_permlink: encodeURIComponent(this.research.permlink),
                application_id: this.application.id
              },
              hash: '#reviews'
            });
          })
          .catch((err) => {
            this.$notifier.showError('An error occurred while adding review, please try again later')
            console.log(err);
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
