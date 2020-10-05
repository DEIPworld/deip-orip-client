<template>
  <d-block ref="ProjectsList">

    <template #title>
      <v-badge
        :content="projects.length || '0'"
      >
        {{ $t('defaultNaming.projects') }}
      </v-badge>
    </template>

    <template #subtitle>
      <slot name="subtitle" />
    </template>

    <template #titleAddon>
      <d-toggle-view
        v-if="multiView"
        :storage-key="storageViewTypeKey"
        class="align-self-end"
      />

      <slot name="addSome" />
    </template>

    <component
      :is="viewTypeComponent"
      :projects="projects"
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
  import { projectsListStore } from '@/components/Projects/List/store';
  import { PROJECTS_LIST_VIEW } from '@/variables';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DToggleView from '@/components/Deipify/DToggleView/DToggleView';
  import ProjectsListGrid from '@/components/Projects/List/Grid/ProjectsListGrid';
  import ProjectsListTable from '@/components/Projects/List/Table/ProjectsListTable';
  import { mapState } from 'vuex';

  export default {
    name: 'ProjectsList',
    components: { ProjectsListTable, ProjectsListGrid, DToggleView, DBlock },
    mixins: [
      componentStoreFactory(projectsListStore)
    ],

    props: {
      withFilter: {
        type: Boolean,
        default: false
      },
      viewTypes: {
        type: [Array, Number],
        default: () => ([PROJECTS_LIST_VIEW.GRID, PROJECTS_LIST_VIEW.TABLE])
      },
      rowLayoutKey: {
        type: String,
        default: 'projectListRow'
      },
      cardLayoutKey: {
        type: String,
        default: 'projectListCard'
      }
    },

    data() {
      return {
        viewTypeComponents: {
          [PROJECTS_LIST_VIEW.TABLE]: 'ProjectsListTable',
          [PROJECTS_LIST_VIEW.GRID]: 'ProjectsListGrid'
        },

        currentViewType: PROJECTS_LIST_VIEW.GRID
      };
    },

    computed: {

      ...mapState({
        projects(state, getters) { return getters[`${this.storeNS}/projectsList`]; }
      }),

      viewTypeComponent() {
        if (this.multiView) {
          return this.viewTypeComponents[this.currentViewType];
        }

        return this.viewTypes[this.viewType];
      },

      multiView() { return this.viewTypes.length > 1; },

      storageViewTypeKey() { return `${this.storeNS}_view-type`; },
      storageFilterKey() { return `${this.storeNS}_filter`; }
    },

    created() {
      this.isMultiView(() => {
        this.$ls.on(this.storageViewTypeKey, this.changeViewType, true);
      });

      this.getData();
    },

    beforeDestroy() {
      this.isMultiView(() => {
        this.$ls.on(this.storageViewTypeKey, this.changeViewType, true);
      });
    },

    methods: {
      getData() {
        this.$store.dispatch(`${this.storeNS}/getProjectsData`)
          .then(() => {
            this.$setReady();
          })
          .catch((err) => {
            console.error(err);
          });
      },

      onItemClick() {},

      changeViewType(viewType) {
        this.currentViewType = viewType;
      },

      isMultiView(cb) {
        if (this.multiView) {
          cb();
        }
      }
    }
  };
</script>
