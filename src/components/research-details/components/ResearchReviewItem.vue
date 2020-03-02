<template>
  <v-layout>
    <v-flex lg4 class="right-bordered">
      <v-layout column fill-height justify-space-between>
        <v-layout row wrap>
          <v-flex shrink>
            <platform-avatar :user="review.author" :size="80"></platform-avatar>
          </v-flex>
          <v-flex class="px-4" xs12 md8 xl9>
            <router-link
              class="a"
              :to="{ name: 'UserDetails', params: { account_name: review.author.account.name }}"
            >{{ review.author | fullname }}</router-link>
            <div v-if="review.author.profile" class="rd-reviewer__subtitle pt-1">
              <span>{{review.author | employmentOrEducation}}</span>
              <span
                v-if="doesUserHaveLocation(review.author.profile)"
              >, {{review.author | userLocation}}</span>
            </div>
          </v-flex>
        </v-layout>
        <v-btn small @click="goToReviewPage(review)" outline>See review</v-btn>
      </v-layout>
    </v-flex>
    <v-flex lg4 class="px-4 right-bordered">
      <v-layout column fill-height>
        <div v-if="review.research_content" v-on:click.stop>
          <div>
            <span>
              Review to
              <span
                class="bold"
              >{{ getResearchContentType(review.research_content.content_type).text }}</span>
            </span>
          </div>
          <router-link
            tag="div"
            class="a py-2"
            :to="{
              name: 'ResearchContentDetails',
              params: {
                research_group_permlink: encodeURIComponent(research.group_permlink),
                research_permlink: encodeURIComponent(research.permlink),
                content_permlink: encodeURIComponent(review.research_content.permlink)
              }
            }"
          >{{review.research_content.title}}</router-link>
        </div>
        <v-layout row wrap>
          <v-flex
            lg12
            v-for="item of review.disciplines"
            :key="`${review.id}- ${item.disciplineName}`"
            class="rd-review-eci mt-1"
          >
            <span>{{item.disciplineName}}</span>
          </v-flex>
        </v-layout>
        <div class="grey--text text-xs-right pt-2">
          <v-icon small>event</v-icon>
          {{moment(review.created_at).format("D, MMM YYYY")}}
        </div>
      </v-layout>
    </v-flex>
    <v-flex lg4>
      <v-layout column fill-height justify-space-between pl-4>
        <div>
          <div class="bold">Assessment</div>
          <review-assessment
            v-model="review.ratings"
            :researchContentType="review.researchContent.content_type"
          ></review-assessment>
        </div>
        <div class="pt-2">
          <v-tooltip tag="div" bottom v-if="review.supporters.length">
            <v-layout slot="activator" row justify-end align-baseline>
              <span class="half-bold align-self-center pr-2">{{review.supporters.length}}</span>
              <v-icon>group_add</v-icon>
            </v-layout>
            <div
              v-if="review.supporters.length"
            >{{review.supporters.length}} experts supported this review</div>
          </v-tooltip>
        </div>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { getResearchContentType } from "@/services/ResearchService";
import deipRpc from "@deip/deip-oa-rpc-client";

export default {
  name: "ResearchReviewItem",

  props: {
    review: { type: Object, required: true },
    research: { type: Object, required: true }
  },
  data() {
    return {};
  },
  methods: {
    doesUserHaveLocation(userProfile) {
      return (
        userProfile.location &&
        (userProfile.location.country || userProfile.location.city)
      );
    },
    goToReviewPage(review) {
      const params = { review_id: review.id };

      deipRpc.api
        .getResearchContentByIdAsync(review.research_content_id)
        .then(content => {
          params.content_permlink = encodeURIComponent(content.permlink);
          return deipRpc.api.getResearchByIdAsync(content.research_id);
        })
        .then(research => {
          params.research_permlink = encodeURIComponent(research.permlink);
          return deipRpc.api.getResearchGroupByIdAsync(
            research.research_group_id
          );
        })
        .then(group => {
          params.research_group_permlink = encodeURIComponent(group.permlink);
          this.$router.push({ name: "ResearchContentReview", params });
        });
    },
    getResearchContentType
  }
};
</script>

<style lang="less" scoped>
.rd-reviewer {
  font-family: Roboto;
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
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  color: #9e9e9e;
}

.right-bordered {
  border-right: 1px solid #e0e0e0;
}
</style>