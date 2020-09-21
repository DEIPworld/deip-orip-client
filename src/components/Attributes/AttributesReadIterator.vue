<template>
  <d-stack :gap="gap">
<!--    {{internalAttributes}}-->
    <attributes-read
      v-for="(attribute, index) in internalAttributes"
      :key="`${index}-attr`"

      :value="attribute.value"
      :attribute-id="attribute.researchAttributeId"

      :attribute="attribute"
      :view-type="viewType"
    />
  </d-stack>
</template>

<script>
  import AttributesRead from '@/components/Attributes/AttributesRead';
  import DStack from '@/components/Deipify/DStack/DStack';
  import { PROPS } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesReadIterator',
    components: { DStack, AttributesRead },
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
            .map((id) => this.attributes.find((attr) => attr.researchAttributeId === id))
            .filter((attr) => !!attr);
      }
    }
  };
</script>
