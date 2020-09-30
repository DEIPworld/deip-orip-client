<template>
  <d-grid>
    <research-list-item-card
      v-for="item in items"
      :key="'list-item-' + item.external_id"
      :research="item"
    />
  </d-grid>
</template>

<script>
  import ResearchListItemCard from '@/components/ResearchList/ResearchListItem/ResearchListItemCard';
  import DGrid from '@/components/Deipify/DGrid/DGrid';

  export default {
    name: 'ResearchListGrid',
    components: { DGrid, ResearchListItemCard },
    props: {
      items: {
        type: Array,
        default: () => ([])
      }
    }
  };
</script>
