<template>
  <d-block ref="usersView">
    <template #title>
      {{ $t('memberList.members') }}
      <v-badge offset-y="-8" offset-x="4" :content="users.length || '0'" />
    </template>

    <template #title-append>
      <d-toggle-view :storage-key="storageViewModelKey" class="align-self-end" />
      <slot name="title-append-after" />
    </template>

    <template #subtitle>
      <slot name="subtitle" />
    </template>

    <component
      :is="viewTypeComponent"
      :users="users"
      :loading="!$ready"
      :row-layout-key="rowLayoutKey"
      :card-layout-key="cardLayoutKey"
    >
      <template #itemCardActions="{ user }">
        <slot name="itemCardActions" :user="user" />
      </template>

      <template #itemRowActions="{ user }">
        <slot name="itemRowActions" :user="user" />
      </template>
    </component>
  </d-block>
</template>

<script>
  import { VIEW_TYPES } from '@/variables';

  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DToggleView from '@/components/Deipify/DToggleView/DToggleView';
  import DFilterSidebar from '@/components/Deipify/DFilter/DFilterSidebar';

  import UsersListGrid from '@/components/MemberList/Grid/UsersListGrid';
  import UsersListTable from '@/components/MemberList/Table/UsersListTable';
  import { usersListStore } from '@/components/MemberList/store';
  import { componentStoreFactory } from '@/mixins/registerStore';

  export default {
    name: 'UsersList',

    components: {
      UsersListTable,
      UsersListGrid,

      DToggleView,
      DBlock,
      DFilterSidebar
    },

    mixins: [componentStoreFactory(usersListStore)],

    props: {
      namespace: {
        type: String,
        default: undefined
      },
      group: {
        type: Object,
        default: undefined
      },
      rowLayoutKey: {
        type: String,
        default: 'userListRow'
      },
      cardLayoutKey: {
        type: String,
        default: 'userListCard'
      }
    },

    data() {
      return {
        storageViewModelKey: undefined,
        storageFilterModelKey: undefined,

        viewTypeComponents: {
          [VIEW_TYPES.TABLE]: 'UsersListTable',
          [VIEW_TYPES.GRID]: 'UsersListGrid'
        },

        viewModel: undefined,

        users: []
      };
    },

    computed: {
      viewTypeComponent() {
        return this.viewTypeComponents[this.viewModel];
      }
    },

    created() {
      this.storageViewModelKey = `${this.namespace}__pl-type`;
      this.$ls.on(this.storageViewModelKey, this.changeView, true);

      this.update()
        .then(() => this.$setReady());
    },

    methods: {
      update() {
        const payload = {
          ...(this.group && this.group.id ? { researchGroupExternalId: this.group.external_id || this.group.externalId } : {})
        };
        return this.$store.dispatch(`${this.storeNS}/loadUsers`, payload)
          .then(() => {
            this.users = this.$store.getters[`${this.storeNS}/users`];
          });
      },
      onPaginationUpdated() {
        setTimeout(() => window.scrollTo({
          top: this.$refs.usersView.offsetTop - 10,
          behavior: 'smooth'
        }), 0);
      },

      changeView(val) {
        this.viewModel = val;
      }
    }
  };
</script>
