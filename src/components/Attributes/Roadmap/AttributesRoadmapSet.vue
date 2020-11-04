<template>
  <d-block :title="attribute.title">
    <d-timeline v-if="$ready">
      <d-timeline-item
        v-for="(item, index) of internalValue"
        :key="`row-${index}`"
        :dot-top="16"
        :ctrl-height="48"
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
            <d-asset-input
              v-model="item.budget"
              label="Estimated budget"
              return-string
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
          <v-btn icon :disabled="!index" @click="removeItem(item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </d-timeline-item>
      <d-timeline-add @click="addItem()" />
    </d-timeline>
  </d-block>
</template>

<script>
  import DTimelineItem from '@/components/Deipify/DTimeline/DTimelineItem';
  import DTimeline from '@/components/Deipify/DTimeline/DTimeline';
  import DInputDate from '@/components/Deipify/DInput/DInputDate';
  import DTimelineAdd from '@/components/Deipify/DTimeline/DTimelineAdd';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import { attributeSet } from '@/components/Attributes/_mixins/';
  import { arrayModelAddFactory } from '@/mixins/extendModel';
  import DAssetInput from '@/components/Deipify/DInput/DAssetInput';
  import { isString } from '@/utils/helpers';

  const stepModelFactory = () => ({
    goal: undefined,
    eta: undefined,
    budget: undefined,
    purpose: undefined,
    details: undefined,
    isActive: undefined
  });

  export default {
    name: 'AttributesRoadmapSet',

    components: {
      DAssetInput,
      DBlock,
      DTimelineAdd,
      DInputDate,
      DTimeline,
      DTimelineItem
    },

    mixins: [attributeSet, arrayModelAddFactory(stepModelFactory)],
    created() {
      this.addStartItem();

      if (this.value && this.value.some((step) => isString(step.budget))) {
        this.internalValue = [
          ...this.internalValue.map((step) => ({
            ...step,
            ...(
                isString(step.budget)
                  ? { budget: { amount: parseFloat(step.budget.replace(/^\D+/g, '')) } }
                  : { budget: step.budget }
              )
          }))
        ];
      }

      this.$setReady();
    }
  };
</script>
