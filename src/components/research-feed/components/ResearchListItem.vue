<template>
  <div class="c-p-6 pos-relative">
    <router-link :to="`/${encodeURIComponent(research.research_group.permlink)}/research/${encodeURIComponent(research.permlink)}`" class="a subtitle-1">
      {{ research.title }}
    </router-link>

    <div v-if="research.authors" class="caption grey--text c-pt-2">
      {{ research.authors.join("  ·  ") }}
    </div>

    <div>
      <div class="c-pt-4 half-bold">
        <toggle-text :text="research.abstract" />
      </div>

      <div class="c-pt-6">
        <div class="legacy-row">
          <div v-for="tvo in disciplines">
            <span class="c-pr-1">
              <span class="bold green--text text--darken-2">{{ tvo.disciplineName }}</span>
            </span>
            <span class="c-pr-4">
              <span>{{ tvo.totalWeight }}</span>
            </span>
          </div>
        </div>

        <div class="legacy-row-nowrap c-pt-2">
          <div v-if="research.created_at" class="c-pr-8">
            <v-icon size="18px">
              event
            </v-icon> Created
            <span class="half-bold">{{ research.created_at | dateFormat('D MMM, YYYY', true) }}</span>
          </div>

          <div v-if="research.owned_tokens" class="c-pr-8">
            <v-icon size="18px">
              timelapse
            </v-icon> Owned tokens
            <span class="half-bold">{{ convertToPercent(research.owned_tokens) }}%</span>
          </div>

          <div v-if="research.review_share_in_percent" class="c-pr-8">
            <v-icon size="18px">
              pie_chart
            </v-icon> Review award
            <span class="half-bold">{{ convertToPercent(research.review_share_in_percent) }}%</span>
          </div>

          <!-- <div class="c-pr-8">
                        <v-icon size="18px">visibility</v-icon> <span>1999</span>
                    </div> -->

          <!-- <div class="c-pr-8">
                        <v-icon size="18px">chat_bubble</v-icon> <span>23</span>
                    </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'ResearchListItem',
    props: {
      research: { required: true, default: undefined }
    },
    data() {
      return {};
    },
    computed: {
      disciplines() {
        return this.research.disciplines && this.research.totalVotes
          ? this.research.disciplines.map((discipline) => ({
            disciplineName: discipline.name,
            totalWeight: this.research.totalVotes.reduce(
              (accumulator, value) => (value.discipline_id === discipline.id
                ? accumulator + value.eci
                : accumulator),
              0
            )
          }))
          : [];
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
