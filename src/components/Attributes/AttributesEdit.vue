<template>
  <component
    :is="attributeComponent"
    v-model="internalValue"

    v-bind="attrs$"
  />
</template>

<script>
  import { attributeTypeComponent, PROPS } from '@/components/Attributes/mixins';

  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import AttributesCheckboxEdit from './AttributesCheckbox/AttributesCheckboxEdit';
  import AttributesDisciplinesListEdit from './AttributesDisciplinesList/AttributesDisciplinesListEdit';
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
  import AttributesImageEdit from './AttributesImage/AttributesImageEdit';
  import AttributesExpressLicensingEdit from './AttributesExpressLicensing/AttributesExpressLicensingEdit';

  export default {
    name: 'AttributesEdit',
    components: {
      AttributesCheckboxEdit,
      AttributesDisciplinesListEdit,
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
      AttributesImageEdit,
      AttributesExpressLicensingEdit,
    },
    mixins: [attributeTypeComponent, Proxyable, BindsAttrs],
    props: {
      ...{ type: PROPS.type }
    }
  };
</script>
