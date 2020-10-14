<template>
  <component
    :is="attributeComponent"
    v-if="!attribute.isHidden"
    :attribute="attribute"
    :view-type="viewType"
    v-bind="attrs$"
  />
</template>

<script>
  import { attributeSet, attributeTypeComponent } from '@/components/Attributes/mixins';
  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';

  import AttributesCheckboxSet from './AttributesCheckbox/AttributesCheckboxSet';
  import AttributesDisciplinesListSet from './AttributesDisciplinesList/AttributesDisciplinesListSet';
  import AttributesMultiSelectSet from './AttributesMultiSelect/AttributesMultiSelectSet';
  import AttributesPartnersSet from './AttributesPartners/AttributesPartnersSet';
  import AttributesResearchGroupSet from './AttributesResearchGroup/AttributesResearchGroupSet';
  import AttributesRoadmapSet from './AttributesRoadmap/AttributesRoadmapSet';
  import AttributesSelectSet from './AttributesSelect/AttributesSelectSet';
  import AttributesStepperSet from './AttributesStepper/AttributesStepperSet';
  import AttributesSwitchSet from './AttributesSwitch/AttributesSwitchSet';
  import AttributesTextSet from './AttributesText/AttributesTextSet';
  import AttributesTextareaSet from './AttributesTextarea/AttributesTextareaSet';
  import AttributesUrlSet from './AttributesUrl/AttributesUrlSet';
  import AttributesUserSet from './AttributesUser/AttributesUserSet';
  import AttributesUsersListSet from './AttributesUsersList/AttributesUsersListSet';
  import AttributesVideoUrlSet from './AttributesVideoUrl/AttributesVideoUrlSet';
  import AttributesImageSet from './AttributesImage/AttributesImageSet';
  import AttributesExpressLicensingSet from './AttributesExpressLicensing/AttributesExpressLicensingSet';

  export default {
    name: 'AttributesSet',
    components: {
      AttributesCheckboxSet,
      AttributesDisciplinesListSet,
      AttributesMultiSelectSet,
      AttributesPartnersSet,
      AttributesResearchGroupSet,
      AttributesRoadmapSet,
      AttributesSelectSet,
      AttributesStepperSet,
      AttributesSwitchSet,
      AttributesTextSet,
      AttributesTextareaSet,
      AttributesUrlSet,
      AttributesUserSet,
      AttributesUsersListSet,
      AttributesVideoUrlSet,
      AttributesImageSet,
      AttributesExpressLicensingSet,
    },

    mixins: [attributeSet, attributeTypeComponent, BindsAttrs]
  };
</script>
