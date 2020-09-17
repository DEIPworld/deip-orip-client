<template>
  <component
    :is="attributeTypeComponent"
    v-model="internalValue"
    :attribute-id="attributeId"
    :view-type="viewType"
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
  import AttributesUrlRead from '@/components/Attributes/AttributesUrl/AttributesUrlRead';
  import AttributesCheckboxRead from '@/components/Attributes/AttributesCheckbox/AttributesCheckboxRead';
  import AttributesSwitchRead from '@/components/Attributes/AttributesSwitch/AttributesSwitchRead';

  import { commonAttribute, attributeTypeComponent } from '@/components/Attributes/mixins';

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
      AttributesPartnersRead,
      AttributesUrlRead,
      AttributesCheckboxRead,
      AttributesSwitchRead
    },
    mixins: [commonAttribute, attributeTypeComponent]
  };
</script>
