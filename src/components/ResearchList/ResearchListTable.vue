<template>
  <div>
    <v-divider />
    <v-simple-table>
      <tbody>
        <research-list-item-row
          v-for="item in items"
          :key="'list-item-' + item.external_id"
          :research="item"
        />
      </tbody>
    </v-simple-table>
    <v-divider />
  </div>
</template>

<script>
  import ResearchListItemRow from '@/components/ResearchList/ResearchListItem/ResearchListItemRow';

  export default {
    name: 'ResearchListTable',
    components: { ResearchListItemRow },
    props: {
      items: {
        type: Array,
        default: () => ([])
      }
    }
  };
</script>
