<template>
  <div>
    <v-divider />
    <v-simple-table>
      <thead>
        <tr>
          <th
            v-for="(cell, index) of tableHeaderCells"
            :key="index"
            :class="cell.class"
            v-bind="cell.attrs"
          >
            {{ cell.text }}
          </th>
        </tr>
      </thead>
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
    },
    computed: {
      tableHeaderCells() {
        const { layout } = this.$tenantSettings.researchLayouts.projectListRow;
        const row = _.cloneDeep(layout[0]);

        if (row) {
          return row.children.map((cell) => ({
            text: cell.attrs && cell.attrs.title ? cell.attrs.title : '',
            class: cell.class || {},
            attrs: cell.attrs || {}
          }));
        }

        return [];
      }
    }
  };
</script>
