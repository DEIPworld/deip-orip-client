<template>
  <div v-if="review" class="review-content-container">
    <d-stack gap="32" class="mx-auto">
      <d-stack gap="4">
        <div class="text-overline text--secondary">
          project
        </div>
        <div>
          <router-link
            :to="{ name: 'project.details', params: { projectExternalId: research.external_id } }"
            class="link text--primary"
          >
            {{ research.title }}
          </router-link>
        </div>
      </d-stack>

      <d-stack gap="4">
        <div class="text-overline text--secondary">
          Subject
        </div>
        <div class="text-h3">
          Review on
          {{ getResearchContentType(content.content_type).text }}
          :
          <router-link
              :to="{ name: 'project.content.details', params: { projectExternalId: research.external_id, contentExternalId: content.external_id } }"
              class="link text--primary"
          >
            {{ content.title }}
          </router-link>

        </div>
      </d-stack>

      <d-stack gap="4">
        <div class="text-overline text--secondary">
          Reviewer
        </div>
        <users-list
          :users="review.author.account.name"
          view-type="brief"
          avatar-size="80"
        >
          <template #item-info="{ user, hasLocation }">
            <div v-if="user.profile" class="pt-1 text--secondary text-caption">
              <span>{{ user | employmentOrEducation }}</span>
              <span v-if="hasLocation(user.profile)">, {{ user | userLocation }}</span>
            </div>
          </template>
        </users-list>
      </d-stack>
      <div v-html="review.content" />
    </d-stack>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import DStack from '@/components/Deipify/DStack/DStack';
  import { ResearchService } from '@deip/research-service';
  import UsersList from '@/features/Users/components/List/UsersList';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchContentReviewBody',
    components: { UsersList, DStack },
    data() {
      return {};
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        userExperise: 'auth/userExperise',
        content: 'rcd/content',
        research: 'rcd/research',
        contentReviewsList: 'rcd/contentReviewsList'
      }),
      review() {
        // return this.contentReviewsList.find((r) => r.id == this.$route.params.review_id);
        return this.contentReviewsList.find((r) => r.external_id === this.$route.params.reviewExternalId);
      },

      // hasLocation() {
      //   return this.review && this.review.author.profile
      //       && this.review.author.profile.location
      //       && (this.review.author.profile.location.country || this.review.author.profile.location.city);
      // }
    },
    created() {
    },

    methods: {
      getResearchContentType(type) {
        return researchService.getResearchContentType(type);
      }
    }
  };
</script>
