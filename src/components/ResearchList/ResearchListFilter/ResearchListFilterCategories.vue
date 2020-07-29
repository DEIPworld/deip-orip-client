<template>
  <d-block
    v-if="categories.length"
    title="Categories"
    sm
  >
    <d-list-expand :active="categories.length > 4">
      <template #default="{expanded}">
        <div class="mt-n2">
          <template v-for="(category, i) in categories">
            <v-checkbox
              v-if="expanded || i < 4"
              :key="'category-filter-' + category._id"
              v-model="internalValue"
              :label="category.text"
              :value="category._id"
              hide-details
              class="mt-2 mb-0"
            />
          </template>
        </div>
      </template>
    </d-list-expand>
  </d-block>
</template>

<script>

  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DListExpand from '@/components/Deipify/DListExpand/DListExpand';

  export default {
    name: 'ResearchListFilterCategories',
    components: {
      DBlock,
      DListExpand
    },
    mixins: [Proxyable],
    computed: {
      categories() {
        return this.$store.getters['auth/tenant'].profile.settings.researchCategories;
      }
    }
  };
</script>

<style scoped>

</style>
