<template>
  <div class="ma-6">
    <attributes-set
      v-for="(attribute, index) of researchAttributes"
      :key="`${index}-attr`"
      v-model="internalValue[attribute._id]"
      :attribute="attribute"
      view-type="filter"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import AttributesSet from '@/components/Attributes/AttributesSet';

  export default {
    name: 'DFilterTermComponents',

    components: {
      AttributesSet
    },

    mixins: [Proxyable],

    data() {
      return {
        researchAttributes: []
      };
    },

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      })
    },

    created() {
      this.researchAttributes = this.$options.filters.where(
        this.tenant.profile.settings.researchAttributes,
        (attr) => attr.isFilterable && attr.isPublished
      );
    }
  };
</script>
