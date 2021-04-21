<template>
  <d-block ref="ProjectsList">
    <template #title>
      <v-badge
        :content="projects.length || '0'"
      >
        <slot name="title">
          {{ $t('defaultNaming.projects') }}
        </slot>
      </v-badge>
    </template>

    <template #subtitle>
      <slot name="subtitle" />
    </template>

    <template #title-append>
      <d-toggle-view
        v-if="multiView"
        :storage-key="storageViewTypeKey"
        class="align-self-end"
      />

      <projects-list-filter
        v-if="withFilter"
        :storage-key="storageFilterKey"
      />

      <slot name="title-append-after" />
    </template>

    <slot name="contentPrepend" />

    <component
      :is="viewTypeComponent"
      :projects="projects"
      :loading="!$ready"
      :row-layout-key="rowLayoutKey"
      :card-layout-key="cardLayoutKey"
    >
      <template #itemCardActions="{ project }">
        <slot name="itemCardActions" :project="project" />
      </template>

      <template #itemRowActions="{ project }">
        <slot name="itemRowActions" :project="project" />
      </template>
    </component>
  </d-block>
</template>

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { projectsListStore } from '@/features/Projects/store';
  import { VIEW_TYPES } from '@/variables';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DToggleView from '@/components/Deipify/DToggleView/DToggleView';
  import ProjectsListGrid from '@/features/Projects/components/List/Grid/ProjectsListGrid';
  import ProjectsListTable from '@/features/Projects/components/List/Table/ProjectsListTable';
  import { mapState } from 'vuex';
  import ProjectsListFilter from '@/features/Projects/components/List/Filter/ProjectsListFilter';
  import { compactAttributes, isArray } from '@/utils/helpers';
  import { wrapInArray } from 'vuetify/lib/util/helpers';

  export default {
    name: 'ProjectsList',
    components: {
      ProjectsListFilter,
      ProjectsListTable,
      ProjectsListGrid,
      DToggleView,
      DBlock
    },
    mixins: [
      componentStoreFactory(projectsListStore)
    ],

    props: {
      withFilter: {
        type: Boolean,
        default: false
      },

      viewTypes: {
        type: [Array, String],
        default: () => ([VIEW_TYPES.GRID, VIEW_TYPES.TABLE])
      },

      rowLayoutKey: {
        type: String,
        default: 'projectListRow'
      },
      cardLayoutKey: {
        type: String,
        default: 'projectListCard'
      },

      scope: {
        type: String,
        default: 'projects'
      },
      type: {
        type: String,
        default: 'all'
      },

      userName: {
        type: String,
        default: null
      },
      teamId: {
        type: String,
        default: null
      },
      tenantId: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        viewTypeComponents: {
          [VIEW_TYPES.TABLE]: 'ProjectsListTable',
          [VIEW_TYPES.GRID]: 'ProjectsListGrid'
        },

        currentViewType: null
      };
    },

    computed: {

      ...mapState({
        projects(state, getters) { return getters[`${this.storeNS}/projectsList`]; }
      }),

      viewTypeComponent() {
        return this.viewTypeComponents[this.currentViewType];
      },

      multiView() { return this.internalViewTypes.length > 1; },

      storageViewTypeKey() { return `${this.storeNS}_view-type`; },
      storageFilterKey() { return `${this.storeNS}_filter`; },
      internalViewTypes() { return wrapInArray(this.viewTypes); }
    },

    created() {
      if (this.multiView) {
        this.$ls.on(this.storageViewTypeKey, this.changeViewType, true);
      } else {
        [this.currentViewType] = this.internalViewTypes;
      }

      if (this.withFilter) {
        const hasQuery = !!this.$route.query.rFilter;

        this.$nextTick(() => {
          this.$ls.on(this.storageFilterKey, this.getData, !hasQuery);
        });
      } else {
        this.getData();
      }
    },

    beforeDestroy() {
      if (this.multiView) {
        this.$ls.on(this.storageViewTypeKey, this.changeViewType, true);
      }
    },

    methods: {
      getData() {
        this.$setReady(false);

        const payload = {
          scope: this.scope,
          type: this.type,

          userName: this.userName,
          teamId: this.teamId,
          tenantId: this.tenantId,

          ...(this.withFilter ? { filter: this.filterPayload() } : {})
        };

        this.$store.dispatch(`${this.storeNS}/getProjectsData`, payload)
          .then(() => {
            this.$setReady();
            this.$emit('loaded:length', this.projects.length);
          })
          .catch((err) => {
            console.error(err);
          });
      },

      filterPayload() {
        const storeFilter = this.$ls.get(this.storageFilterKey);

        const attributes = compactAttributes(
          storeFilter.researchAttributes,
          'attributeId',
          'values'
        )
          .filter((attr) => !!wrapInArray(attr.values).length)
          .map((attr) => ({
            ...attr,
            ...{ values: wrapInArray(attr.values) }
          }));

        return {
          ...storeFilter,
          ...(storeFilter.researchAttributes ? {
            researchAttributes: attributes
          } : {})
        };
      },

      onItemClick() {},

      changeViewType(viewType) {
        this.currentViewType = viewType || this.internalViewTypes[0];
      }
    }
  };
</script>
