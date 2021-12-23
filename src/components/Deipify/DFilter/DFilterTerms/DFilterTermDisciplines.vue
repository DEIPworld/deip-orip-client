<template>
  <div v-if="domains.length">
    <v-select
      v-if="singleChoice"
      v-model="internalValue"
      :items="[{ name: $t('defaultNaming.all'), _id: '' }, ...domains]"
      outlined
      hide-details
      :label="$t('defaultNaming.filters.domainField')"
      item-text="name"
      item-value="_id"
    />

    <d-block
      v-if="!singleChoice"
      :title="$t('defaultNaming.filters.domainField')"
      widget="compact"
    >
      <d-list-expand :active="domains.length > 4">
        <template #default="{expanded}">
          <div class="mt-n2">
            <template v-for="(domain, i) in domains">
              <v-checkbox
                v-if="expanded || i < 4"
                :key="'domain-filter-' + i"
                v-model="internalValue"
                :label="domain.name"
                :value="domain._id"
                hide-details
                class="mt-2 mb-0"
              />
            </template>
          </div>
        </template>
      </d-list-expand>
    </d-block>
  </div>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DListExpand from '@/components/Deipify/DListExpand/DListExpand';

  export default {
    name: 'DFilterTermDomains',
    components: {
      DBlock,
      DListExpand
    },

    mixins: [Proxyable],

    props: {
      singleChoice: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      domains() {
        return [...this.$store.getters['Domains/topLevelList']().sort(
          (a, b) => a.name.localeCompare(b.name)
        )];
      }
    }
  };
</script>

<style scoped>

</style>
