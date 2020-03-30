<template>
  <base-page-layout>
    <v-card slot="content" class="full-width full-height">
      <v-layout
        row
        class="rd-header full-height pa-5 feed-header"
        :style="{ background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 70%, transparent), url('+ $options.filters.researchBackgroundSrc(research.id) +'), 100%, 100%, no-repeat'}"
      >
        <v-flex xs12 lg8>
          <div>
            <div class="rd-header__title">{{research.title}}</div>
            <div class="rd-header__created pt-4">
              <v-layout row align-baseline>
                <span>
                  <v-icon small color="white">today</v-icon>
                  &nbsp;Created {{research.created_at | dateFormat('D MMM YYYY', true)}}
                </span>
              </v-layout>
            </div>
            <div class="rd-header__abstract">
              <toggle-text class="py-3" :text="research.abstract"></toggle-text>
            </div>
          </div>
        </v-flex>
        <v-flex v-if="researchRef.videoSrc" xs12 lg4 text-xs-right class="align-start">
          <div>
            <iframe
              class="presentation-video"
              :src="getEmbedVideoUrl(researchRef.videoSrc)"
              frameborder="0"
              allowfullscreen
            />
          </div>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 lg9 class="px-5">
          <v-layout row wrap v-if="timeline.length" class="my-5">
            <v-flex xs12>
              <v-layout column>
                <v-layout row>
                  <v-flex grow>
                    <v-layout>
                      <div class="pr-3"><v-icon large color="grey lighten-2">mdi-flag</v-icon></div>
                      <div class="rd-block-header align-self-center">Project Timeline</div>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <research-timeline :timeline="timeline" />
            </v-flex>
          </v-layout>

          <v-layout row wrap class="my-4" v-if="contentList.length">
            <v-flex xs12>
              <research-details-materials :isDetailsAvailable="false"/>
            </v-flex>
          </v-layout>
        </v-flex>

        <!-- Right-Hand sidebar -->
        <v-flex xs12 lg3>
          <v-layout column class="mt-5 mb-4 mx-4">
            <div class="rd-sidebar-block-title">
              You are not logged in
            </div>
            <div class="my-2">
              After creating an account/log in you can add new projects or enjoy shared materials
            </div>
            <v-btn
              :to="{
                name: 'SignIn'
              }"
              block
              color="primary"
              class="pa-2"
            >Log In</v-btn>
          </v-layout>
          <v-divider />
          <v-layout column ma-4>
            <div class="rd-sidebar-block-title">{{group.name}}</div>
            <v-layout
              v-for="(member, i) in researchMembersList"
              :key="member.account.id"
              class="mt-3"
              justify-space-between
              align-center
            >
              <div>
                <platform-avatar
                  :size="40"
                  :key="'member-' + i"
                  :user="member"
                  :link-to-profile="false"
                  no-follow
                  link-to-profile-class="pl-3 bold"
                  pick-disabled
                ><span class="pl-2">{{member | fullname}}</span></platform-avatar>
              </div>
            </v-layout>
          </v-layout>
          <v-divider />

          <v-layout column ma-4>
            <technology-readiness-level isReadOnly :currentTrlStep="researchRef.trl"></technology-readiness-level>
          </v-layout>

          <v-divider />

          <v-layout column ma-4 v-if="researchRef.partners.length">
            <div class="rd-sidebar-block-title">Partners</div>
            <research-partners class="mt-3" isReadOnly :partners="researchRef.partners"></research-partners>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </base-page-layout>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

import { ResearchService } from '@deip/research-service'

import ResearchTimeline from './components/ResearchTimeline';

const researchService = ResearchService.getInstance();

export default {
  name: "ResearchDetailsPublic",

  components: {
    ResearchTimeline,
  },

  data() {
    return {
      groupLink: this.$route.params.research_group_permlink,
    };
  },

  computed: {
    ...mapGetters({
      contentList: "rd/contentList",
      contentRefsList: "rd/contentRefsList",
      group: "rd/group",
      disciplinesList: "rd/disciplinesList",
      researchReferencesList: "rd/researchReferencesList",
      researchMembersList: "rd/researchMembersList",
      researchGroupMembersList: "rd/researchGroupMembersList",
      research: "rd/research",
      researchRef: "rd/researchRef",
    }),
    timeline() {
      let milestones = this.researchRef.milestones
      let timeline = milestones.map((milestone, i) => {
        return {
          id: i + 1,
          date: moment
            .utc(milestone.eta)
            .local()
            .format("MMM DD, YYYY"),
          label: milestone.goal,
          description: milestone.details,
          budget: milestone.budget,
          purpose: milestone.purpose
        };
      });
      return timeline;
    },
  },

  methods: {
    countContentReviews(content, isPositive) {
      return content.reviews.reduce(
        (acc, review) =>
          (review.is_positive && isPositive) ||
          (!review.is_positive && !isPositive)
            ? acc + 1
            : acc,
        0
      );
    },
    createContentAuthorsString(authors) {
      return this.researchGroupMembersList
        .filter(m => authors.some(a => a === m.account.name))
        .map(m => this.$options.filters.fullname(m))
        .join("  ·  ");
    },
    doesContentHaveReviews(content) {
      return content.reviews.length;
    },
    doesContentHavePositiveReviews(content) {
      return content.reviews.some(r => r.is_positive);
    },
    doesContentHaveNegativeReviews(content) {
      return content.reviews.some(r => !r.is_positive);
    },
    getContentEciList(content) {
      return this.disciplinesList.map(discipline => {
        const eciObj = content.eci_per_discipline.find(
          item => item[0] === discipline.id
        );

        return {
          disciplineName: discipline.name,
          value: eciObj ? eciObj[1] : 0
        };
      });
    },
    getResearchContentType(type) { return researchService.getResearchContentType(type)}
  },

  created() {
  }
};
</script>

<style lang="less" scoped>
.rd-header {
  height: 300px;
  overflow: auto;

  font-style: normal;
  color: white;

  &__title {
    font-family: Muli;
    font-weight: 900;
    font-size: 36px;
    line-height: 40px;
    letter-spacing: 0.25px;
  }
  &__created {
  }
  &__abstract {
    font-family: Roboto;
    font-size: 14px;
    line-height: 16px;
  }
}
.rd-block-header {
  font-family: Muli;
  font-style: normal;
  font-weight: 900;
  font-size: 24px;
  letter-spacing: 0.25px;
  color: black;
}
.feed-header {
  background-size: cover !important;
  background-repeat: no-repeat !important;
  height: 300px;
  width: 100%;
  font-style: normal;
  color: white;
}
.presentation-video {
  width: 390px;
  height: 220px;
  border: 2px solid #fafafa;
}
.rd-sidebar-block-title {
  font-family: Roboto;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  color: #000000;
}
</style>
