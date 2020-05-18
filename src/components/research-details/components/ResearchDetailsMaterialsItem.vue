<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <v-row
        no-gutters
        align="center"
        justify="space-between"
        @click.stop
      >
        <v-col cols="2" class="text-capitalize bold">
          {{ getResearchContentType(content.content_type).text }}
        </v-col>
        <v-col cols="8" class="bold">
          <router-link
            v-if="isDetailsAvailable"
            class="a"
            :to="{
              name: 'ResearchContentDetails',
              params: {
                research_group_permlink: encodeURIComponent(research.research_group.permlink),
                research_permlink: encodeURIComponent(research.permlink),
                content_permlink: encodeURIComponent(content.permlink)
              }
            }"
          >
            {{ content.title }}
          </router-link>
          <span v-else class="grey--text">{{ content.title }}</span>
        </v-col>
        <v-col cols="2">
          <div class="d-flex justify-space-between px-2">
            <div v-if="isDetailsAvailable">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="a"
                    icon
                    small
                    style="text-decoration: none;"
                    :to="{
                      name: 'ResearchContentReferences',
                      params: {
                        research_group_permlink: encodeURIComponent(research.research_group.permlink),
                        research_permlink: encodeURIComponent(research.permlink),
                        content_permlink: encodeURIComponent(content.permlink)
                      }
                    }"
                    v-on="on"
                  >
                    <v-icon small>
                      device_hub
                    </v-icon>
                  </v-btn>
                </template>
                <span>Browse references</span>
              </v-tooltip>
            </div>
            <div v-if="hasReviews(content)" class="align-self-center">
              <v-icon size="14px">
                chat_bubble
              </v-icon>
              <span v-show="hasPositiveReviews(content)" class="green--text medium">{{ countContentReviews(content, true) }}</span>
              <span v-show="hasPositiveReviews(content) && hasNegativeReviews(content)">/</span>
              <span v-show="hasNegativeReviews(content)" class="red--text medium">{{ countContentReviews(content, false) }}</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div class="ml-6 py-2">
        <div class="grey--text">
          {{ createContentAuthorsString(content.authors) }}
        </div>
        <div>
          <span
            v-for="eci of getContentEciList(content)"
            :key="eci.disciplineName"
            class="grey--text"
          >
            <span class="mr-1">{{ eci.disciplineName }}</span>
            <span class="mr-6 bold">{{ eci.value }}</span>
          </span>
        </div>
        <div class="mt-2">
          <v-icon size="18px">
            event
          </v-icon>
          <span>{{ content.created_at | dateFormat('D MMM YYYY', true) }}</span>
        </div>
      </div>
    </v-expansion-panel-content>
    <v-divider />
  </v-expansion-panel>
</template>

<script>
  import { mapGetters } from 'vuex';

  import { ResearchService } from '@deip/research-service';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchDetailsMaterialsItem',

    props: {
      content: {
        type: Object,
        required: true
      },
      isDetailsAvailable: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        research: 'rd/research',
        researchGroupMembersList: 'rd/researchGroupMembersList',
        disciplinesList: 'rd/disciplinesList'
      })
    },
    methods: {
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

      createContentAuthorsString(authors) {
        return this.researchGroupMembersList
          .filter((m) => authors.some((a) => a === m.account.name))
          .map((m) => this.$options.filters.fullname(m))
          .join('  ·  ');
      },
      hasNegativeReviews(content) {
        return content.reviews.some((r) => !r.is_positive);
      },
      countContentReviews(content, isPositive) {
        return content.reviews.reduce(
          (acc, review) => ((review.is_positive && isPositive)
            || (!review.is_positive && !isPositive)
            ? acc + 1
            : acc),
          0
        );
      },
      hasReviews(content) {
        return content.reviews.length;
      },
      hasPositiveReviews(content) {
        return content.reviews.some((r) => r.is_positive);
      },
      getResearchContentType(type) {
        return researchService.getResearchContentType(type);
      }
    }
  };
</script>

<style scoped>
</style>
