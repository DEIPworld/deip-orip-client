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
  import { attributeTypeComponent } from '@/components/Attributes/_mixins';

  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import { AttributesCheckboxSet } from '@/components/Attributes/Checkbox';
  import { AttributesDisciplineSet } from '@/components/Attributes/Discipline';
  import { AttributesPartnersSet } from '@/components/Attributes/Partners';
  import { AttributesRoadmapSet } from '@/components/Attributes/Roadmap';
  import { AttributesResearchGroupSet } from '@/components/Attributes/ResearchGroup';
  import { AttributesSelectSet } from '@/components/Attributes/Select';
  import { AttributesStepperSet } from '@/components/Attributes/Stepper';
  import { AttributesSwitchSet } from '@/components/Attributes/Switch';
  import { AttributesTextSet } from '@/components/Attributes/Text';
  import { AttributesTextareaSet } from '@/components/Attributes/Textarea';
  import { AttributesUrlSet } from '@/components/Attributes/Url';
  import { AttributesUserSet } from '@/components/Attributes/User';
  import { AttributesVideoUrlSet } from '@/components/Attributes/VideoUrl';
  import { AttributesImageSet } from '@/components/Attributes/Image';
  import { AttributesExpressLicensingSet } from '@/components/Attributes/ExpressLicensing';
  import { commonProps } from '@/variables/props';

  export default {
    name: 'AttributesSet',
    components: {
      AttributesCheckboxSet,
      AttributesDisciplineSet,
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
      AttributesVideoUrlSet,
      AttributesImageSet,
      AttributesExpressLicensingSet,
    },

    mixins: [attributeTypeComponent, Proxyable, BindsAttrs],
    props: {
      ...commonProps.attribute
    }
  };
</script>
