<template>
  <component
    :is="attributeComponent"
    v-model="internalValue"
  />
</template>

<script>
  import { attributeEdit, attributeTypeComponent } from '@/components/Attributes/mixins';

  import AttributesCheckboxEdit from './AttributesCheckbox/AttributesCheckboxEdit';
  import AttributesDisciplinesListEdit from './AttributesDisciplinesList/AttributesDisciplinesListEdit';
  import AttributesMultiSelectEdit from './AttributesMultiSelect/AttributesMultiSelectEdit';
  import AttributesPartnersEdit from './AttributesPartners/AttributesPartnersEdit';
  import AttributesResearchGroupEdit from './AttributesResearchGroup/AttributesResearchGroupEdit';
  import AttributesRoadmapEdit from './AttributesRoadmap/AttributesRoadmapEdit';
  import AttributesSelectEdit from './AttributesSelect/AttributesSelectEdit';
  import AttributesStepperEdit from './AttributesStepper/AttributesStepperEdit';
  import AttributesSwitchEdit from './AttributesSwitch/AttributesSwitchEdit';
  import AttributesTextEdit from './AttributesText/AttributesTextEdit';
  import AttributesTextareaEdit from './AttributesTextarea/AttributesTextareaEdit';
  import AttributesUrlEdit from './AttributesUrl/AttributesUrlEdit';
  import AttributesUserEdit from './AttributesUser/AttributesUserEdit';
  import AttributesUsersListEdit from './AttributesUsersList/AttributesUsersListEdit';
  import AttributesVideoUrlEdit from './AttributesVideoUrl/AttributesVideoUrlEdit';

  export default {
    name: 'AttributesEdit',
    components: {
      AttributesCheckboxEdit,
      AttributesDisciplinesListEdit,
      AttributesMultiSelectEdit,
      AttributesPartnersEdit,
      AttributesResearchGroupEdit,
      AttributesRoadmapEdit,
      AttributesSelectEdit,
      AttributesStepperEdit,
      AttributesSwitchEdit,
      AttributesTextEdit,
      AttributesTextareaEdit,
      AttributesUrlEdit,
      AttributesUserEdit,
      AttributesUsersListEdit,
      AttributesVideoUrlEdit,
    },
    mixins: [attributeEdit, attributeTypeComponent]
  };
</script>
