<template>
  <component
    :is="attributeComponent"
    v-model="internalValue"

    v-bind="attrs$"
  />
</template>

<script>
  import { attributeTypeComponent } from '@/components/Attributes/_mixins';

  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import { AttributesDomainEdit } from '@/components/Attributes/Discipline';
  import { AttributesPartnersEdit } from '@/components/Attributes/Partners';
  import { AttributesTeamSelectEdit } from '@/components/Attributes/ResearchGroup';
  import { AttributesRoadmapEdit } from '@/components/Attributes/Roadmap';
  import { AttributesSelectEdit } from '@/components/Attributes/Select';
  import { AttributesStepperEdit } from '@/components/Attributes/Stepper';
  import { AttributesSwitchEdit } from '@/components/Attributes/Switch';
  import { AttributesTextEdit } from '@/components/Attributes/Text';
  import { AttributesTextareaEdit } from '@/components/Attributes/Textarea';
  import { AttributesUrlEdit } from '@/components/Attributes/Url';
  import { AttributesUserSelectEdit } from '@/components/Attributes/User';
  import { AttributesVideoUrlEdit } from '@/components/Attributes/VideoUrl';
  import { AttributesImageEdit } from '@/components/Attributes/Image';
  import { AttributesExpressLicensingEdit } from '@/components/Attributes/ExpressLicensing';
  import { AttributesCheckboxEdit } from '@/components/Attributes/Checkbox';
  import { AttributesNetworkContentAccessEdit } from '@/components/Attributes/NetworkContentAccess';
  import { AttributesDateEdit } from '@/components/Attributes/Date';
  import { AttributesEducationEdit } from '@/components/Attributes/Education';
  import { ATTR_TYPES } from '@/variables';

  export default {
    name: 'AttributesEdit',
    components: {
      AttributesCheckboxEdit,
      AttributesDomainEdit,
      AttributesPartnersEdit,
      AttributesTeamSelectEdit,
      AttributesRoadmapEdit,
      AttributesSelectEdit,
      AttributesStepperEdit,
      AttributesSwitchEdit,
      AttributesTextEdit,
      AttributesTextareaEdit,
      AttributesUrlEdit,
      AttributesUserSelectEdit,
      AttributesVideoUrlEdit,
      AttributesImageEdit,
      AttributesExpressLicensingEdit,
      AttributesNetworkContentAccessEdit,
      AttributesDateEdit,
      AttributesEducationEdit
    },
    mixins: [attributeTypeComponent, Proxyable, BindsAttrs],
    props: {
      type: {
        type: [String, Number],
        default: ATTR_TYPES.TEXT || 'text',
        validator(val) {
          return ATTR_TYPES.indexOf(val) !== -1;
        }
      }
    }
  };
</script>
