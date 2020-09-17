<template>
  <component
    :is="attributeTypeComponent"
    v-model="internalValue"
  />
</template>

<script>
  import AttributesTextEdit from '@/components/Attributes/AttributesText/AttributesTextEdit';
  import AttributesTextareaEdit from '@/components/Attributes/AttributesTextarea/AttributesTextareaEdit';
  import AttributesSelectEdit from '@/components/Attributes/AttributesSelect/AttributesSelectEdit';
  import AttributesMultiSelectEdit from '@/components/Attributes/AttributesMultiSelect/AttributesMultiSelectEdit';
  import AttributesStepperEdit from '@/components/Attributes/AttributesStepper/AttributesStepperEdit';
  import AttributesVideoUrlEdit from '@/components/Attributes/AttributesVideoUrl/AttributesVideoUrlEdit';
  import AttributesRoadmapEdit from '@/components/Attributes/AttributesRoadmap/AttributesRoadmapEdit';
  import AttributesPartnersEdit from '@/components/Attributes/AttributesPartners/AttributesPartnersEdit';
  import AttributesUrlEdit from '@/components/Attributes/AttributesUrl/AttributesUrlEdit';
  import AttributesCheckboxEdit from '@/components/Attributes/AttributesCheckbox/AttributesCheckboxEdit';
  import AttributesSwitchEdit from '@/components/Attributes/AttributesSwitch/AttributesSwitchEdit';

  import { commonAttribute, attributeTypeComponent } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesEdit',
    components: {
      AttributesTextEdit,
      AttributesTextareaEdit,
      AttributesSelectEdit,
      AttributesMultiSelectEdit,
      AttributesStepperEdit,
      AttributesVideoUrlEdit,
      AttributesRoadmapEdit,
      AttributesPartnersEdit,
      AttributesUrlEdit,
      AttributesCheckboxEdit,
      AttributesSwitchEdit
    },
    mixins: [commonAttribute, attributeTypeComponent],
  };
</script>
