<template>
  <d-block small :title="label" class="mt-6">
    <d-timeline>
      <d-timeline-item
        v-for="(option, index) of internalValue.valueOptions"
        :key="`row-${index}`"
        :dot-top="16"
        :ctrl-height="48"
      >
        <template #dot>
          <slot name="dot" :option="option" :index="index" />
        </template>

        <attributes-common-edit-node
          v-model="internalValue.valueOptions[index]"
          :field-label-key="fieldLabelKey"
          :class="{ 'mb-6': index + 1 < internalValue.valueOptions.length }"
        />

        <template #action>
          <v-btn icon @click="removeOption(index)">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </d-timeline-item>
      <d-timeline-add @click="addOption()" />
    </d-timeline>
  </d-block>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DTimelineAdd from '@/components/Deipify/DTimeline/DTimelineAdd';
  import DTimelineItem from '@/components/Deipify/DTimeline/DTimelineItem';
  import AttributesCommonEditNode from '@/components/Attributes/AttributesCommon/AttributesCommonEditNode';
  import DTimeline from '@/components/Deipify/DTimeline/DTimeline';

  export default {
    name: 'AttributesCommonEditOpts',
    components: {
      DTimeline,
      AttributesCommonEditNode,
      DTimelineItem,
      DTimelineAdd,
      DBlock
    },
    mixins: [Proxyable],
    props: {
      label: {
        type: String,
        default: 'Options'
      },
      fieldLabelKey: {
        type: String,
        default: 'Option'
      }
    },
    created() {
      if (!this.internalValue.valueOptions.length) {
        this.addOption();
      }
    },
    methods: {
      addOption() {
        this.internalValue.valueOptions.push(
          {
            title: '',
            shortTitle: '',
            description: ''
          }
        );
      },
      removeOption(index) {
        this.$delete(this.internalValue.valueOptions, index);
      }
    }
  };
</script>
