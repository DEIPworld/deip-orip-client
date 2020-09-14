<template>
  <d-grid>
    <research-list-card
      v-for="item in items"
      :key="'list-item-' + item.external_id"
      :research="item"
    />
  </d-grid>
</template>

<script>
  import ResearchListCard from '@/components/ResearchList/ResearchListItem/ResearchListCard/ResearchListCard';
  import DGrid from '@/components/Deipify/DGrid/DGrid';

  export default {
    name: 'ResearchListGrid',
    components: { DGrid, ResearchListCard },
    props: {
      items: {
        type: Array,
        default: () => ([])
      }
    }
  };
</script>
