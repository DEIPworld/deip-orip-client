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

  import { AttributesDisciplineEdit } from '@/components/Attributes/Discipline';
  import { AttributesPartnersEdit } from '@/components/Attributes/Partners';
  import { AttributesResearchGroupEdit } from '@/components/Attributes/ResearchGroup';
  import { AttributesRoadmapEdit } from '@/components/Attributes/Roadmap';
  import { AttributesSelectEdit } from '@/components/Attributes/Select';
  import { AttributesStepperEdit } from '@/components/Attributes/Stepper';
  import { AttributesSwitchEdit } from '@/components/Attributes/Switch';
  import { AttributesTextEdit } from '@/components/Attributes/Text';
  import { AttributesTextareaEdit } from '@/components/Attributes/Textarea';
  import { AttributesUrlEdit } from '@/components/Attributes/Url';
  import { AttributesUserEdit } from '@/components/Attributes/User';
  import { AttributesVideoUrlEdit } from '@/components/Attributes/VideoUrl';
  import { AttributesImageEdit } from '@/components/Attributes/Image';
  import { AttributesExpressLicensingEdit } from '@/components/Attributes/ExpressLicensing';
  import { AttributesCheckboxEdit } from '@/components/Attributes/Checkbox';
  import { AttributesNetworkContentAccessEdit } from '@/components/Attributes/NetworkContentAccess';
  import { ATTR_TYPES } from '@/variables';

  export default {
    name: 'AttributesEdit',
    components: {
      AttributesCheckboxEdit,
      AttributesDisciplineEdit,
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
      AttributesVideoUrlEdit,
      AttributesImageEdit,
      AttributesExpressLicensingEdit,
      AttributesNetworkContentAccessEdit
    },
    mixins: [attributeTypeComponent, Proxyable, BindsAttrs],
    props: {
      type: {
        type: String,
        default: ATTR_TYPES.TEXT,
        validator(val) {
          return Object.values(ATTR_TYPES)
            .indexOf(val) !== -1;
        }
      }
    }
  };
</script>
