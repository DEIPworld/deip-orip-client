<template>
  <div :class="$style.host">
    <research-list-card
      v-for="item in items"
      :key="'list-item-' + item.external_id"
      :research="item"
    />
  </div>
</template>

<script>
  import ResearchListCard from '@/components/ResearchList/ResearchListItem/ResearchListCard';

  export default {
    name: 'ResearchListGrid',
    components: { ResearchListCard },
    props: {
      items: {
        type: Array,
        default: () => ([])
      }
    }
  };
</script>

<style module lang="scss">
  .host {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: 1.5rem;
  }
</style>
