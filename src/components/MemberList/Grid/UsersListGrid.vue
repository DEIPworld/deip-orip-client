<template>
  <v-skeleton-loader
    type="grid"
    :loading="loading"
    transition="fade-transition"
    :types="SKELETONS"
  >
    <v-data-iterator
      :items="users"
      v-bind="iteratorProps"
      @update:page="onUpdatePage"
    >
      <template #default="{ items }">
        <d-grid>
          <users-list-grid-card
            v-for="item of items"
            :key="item.username"
            :user="item"
            :layout-key="cardLayoutKey"
          >
            <template #itemCardActions="{ user }">
              <slot name="itemCardActions" :user="user" />
            </template>
          </users-list-grid-card>
        </d-grid>
      </template>
    </v-data-iterator>
  </v-skeleton-loader>
</template>

<script>
  import { SKELETONS } from '@/variables';

  import DGrid from '@/components/Deipify/DGrid/DGrid';
  import UsersListGridCard from '@/components/MemberList/Grid/UsersListGridCard';
  import { usersView } from '@/components/MemberList/mixins/userView';

  export default {
    name: 'UsersListGrid',
    components: {
      UsersListGridCard,
      DGrid
    },
    mixins: [usersView],
    props: {
      cardLayoutKey: {
        type: String,
        default: 'userListCard'
      }
    },
    data() {
      return {
        SKELETONS
      };
    }
  };
</script>
