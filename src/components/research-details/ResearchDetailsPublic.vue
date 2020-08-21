<template>
  <div>
    <research-details-header />
    <d-layout-section>
      <research-timeline :timeline="timeline" />
      <research-details-materials :is-details-available="false" />

      <template #sidebar>
        <div>
          <v-sheet>
            <div class="text-h6">
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
            >
              Sign in
            </v-btn>
          </v-sheet>

          <v-divider class="my-6" />

          <v-sheet>
            <div class="text-h6">
              {{ group.name }}
            </div>
            <div
              v-for="(member, i) in researchMembersList"
              :key="member.account.id"
              class="mt-4"
              justify="space-between"
              align-center
            >
              <div>
                <platform-avatar
                  :key="'member-' + i"
                  :size="40"
                  :user="member"
                  :link-to-profile="false"
                  no-follow
                  link-to-profile-class="pl-4 bold"
                  pick-disabled
                >
                  <span class="pl-2">{{ member | fullname }}</span>
                </platform-avatar>
              </div>
            </div>
          </v-sheet>

          <v-divider class="my-6" />

          <div v-for="(item, i) in researchRef.tenantCriteriasReadingList" :key="`${i}-tenantCriteria`">
            <div v-if="item.type == 'stepper'" class="mb-2">
              <div class="display-flex">
                <v-avatar size="30" color="#0386b0" class="align-self-start mr-2">
                  <span class="white--text font-weight-medium">{{ item.value.index + 1 }}</span>
                </v-avatar>
                <div class="text-h6 align-self-start font-weight-medium">
                  {{ item.readinessLevelShortTitle }}
                  <div class="text-caption font-weight-bold">
                    {{ item.step.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="researchRef.partners.length">
            <v-divider class="my-6" />
            <div class="text-h6">
              Partners
            </div>
            <research-partners class="mt-4" is-read-only :partners="researchRef.partners" />
          </div>
        </div>
      </template>
    </d-layout-section>
  </div>
</template>

<script>
  import moment from 'moment';
  import { mapGetters } from 'vuex';

  import { ResearchService } from '@deip/research-service';

  import ResearchDetailsHeader from '@/components/research-details/components/ResearchDetailsHeader';
  import ResearchDetailsMaterials from '@/components/research-details/components/ResearchDetailsMaterials';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import ResearchTimeline from './components/ResearchTimeline';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchDetailsPublic',

    components: {
      DLayoutSection,
      ResearchDetailsMaterials,
      ResearchDetailsHeader,
      ResearchTimeline
    },

    data() {
      return {
        groupLink: this.$route.params.research_group_permlink
      };
    },

    computed: {
      ...mapGetters({
        contentList: 'rd/contentList',
        group: 'rd/group',
        disciplinesList: 'rd/disciplinesList',
        researchMembersList: 'rd/researchMembersList',
        researchGroupMembersList: 'rd/researchGroupMembersList',
        research: 'rd/research',
        researchRef: 'rd/researchRef',
        tenant: 'auth/tenant'
      }),
      timeline() {
        const { milestones } = this.researchRef;
        const timeline = milestones.map((milestone, i) => ({
          id: i + 1,
          date: moment
            .utc(milestone.eta)
            .local()
            .format('MMM DD, YYYY'),
          label: milestone.goal,
          description: milestone.details,
          budget: milestone.budget,
          purpose: milestone.purpose
        }));
        return timeline;
      }
    },

    created() {
    },

    methods: {
      countContentReviews(content, isPositive) {
        return content.reviews.reduce(
          (acc, review) => ((review.is_positive && isPositive)
            || (!review.is_positive && !isPositive)
            ? acc + 1
            : acc),
          0
        );
      },
      createContentAuthorsString(authors) {
        return this.researchGroupMembersList
          .filter((m) => authors.some((a) => a === m.account.name))
          .map((m) => this.$options.filters.fullname(m))
          .join('  ·  ');
      },
      doesContentHaveReviews(content) {
        return content.reviews.length;
      },
      doesContentHavePositiveReviews(content) {
        return content.reviews.some((r) => r.is_positive);
      },
      doesContentHaveNegativeReviews(content) {
        return content.reviews.some((r) => !r.is_positive);
      },
      getContentEciList(content) {
        return this.disciplinesList.map((discipline) => {
          const eciObj = content.eci_per_discipline.find(
            (item) => item[0] === discipline.id
          );

          return {
            disciplineName: discipline.name,
            value: eciObj ? eciObj[1] : 0
          };
        });
      },
      getResearchContentType(type) { return researchService.getResearchContentType(type); }
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
