<template>
  <div>
    <d-block
      v-for="(attribute, index) of researchAttributes"
      :key="`${index}-attr`"
      widget="compact"
      :title="attribute.title"
    >
      <attributes-set
        v-model="internalValue[attribute._id]"
        :attribute="attribute"
        view-type="filter"
      />
    </d-block>
  </div>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import AttributesSet from '@/components/Attributes/AttributesSet';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  export default {
    name: 'DFilterTermComponents',

    components: {
      DBlock,
      AttributesSet
    },

    mixins: [Proxyable],

    data() {
      return {
        researchAttributes: []
      };
    },

    created() {
      this.researchAttributes = this.$where(
        this.$tenantSettings.researchAttributes,
        (attr) => attr.isFilterable && attr.isPublished
      );
    }
  };
</script>
