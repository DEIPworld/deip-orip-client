<template>
  <v-expansion-panel-content>
    <template slot="header">
      <v-layout align-center v-on:click.stop>
        <v-flex
          lg2
          class="text-capitalize bold"
        >{{getResearchContentType(content.content_type).text}}</v-flex>
        <v-flex lg8 class="bold">
          <router-link
            v-if="isDetailsAvailable"
            class="a"
            :to="{
              name: 'ResearchContentDetails',
              params: {
                research_group_permlink: encodeURIComponent(research.group_permlink),
                research_permlink: encodeURIComponent(research.permlink),
                content_permlink: encodeURIComponent(content.permlink)
              }
            }"
          >{{content.title}}</router-link>
          <span class="grey--text" v-else>{{content.title}}</span>
        </v-flex>
        <v-flex v-if="isDetailsAvailable" lg1 text-lg-center class="text-xs-center">
          <v-tooltip top>
            <template slot="activator">
              <router-link
                class="a"
                style="text-decoration: none;"
                :to="{
                  name: 'ResearchContentReferences',
                  params: {
                    research_group_permlink: encodeURIComponent(research.group_permlink),
                    research_permlink: encodeURIComponent(research.permlink),
                    content_permlink: encodeURIComponent(content.permlink)
                  }
                }"
              >
                <v-icon small>device_hub</v-icon>
              </router-link>
            </template>
            <span>Browse references</span>
          </v-tooltip>
        </v-flex>
        <v-flex lg1 text-lg-center v-show="doesContentHaveReviews(content)">
          <v-icon size="14px">chat_bubble</v-icon>
          <span
            v-show="doesContentHavePositiveReviews(content)"
            class="green--text medium"
          >{{countContentReviews(content, true)}}</span>
          <span
            v-show="doesContentHavePositiveReviews(content) && doesContentHaveNegativeReviews(content)"
          >/</span>
          <span
            v-show="doesContentHaveNegativeReviews(content)"
            class="red--text medium"
          >{{countContentReviews(content, false)}}</span>
        </v-flex>
      </v-layout>
    </template>
    <div class="ml-4 py-2">
      <div class="grey--text">{{createContentAuthorsString(content.authors)}}</div>
      <div>
        <span
          v-for="eci of getContentEciList(content)"
          :key="eci.disciplineName"
          class="grey--text"
        >
          <span class="mr-1">{{eci.disciplineName}}</span>
          <span class="mr-4 bold">{{eci.value}}</span>
        </span>
      </div>
      <div class="mt-2">
        <v-icon size="18px">event</v-icon>
        <span>{{content.created_at | dateFormat('D MMM YYYY', true)}}</span>
      </div>
    </div>
  </v-expansion-panel-content>
</template>

<script>
import { mapGetters } from "vuex";
import { getResearchContentType } from "@/services/ResearchService";

export default {
  name: "ResearchDetailsMaterialsItem",

  props: {
    content: { type: Object, required: true },
    isDetailsAvailable: {type: Boolean, required:false, default: false}
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      research: "rd/research",
      researchGroupMembersList: "rd/researchGroupMembersList",
      disciplinesList: "rd/disciplinesList"
    })
  },
  methods: {
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

    createContentAuthorsString(authors) {
      return this.researchGroupMembersList
        .filter(m => authors.some(a => a === m.account.name))
        .map(m => this.$options.filters.fullname(m))
        .join("  ·  ");
    },
    doesContentHaveNegativeReviews(content) {
      return content.reviews.some(r => !r.is_positive);
    },
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
    doesContentHaveReviews(content) {
      return content.reviews.length;
    },
    doesContentHavePositiveReviews(content) {
      return content.reviews.some(r => r.is_positive);
    },
    getResearchContentType
  }
};
</script>

<style scoped>
</style>