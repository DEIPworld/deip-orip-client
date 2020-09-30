<template>
  <v-row>
    <v-col cols="12" sm="4" class="right-bordered">
      <v-row>
        <v-col cols="auto">
          <platform-avatar :user="review.author" :size="80" />
        </v-col>

        <v-col
          class="px-6"
          cols="12"
          md="8"
          xl="9"
        >
          <router-link
            class="a"
            :to="{ name: 'UserDetails', params: { account_name: review.author.account.name }}"
          >
            {{ review.author | fullname }}
          </router-link>
          <div v-if="review.author.profile" class="rd-reviewer__subtitle pt-1">
            <span>{{ review.author | employmentOrEducation }}</span>
            <span
              v-if="doesUserHaveLocation(review.author.profile)"
            >, {{ review.author | userLocation }}</span>
          </div>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" sm="4" class="px-6 right-bordered">
      <div v-if="review.researchContent" @click.stop>
        <div>
          <span>
            Review to
            <span
              class="bold"
            >{{ getResearchContentType(review.researchContent.content_type).text }}</span>
          </span>
        </div>
        <router-link
          class="a py-2"
          tag="div"
          :to="{
            name: 'ResearchContentDetails',
            params: {
              research_group_permlink: encodeURIComponent(research.research_group.permlink),
              research_permlink: encodeURIComponent(research.permlink),
              content_permlink: encodeURIComponent(review.researchContent.permlink)
            }
          }"
        >
          {{ review.researchContent.title }}
        </router-link>
      </div>
      <v-row>
        <v-col
          cols="12"
          lg="12"
          class="rd-review-eci mt-1"
        >
          <span
            v-for="(item, i) of review.disciplines"
            :key="`${review.id}- ${item.disciplineName}`"
          >
            {{ `${item.disciplineName}${review.disciplines.length - 1 !== i ? ', ' : ''}` }}
          </span>
        </v-col>
      </v-row>
      <div class="grey--text text--right pt-2">
        <v-icon small>
          event
        </v-icon>
        {{ moment(review.created_at).format('D, MMM YYYY') }}
      </div>
    </v-col>


    <v-col cols="12" sm="4">
      <div>
        <div class="bold">
          Assessment
        </div>
        {{review.scores}}
        <review-assessment
          v-model="review.scores"
          :research-content-type="review.researchContent.content_type"
        />
      </div>
      <div class="pt-2">
        <v-tooltip v-if="review.supporters.length" tag="div" bottom>
          <template v-slot:activator="{ on }">
            <div class="d-flex justify-end" v-on="on">
              <span class="half-bold align-self-center pr-2">{{ review.supporters.length }}</span>
              <v-icon>group_add</v-icon>
            </div>
          </template>

          <div
            v-if="review.supporters.length"
          >
            {{ review.supporters.length }} experts supported this review
          </div>
        </v-tooltip>
      </div>
      <div class="text-right">
        <v-btn
          small
          color="primary"
          outlined
          @click="goToReviewPage(review)"
        >
          See review
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { ResearchService } from '@deip/research-service';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchReviewItem',

    props: {
      review: {
        type: Object,
        required: true
      },
      research: {
        type: Object,
        required: true
      }
    },
    data() {
      return {};
    },
    methods: {
      doesUserHaveLocation(userProfile) {
        return (
          userProfile.location
          && (userProfile.location.country || userProfile.location.city)
        );
      },
      goToReviewPage(review) {
        const params = { review_id: review.id };

        deipRpc.api
          .getResearchContentByIdAsync(review.research_content_id)
          .then((content) => {
            params.content_permlink = encodeURIComponent(content.permlink);
            return deipRpc.api.getResearchByIdAsync(content.research_id);
          })
          .then((research) => {
            params.research_permlink = encodeURIComponent(research.permlink);
            return deipRpc.api.getResearchGroupByIdAsync(
              research.research_group_id
            );
          })
          .then((group) => {
            params.research_group_permlink = encodeURIComponent(group.permlink);
            this.$router.push({
              name: 'ResearchContentReview',
              params
            });
          });
      },
      getResearchContentType(type) {
        return researchService.getResearchContentType(type);
      }
    }
  };
</script>

<style lang="less" scoped>
  .rd-reviewer {
    font-family: Roboto, sans-serif;
    font-size: 12px;
    line-height: 14px;

    &__title {
      font-weight: bold;
      color: #000000;
    }

    &__subtitle {
      color: #9e9e9e;
    }
  }

  .rd-review-eci {
    font-family: Roboto, sans-serif;
    font-size: 12px;
    line-height: 14px;
    color: #9e9e9e;
  }

  .right-bordered {
    border-right: 1px solid #e0e0e0;
  }
</style>
