<template>
  <div>
    <component
      :is="attributeTypeComponent"
      v-model="internalValue"
      :attribute-id="attributeId"
      :multiple="multiple"
    />
  </div>

</template>

<script>
  import AttributesTextSet from '@/components/Attributes/AttributesText/AttributesTextSet';
  import AttributesTextareaSet from '@/components/Attributes/AttributesTextarea/AttributesTextareaSet';
  import AttributesSelectSet from '@/components/Attributes/AttributesSelect/AttributesSelectSet';
  import AttributesMultiSelectSet from '@/components/Attributes/AttributesMultiSelect/AttributesMultiSelectSet';
  import AttributesStepperSet from '@/components/Attributes/AttributesStepper/AttributesStepperSet';
  import AttributesVideoUrlSet from '@/components/Attributes/AttributesVideoUrl/AttributesVideoUrlSet';
  import AttributesRoadmapSet from '@/components/Attributes/AttributesRoadmap/AttributesRoadmapSet';
  import AttributesPartnersSet from '@/components/Attributes/AttributesPartners/AttributesPartnersSet';
  import AttributesUrlSet from '@/components/Attributes/AttributesUrl/AttributesUrlSet';
  import AttributesCheckboxSet from '@/components/Attributes/AttributesCheckbox/AttributesCheckboxSet';
  import AttributesSwitchSet from '@/components/Attributes/AttributesSwitch/AttributesSwitchSet';

  import { commonAttribute, attributeTypeComponent } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesSet',
    components: {
      AttributesTextSet,
      AttributesTextareaSet,
      AttributesSelectSet,
      AttributesMultiSelectSet,
      AttributesStepperSet,
      AttributesVideoUrlSet,
      AttributesRoadmapSet,
      AttributesPartnersSet,
      AttributesUrlSet,
      AttributesCheckboxSet,
      AttributesSwitchSet
    },
    mixins: [commonAttribute, attributeTypeComponent]
  };
</script>
