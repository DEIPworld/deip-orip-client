<template>
  <component
    :is="componentType"
    v-model="internalValue"
    :attribute="attribute"
    :small="small"
  />
</template>

<script>
  import AttributesTextRead from '@/components/Attributes/AttributesText/AttributesTextRead';
  import AttributesTextareaRead from '@/components/Attributes/AttributesTextarea/AttributesTextareaRead';
  import AttributesSelectRead from '@/components/Attributes/AttributesSelect/AttributesSelectRead';
  import AttributesMultiSelectRead from '@/components/Attributes/AttributesMultiSelect/AttributesMultiSelectRead';
  import AttributesStepperRead from '@/components/Attributes/AttributesStepper/AttributesStepperRead';
  import AttributesVideoUrlRead from '@/components/Attributes/AttributesVideoUrl/AttributesVideoUrlRead';
  import AttributesRoadmapRead from '@/components/Attributes/AttributesRoadmap/AttributesRoadmapRead';
  import AttributesPartnersRead from '@/components/Attributes/AttributesPartners/AttributesPartnersRead';

  import { commonAttribute, internalType } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesRead',
    components: {
      AttributesTextRead,
      AttributesTextareaRead,
      AttributesSelectRead,
      AttributesMultiSelectRead,
      AttributesStepperRead,
      AttributesVideoUrlRead,
      AttributesRoadmapRead,
      AttributesPartnersRead
    },
    mixins: [commonAttribute, internalType],
    computed: {
      componentType() {
        return `attributes-${this.internalType}-read`;
      }
    }
  };
</script>
