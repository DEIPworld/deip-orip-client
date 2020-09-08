<template>
  <d-block :title="internalAttribute.title">
    <d-timeline>
      <d-timeline-item
        v-for="(item, index) of internalValue"
        :key="`row-${index}`"
        :dot-top="16"
      >

        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="item.goal"
              label="Goal"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col cols="6">
            <d-input-date
              v-model="item.eta"
              label="Deadline"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="item.budget"
              label="Estimated budget"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="item.purpose"
              label="Budget purpose"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="item.details"
              label="Milestone description"
              outlined
            />
          </v-col>
        </v-row>

        <template #action>
          <v-btn icon :disabled="!index" @click="removeFromModel(index)">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>

      </d-timeline-item>
      <d-timeline-add @click="appendModel()" />
    </d-timeline>
  </d-block>
</template>

<script>
  import { arrayModelAddFactory } from '@/mixins/extendModel';
  import DTimelineItem from '@/components/Deipify/DTimeline/DTimelineItem';
  import DTimeline from '@/components/Deipify/DTimeline/DTimeline';
  import DInputDate from '@/components/Deipify/DInput/DInputDate';
  import DTimelineAdd from '@/components/Deipify/DTimeline/DTimelineAdd';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import { commonSet } from '@/components/Attributes/mixins';

  const stepModel = () => ({
    goal: '',
    eta: '',
    budget: '',
    purpose: '',
    details: '',
    isActive: false
  });

  export default {
    name: 'AttributesRoadmapSet',

    components: {
      DBlock,
      DTimelineAdd,
      DInputDate,
      DTimeline,
      DTimelineItem
    },

    mixins: [arrayModelAddFactory(stepModel()), commonSet],

    // props: {
    //   value: {
    //     type: Array,
    //     default: () => ([])
    //   }
    // },

    created() {
      if (!this.internalValue) {
        this.internalValue = [];
      }
    }
  };
</script>
