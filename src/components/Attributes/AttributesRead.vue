<template>
  <component
    :is="attributeComponent"
    v-if="Object.keys(attribute).length"
    :attribute="attribute"

    v-bind="attrs$"
  />
</template>

<script>
  import { attributeTypeComponent } from '@/components/Attributes/_mixins';

  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';

  import { AttributesCheckboxRead } from '@/components/Attributes/Checkbox';
  import { AttributesDisciplinesListRead } from '@/components/Attributes/DisciplinesList';
  import { AttributesPartnersRead } from '@/components/Attributes/Partners';
  import { AttributesResearchGroupRead } from '@/components/Attributes/ResearchGroup';
  import { AttributesRoadmapRead } from '@/components/Attributes/Roadmap';
  import { AttributesSelectRead } from '@/components/Attributes/Select';
  import { AttributesStepperRead } from '@/components/Attributes/Stepper';
  import { AttributesSwitchRead } from '@/components/Attributes/Switch';
  import { AttributesTextRead } from '@/components/Attributes/Text';
  import { AttributesTextareaRead } from '@/components/Attributes/Textarea';
  import { AttributesUrlRead } from '@/components/Attributes/Url';
  import { AttributesUserRead } from '@/components/Attributes/User';
  import { AttributesVideoUrlRead } from '@/components/Attributes/VideoUrl';
  import { AttributesImageRead } from '@/components/Attributes/Image';
  import { AttributesExpressLicensingRead } from '@/components/Attributes/ExpressLicensing';
  import { commonProps } from '@/variables/props';

  export default {
    name: 'AttributesRead',
    components: {
      AttributesCheckboxRead,
      AttributesDisciplinesListRead,
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
      AttributesVideoUrlRead,
      AttributesImageRead,
      AttributesExpressLicensingRead
    },
    mixins: [attributeTypeComponent, BindsAttrs],
    props: {
      ...commonProps.attribute
    }
  };
</script>
