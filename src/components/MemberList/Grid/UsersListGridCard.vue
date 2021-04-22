<template>
  <v-card
    class="d-flex flex-column"
    outlined
    @click.native="goToUser()"
  >
    <slot name="itemCardActions" :user="$$userExtended" />

    <users-list-item-renderer
      class="d-flex flex-column flex-shrink-1 flex-grow-1"
      :schema="layoutSchema"
      :user="$$userExtended"
    />
  </v-card>
</template>

<script>
  import { usersListItem } from '@/components/MemberList/mixins/usersListItem';

  export default {
    name: 'ProjectsListGridCard',
    mixins: [usersListItem],
    props: {
      layoutKey: {
        type: String,
        default: 'projectListCard'
      }
    }
  };
</script>
