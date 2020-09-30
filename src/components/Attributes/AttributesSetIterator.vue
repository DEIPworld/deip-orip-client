<template>
  <d-stack :gap="gap">
    <attributes-set
      v-for="(attr, index) in internalAttributes"
      :key="`${index}-attr`"
      v-model="internalValue[attr._id]"

      :attribute="attr"
      :view-type="viewType"
    />
  </d-stack>
</template>

<script>
  import DStack from '@/components/Deipify/DStack/DStack';
  import { PROPS } from '@/components/Attributes/mixins';
  import AttributesSet from '@/components/Attributes/AttributesSet';
  import { tenantAttributes } from '@/mixins/platformAttributes';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'AttributesReadIterator',
    components: { AttributesSet, DStack },
    mixins: [tenantAttributes, Proxyable],
    props: {
      attributes: {
        type: Array,
        default: () => ([])
      },
      area: {
        type: String,
        default: null
      },
      gap: {
        type: [Number, String],
        default: 24
      },
      // eslint-disable-next-line vue/require-default-prop
      viewType: PROPS.viewType
    },
    computed: {
      internalAttributes() {
        return !this.area
          ? this.attributes
          : this.$tenantSettings.researchAttributesAreas[this.area]
            .map((id) => this.attributes.find((attr) => attr._id === id));
      }
    }
  };
</script>
