<template>
  <div :class="{'visually-hidden': attribute.isHidden}">
    <!-- {{attributeComponent}}-->
    <component
      :is="attributeComponent"
      v-model="internalValue"
      :attribute="attribute"
      v-bind="attrs$"
    />
  </div>
</template>

<script>
  import { attributeTypeComponent } from '@/components/Attributes/_mixins';

  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import { AttributesCheckboxSet } from '@/components/Attributes/Checkbox';
  import { AttributesDomainSet } from '@/components/Attributes/Discipline';
  import { AttributesPartnersSet } from '@/components/Attributes/Partners';
  import { AttributesRoadmapSet } from '@/components/Attributes/Roadmap';
  import { AttributesTeamSelectSet } from '@/components/Attributes/ResearchGroup';
  import { AttributesSelectSet } from '@/components/Attributes/Select';
  import { AttributesStepperSet } from '@/components/Attributes/Stepper';
  import { AttributesSwitchSet } from '@/components/Attributes/Switch';
  import { AttributesTextSet } from '@/components/Attributes/Text';
  import { AttributesTextareaSet } from '@/components/Attributes/Textarea';
  import { AttributesUrlSet } from '@/components/Attributes/Url';
  import { AttributesUserSelectSet } from '@/components/Attributes/User';
  import { AttributesVideoUrlSet } from '@/components/Attributes/VideoUrl';
  import { AttributesImageSet } from '@/components/Attributes/Image';
  import { AttributesExpressLicensingSet } from '@/components/Attributes/ExpressLicensing';
  import { AttributesNetworkContentAccessSet } from '@/components/Attributes/NetworkContentAccess';
  import { AttributesDateSet } from '@/components/Attributes/Date';

  export default {
    name: 'AttributesSet',
    components: {
      AttributesCheckboxSet,
      AttributesDomainSet,
      AttributesPartnersSet,
      AttributesTeamSelectSet,
      AttributesRoadmapSet,
      AttributesSelectSet,
      AttributesStepperSet,
      AttributesSwitchSet,
      AttributesTextSet,
      AttributesTextareaSet,
      AttributesUrlSet,
      AttributesUserSelectSet,
      AttributesVideoUrlSet,
      AttributesImageSet,
      AttributesExpressLicensingSet,
      AttributesNetworkContentAccessSet,
      AttributesDateSet
    },

    mixins: [attributeTypeComponent, Proxyable, BindsAttrs],
    props: {
      attribute: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
