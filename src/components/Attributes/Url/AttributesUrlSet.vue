<template>
  <d-block :title="$$label">
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
  import DTimelineAdd from '@/components/Deipify/DTimeline/DTimelineAdd';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import { attributeSet } from '@/components/Attributes/_mixins';
  import { arrayModelAddFactory } from '@/mixins/extendModel';

  const attrModelFactory = () => ({
    label: undefined,
    url: undefined
  });

  export default {
    name: 'AttributesUrlSet',

    components: {
      DBlock,
      DTimelineAdd,
      DTimeline,
      DTimelineItem
    },

    mixins: [attributeSet, arrayModelAddFactory(attrModelFactory)],
    created() {
      this.addStartItem();
    }
  };
</script>
