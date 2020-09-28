<template>
  <component
    :is="attributeComponent"
    v-if="Object.keys(attribute).length"
    :attribute="attribute"
    :view-type="viewType"
    :clamped="clamped"
  />
</template>

<script>
  import { attributeRead, attributeTypeComponent } from '@/components/Attributes/mixins';

  import AttributesCheckboxRead from './AttributesCheckbox/AttributesCheckboxRead';
  import AttributesDisciplinesListRead from './AttributesDisciplinesList/AttributesDisciplinesListRead';
  import AttributesMultiSelectRead from './AttributesMultiSelect/AttributesMultiSelectRead';
  import AttributesPartnersRead from './AttributesPartners/AttributesPartnersRead';
  import AttributesResearchGroupRead from './AttributesResearchGroup/AttributesResearchGroupRead';
  import AttributesRoadmapRead from './AttributesRoadmap/AttributesRoadmapRead';
  import AttributesSelectRead from './AttributesSelect/AttributesSelectRead';
  import AttributesStepperRead from './AttributesStepper/AttributesStepperRead';
  import AttributesSwitchRead from './AttributesSwitch/AttributesSwitchRead';
  import AttributesTextRead from './AttributesText/AttributesTextRead';
  import AttributesTextareaRead from './AttributesTextarea/AttributesTextareaRead';
  import AttributesUrlRead from './AttributesUrl/AttributesUrlRead';
  import AttributesUserRead from './AttributesUser/AttributesUserRead';
  import AttributesUsersListRead from './AttributesUsersList/AttributesUsersListRead';
  import AttributesVideoUrlRead from './AttributesVideoUrl/AttributesVideoUrlRead';

  export default {
    name: 'AttributesRead',
    components: {
      AttributesCheckboxRead,
      AttributesDisciplinesListRead,
      AttributesMultiSelectRead,
      AttributesPartnersRead,
      AttributesResearchGroupRead,
      AttributesRoadmapRead,
      AttributesSelectRead,
      AttributesStepperRead,
      AttributesSwitchRead,
      AttributesTextRead,
      AttributesTextareaRead,
      AttributesUrlRead,
      AttributesUserRead,
      AttributesUsersListRead,
      AttributesVideoUrlRead,
    },
    mixins: [attributeRead, attributeTypeComponent]
  };
</script>

