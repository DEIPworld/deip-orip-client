<template>
  <v-row>
    <v-col cols="8">
      <v-tabs-items v-model="activeMs" mandatory vertical>
        <v-tab-item
          v-for="(item, index) of roadmap"
          :key="`tbc-${index}`"
        >
          <div class="text-body-2">
            {{ item.description }}
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-col>

    <v-col cols="4">
      <d-timeline>
        <v-item-group v-model="activeMs" mandatory>
          <v-item
            v-for="(item, index) of roadmap"
            :key="`tba-${index}`"
            v-slot="{ active, toggle }"
          >
            <d-timeline-item
              :dot-size="active ? 24 : 18"
              :dot-top="active ? 2 : 6"
              :dot-color="colors[index]"
              :top-line-color="colors[index]"
              dot-hover
              :bottom-line-color="`linear-gradient(to bottom, ${colors[index]}, ${colors[index + 1]})`"
              @click="toggle"
            >
              <d-stack gap="4" class="pb-4">
                <div v-if="item.date" class="text-body-2 font-weight-medium text-uppercase">
                  {{ item.date }}
                </div>

                <div class="text-caption font-weight-medium">
                  {{ item.label }}
                </div>

                <div class="text-caption text--secondary">
                  {{ item.budget }}
                  {{ item.purpose }}
                </div>
              </d-stack>
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
  import { attributeRead } from '@/components/Attributes/_mixins';
  import moment from 'moment';
  import { chartGradient } from '@/plugins/charts';
  import { isString } from '@/utils/helpers';
  import { assetsChore } from '@/mixins/chores';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'AttributesRoadmapRead',

    components: {
      DStack,
      DTimelineItem,
      DTimeline
    },

    mixins: [attributeRead, assetsChore],

    data() {
      return {
        activeMs: undefined
      };
    },

    computed: {
      colors() {
        return chartGradient(this.roadmap.length + 1);
      },

      roadmap() {
        const roadmap = this.attribute.value.map((milestone, i) => ({
          id: i + 1,
          date: milestone.eta ? moment
            .utc(milestone.eta)
            .local()
            .format('MMM DD, YYYY') : null,
          label: milestone.goal,
          description: milestone.details,
          // for old string-budgets
          budget: this.$$toAssetUnits(
            isString(milestone.budget)
              ? milestone.budget.replace(/^\D+/g, '')
              : milestone.budget
          ),
          purpose: milestone.purpose
        }));
        return roadmap;
      }
    }
  };
</script>
