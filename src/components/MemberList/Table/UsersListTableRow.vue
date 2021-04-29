<template>
  <users-list-item-renderer
    :schema="layoutSchemaExtended"
    :user="$$userExtended"
    tag="tr"
    class="cursor-pointer"
    @click.native="goToUser()"
  >
    <template #itemRowActions>
      <slot name="itemRowActions" :user="user" />
    </template>
  </users-list-item-renderer>
</template>

<script>
  import { usersListItem } from '@/components/MemberList/mixins/usersListItem';

  export default {
    name: 'UsersListTableRow',
    mixins: [usersListItem],
    props: {
      layoutKey: {
        type: String,
        default: 'userListRow'
      }
    },
    computed: {
      layoutSchemaExtended() {
        const layout = this.layoutSchema;

        const row = _.cloneDeep(layout[0]);

        if (row) {
          for (const cell of row.children) {
            delete cell.attrs.title;
          }

          if (this.$scopedSlots.itemRowActions) {
            row.children.push({
              component: 'td',
              slotName: 'itemRowActions'
            });
          }
          return row.children;
        }
        return layout;
      }
    }
  };
</script>
