<template>
  <div>
    <v-divider />
    <v-simple-table>
      <tbody>
<!--        <research-list-row-->
<!--          v-for="item in items"-->
<!--          :key="'list-item-' + item.external_id"-->
<!--          :research="item"-->
<!--        />-->
      </tbody>
    </v-simple-table>
    <v-divider />
  </div>
</template>

<script>
  import ResearchListRow from '@/components/ResearchList/ResearchListItem/ResearchListRow';

  export default {
    name: 'ResearchListTable',
    components: { ResearchListRow },
    props: {
      items: {
        type: Array,
        default: () => ([])
      }
    }
  };
</script>
