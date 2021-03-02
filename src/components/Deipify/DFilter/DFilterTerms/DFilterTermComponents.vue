<template>
  <d-stack :gap="24" class="px-6">
    <!--    <pre>{{JSON.stringify($tenantSettings.researchAttributes, null, 2)}}</pre>-->
    <!--    <pre>{{JSON.stringify(researchAttributes, null, 2)}}</pre>-->

    <attributes-set
      v-for="(attribute, index) of researchAttributes"
      :key="`${index}-attr`"
      v-model="internalValue[attribute._id]"
      :attribute="attribute"
      view-type="filter"
      style="display: grid"
    />
  </d-stack>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import AttributesSet from '@/components/Attributes/AttributesSet';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'DFilterTermComponents',

    components: {
      DStack,
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
        (attr) => attr.isFilterable
      );
    }
  };
</script>
