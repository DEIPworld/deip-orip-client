<template>
  <component
    :is="attributeComponent"
    v-model="internalValue"
    :attribute="attribute"
    :class="{'visually-hidden': attribute.isHidden}"
    v-bind="attrs$"
  />
</template>

<script>
  import { attributeSet, attributeTypeComponent, PROPS } from '@/components/Attributes/mixins';
  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

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

    mixins: [attributeTypeComponent, Proxyable, BindsAttrs],
    props: {
      ...{ attribute: PROPS.attribute }
    }
  };
</script>
