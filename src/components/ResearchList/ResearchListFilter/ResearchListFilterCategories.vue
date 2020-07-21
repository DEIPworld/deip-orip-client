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
              v-model="localModel"
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
  import { ResearchListAbstractFilter } from '@/components/ResearchList/ResearchListFilter/ResearchListAbstractFilter';

  export default {
    name: 'ResearchListFilterCategories',
    mixins: [ResearchListAbstractFilter],
    computed: {
      categories() {
        return this.$store.getters['auth/tenant'].profile.settings.researchCategories;
      }
    }
  };
</script>

<style scoped>

</style>
