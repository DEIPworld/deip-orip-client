<template>
  <div>
    <v-skeleton-loader
      type="table-tbody"
      :loading="loading"
      transition="fade-transition"
    >
      <v-data-table
        :headers="headers"
        :items="users"
        disable-sort
        v-bind="iteratorProps"
        @update:page="onUpdatePage"
      >
        <template #item="{ item }">
          <users-list-table-row
            :key="item.username"
            :user="item"
            :layout-key="rowLayoutKey"
          >
            <template #itemRowActions="{ user }">
              <slot name="itemRowActions" :user="user" />
            </template>
          </users-list-table-row>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <v-divider v-if="users.length < 50" />
  </div>
</template>

<script>
  import usersListTableRow from '@/components/MemberList/Table/UsersListTableRow';
  import { usersView } from '@/components/MemberList/mixins/userView';

  export default {
    name: 'UsersListTable',
    components: { usersListTableRow },
    mixins: [usersView],
    props: {
      rowLayoutKey: {
        type: String,
        default: 'userListRow'
      }
    },
    computed: {
      headers() {
        const { layout } = this.$portalSettings.layouts[this.rowLayoutKey];

        const row = _.cloneDeep(layout[0]);

        if (row) {
          return [
            ...row.children.map((cell) => ({
              text: cell.attrs && cell.attrs.title ? cell.attrs.title : '',
              ...cell.attrs
            })),
            ...(this.$scopedSlots.itemRowActions ? [{}] : [])
          ];
        }

        return [];
      }
    }
  };
</script>
