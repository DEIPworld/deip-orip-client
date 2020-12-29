<template>
  <d-block v-if="$ready" ref="membersView">
    <template #title>
      {{ $t('memberList.members') }}
      <v-badge offset-y="-8" offset-x="4" :content="members.length || '0'" />
    </template>

    <template #title-append>
      <d-toggle-view :storage-key="storageViewModelKey" class="align-self-end" />
      <slot name="title-append-after" />
    </template>

    <template #subtitle>
      <slot name="subtitle" />
    </template>

    <v-data-iterator
      :items="members"
      :no-data-text="$t('memberList.noMembFound')"
      :hide-default-footer="iteratorProps.hideDefaultFooter"
      :footer-props="iteratorProps.footerProps"
      :items-per-page="iteratorProps.itemsPerPage"
      @update:page="onPaginationUpdated"
    >
      <template #default="{items}">
        <component :is="listComponent" :items="items" :group="group" />
      </template>
    </v-data-iterator>
  </d-block>
</template>

<script>
  import { VIEW_TYPES } from '@/variables';

  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DToggleView from '@/components/Deipify/DToggleView/DToggleView';
  import DFilterSidebar from '@/components/Deipify/DFilter/DFilterSidebar';

  import MemberListGrid from '@/components/MemberList/MemberListGrid';
  import MemberListTable from '@/components/MemberList/MemberListTable';
  import { memberListStore } from '@/components/MemberList/store';
  import { componentStoreFactory } from '@/mixins/registerStore';

  export default {
    name: 'MemberList',

    components: {
      MemberListTable,
      MemberListGrid,

      DToggleView,
      DBlock,
      DFilterSidebar
    },

    mixins: [componentStoreFactory(memberListStore)],

    props: {
      namespace: {
        type: String,
        default: undefined
      },
      group: {
        type: Object,
        default: undefined
      }
    },

    data() {
      return {
        storageViewModelKey: undefined,
        storageFilterModelKey: undefined,

        viewModel: undefined,

        members: []
      };
    },

    computed: {
      listComponent() {
        return this.viewModel === VIEW_TYPES.GRID ? 'member-list-grid' : 'member-list-table';
      },

      iteratorProps() {
        return {
          itemsPerPage: 12,
          hideDefaultFooter: this.members.length < 12,
          footerProps: {
            'items-per-page-options': [12, 24, 48, -1]
          }
        };
      }
    },

    created() {
      this.storageViewModelKey = `${this.namespace}__pl-type`;
      this.$ls.on(this.storageViewModelKey, this.changeView, true);

      const payload = {
        ...(this.group && this.group.id ? { groupId: this.group.id } : {})
      };

      this.$store.dispatch(`${this.storeNS}/loadMembers`, payload)
        .then(() => {
          this.members = this.$store.getters[`${this.storeNS}/members`];
        })
        .then(() => this.$setReady());
    },

    methods: {
      onPaginationUpdated() {
        setTimeout(() => window.scrollTo({
          top: this.$refs.membersView.offsetTop - 10,
          behavior: 'smooth'
        }), 0);
      },

      changeView(val) {
        this.viewModel = val;
      }
    }
  };
</script>
