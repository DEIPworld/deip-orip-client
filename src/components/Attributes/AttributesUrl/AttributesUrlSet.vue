<template>
  <d-block :title="attribute.title">
    <d-timeline>
      <d-timeline-item
        v-for="(item, index) of internalValue"
        :key="`row-${index}`"
        :dot-top="16"
        :ctrl-height="48"
      >

        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="item.label"
              label="Label"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="item.url"
              label="URL"
              outlined
              hide-details="auto"
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
  import DTimelineAdd from '@/components/Deipify/DTimeline/DTimelineAdd';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import { attributeSet } from '@/components/Attributes/mixins';

  const attrModel = () => ({
    label: '',
    url: ''
  });

  export default {
    name: 'AttributesUrlSet',

    components: {
      DBlock,
      DTimelineAdd,
      DTimeline,
      DTimelineItem
    },

    mixins: [arrayModelAddFactory(attrModel()), attributeSet],

    created() {
      if (!this.internalValue) {
        this.internalValue = [];
      }
    }
  };
</script>
