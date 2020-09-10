<template>
  <v-row>
    <v-col cols="8">
      <v-tabs-items v-model="activeMs" mandatory vertical>
        <v-tab-item
          v-for="(item, index) of roadmap"
          :key="`tbc-${index}`"
        >
          {{ item.description }}
        </v-tab-item>
      </v-tabs-items>

    </v-col>
    <v-col cols="4">
      <d-timeline>
        <v-item-group v-model="activeMs" mandatory>
          <v-item
            v-for="(item, index) of roadmap"
            :key="`tba-${index}`"
            v-slot:default="{ active, toggle }"
          >
            <d-timeline-item
              :dot-size="active ? 24 : 16"
              :dot-top="active ? 2 : 6"
              :dot-color="colors[index]"
              :top-line-color="colors[index]"
              dot-hover
              :bottom-line-color="`linear-gradient(to bottom, ${colors[index]}, ${colors[index + 1]})`"
              @click:dot="toggle"
            >
              <div class="text-body-2 font-weight-medium text-uppercase">
                {{ item.date }}
              </div>

              <div class="text-caption font-weight-medium mt-1">
                {{ item.label }}
              </div>

              <div class="text-caption text--secondary mt-1 pb-4">
                {{ item.budget }} {{ item.purpose }}
              </div>
            </d-timeline-item>
          </v-item>
        </v-item-group>
      </d-timeline>
    </v-col>
  </v-row>
</template>

<script>
  import DTimeline from '@/components/Deipify/DTimeline/DTimeline';
  import DTimelineItem from '@/components/Deipify/DTimeline/DTimelineItem';
  import moment from 'moment';
  import { mapGetters } from 'vuex';
  import { chartGradient } from '@/plugins/charts';

  export default {
    name: 'ResearchDetailsMilestones',

    components: {
      DTimelineItem,
      DTimeline
    },

    data() {
      return {
        activeMs: undefined
      }
    },

    computed: {
      ...mapGetters({
        research: 'research/data'
      }),

      milestones() {
        return this.$where(this.research.researchRef.attributes, { researchAttributeId: '5f4e094fefb3cb06c5d6a5bf' })[0].value;
      },

      colors() {
        return chartGradient(this.milestones.length + 1);
      },

      roadmap() {
        const roadmap = this.milestones.map((milestone, i) => ({
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
        return roadmap;
      }
    }
  };
</script>
