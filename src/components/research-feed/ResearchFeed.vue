<template>
  <app-layout>
    <layout-header :background="$options.filters.tenantBackgroundSrc(tenant.account)">
      <div class="text-h3 uppercase half-bold">
        Projects
      </div>

      <div class="pt-6">
        <v-btn
          v-if="isLoggedIn()"
          :to="tenant.profile.settings.newResearchPolicy === 'free' ? { name: 'CreateResearch' } : { name: 'CreateResearchProposal' }"
          color="primary"
          class="ma-0"
        >
          Start a project
        </v-btn>

        <template v-else>
          <v-btn :to="{ name: 'SignIn' }" color="primary" class="ma-0 px-12">
            Log In
          </v-btn>
          <div class="white--text text-body-1 mt-2">
            After creating an account/log in you can add
            new projects or enjoy shared materials
          </div>
        </template>
      </div>
    </layout-header>

    <layout-section>
      <research-list :items="researchFeed" namespace="feed" />
    </layout-section>
  </app-layout>
</template>

<script>
  import { mapGetters } from 'vuex';

  import { AccessService } from '@deip/access-service';

  import * as disciplinesService from '@/components/common/disciplines/DisciplineTreeService';
  import trlData from '@/components/common/trl.json';

  import LayoutHeader from '@/components/layout/components/LayoutHeader';
  import AppLayout from '@/components/layout/components/Layout';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import ResearchList from '@/components/ResearchList/ResearchList';

  const accessService = AccessService.getInstance();

  export default {
    name: 'ResearchFeed',
    components: {
      ResearchList,
      LayoutSection,
      AppLayout,
      LayoutHeader
    },
    data() {
      return {
        filtersIsOpen: false,

        pagination: {
          itemsPerPage: 12
        },
        footerProps: {
          'items-per-page-options': [12, 24, 48, -1]
        },
        disciplines: [...disciplinesService.getTopLevelNodes()],
        filterByTopOnly: false,
        filtersTabExpansionModel: false,
        trls: trlData.map((t, i) => ({
          id: t.id,
          label: `TRL ${i + 1}`,
          hint: t.description
        }))
      };
    },

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant',
        researchFeed: 'feed/researchFeed',
        organizations: 'feed/organizations',
        filter: 'feed/filter'
      }),
      isFiltersTabExpanded() {
        return this.filtersTabExpansionModel;
      },
      selectedSteppers() {
        return this.filter.steppers;
      },
      selectedTopDisciplines() {
        return this.filter.disciplines.filter((d) => d.id != 0 && d.children !== undefined);
      },
      selectedOrganizations() {
        return this.filter.organizations;
      },
      selectedCategories() {
        return this.filter.categories;
      },
      isAllDisciplinesSelected() {
        return this.filter.disciplines.length === 0;
      },
      isAllOrganizationsSelected() {
        return this.filter.organizations.length === 0;
      },
      isAllStepsSelected() {
        return this.tenant.profile.settings.researchComponents.map(({ _id }) => {
          const step = this.filter.steppers.find((item) => _id === item._id);
          return step ? !step.steps.length : true;
        });
      },
      isAllCategoriesSelected() {
        return this.filter.categories.length === 0;
      }
    },

    watch: {
      filterByTopOnly(newVal) {
        this.$store.dispatch('feed/updateFilter', {
          key: 'topOnly',
          value: newVal
        });
      }
    },

    methods: {
      resetStepper(stepper) {
        this.$store.dispatch('feed/updateFilter', {
          key: 'steppers',
          value: this.filter.steppers.map((item) => (item._id === stepper._id ? { _id: item._id, steps: [] } : item))
        });
      },

      toggleStep(stepper, step) {
        let updatedFilter = [];
        if (this.isStepSelected(stepper, step)) {
          updatedFilter = this.filter.steppers.map((item) => {
            if (item._id === stepper._id) {
              return { _id: item._id, shortTitle: item.shortTitle, steps: [...item.steps.filter((s) => s !== step)] };
            }
            return item;
          });
        } else if (this.filter.steppers.find(({ _id }) => _id === stepper._id)) {
          updatedFilter = this.filter.steppers.map((item) => {
            if (item._id === stepper._id) {
              return { _id: item._id, shortTitle: item.shortTitle, steps: [...item.steps, step] };
            }
            return item;
          });
        } else {
          updatedFilter = [...this.filter.steppers, { _id: stepper._id, shortTitle: stepper.component.readinessLevelShortTitle, steps: [step] }];
        }
        this.$store.dispatch('feed/updateFilter', {
          key: 'steppers',
          value: updatedFilter
        });
      },

      isStepSelected(stepper, step) {
        return !!this.filter.steppers.some((t) => (t._id === stepper._id ? t.steps.some((s) => s === step) : false));
      },

      selectAllDisciplines() {
        this.$store.dispatch('feed/updateFilter', {
          key: 'disciplines',
          value: []
        });
      },

      toggleDiscipline(discipline) {
        const disciplinesGraph = [discipline, ...Object.values(discipline.children)];
        if (!this.isDisciplineSelected(discipline)) {
          const value = [...disciplinesGraph, ...this.filter.disciplines];
          this.$store.dispatch('feed/updateFilter', {
            key: 'disciplines',
            value
          });
        } else {
          const value = this.filter.disciplines.filter((d) => !disciplinesGraph.some((item) => item === d));
          this.$store.dispatch('feed/updateFilter', {
            key: 'disciplines',
            value
          });
        }
      },

      isDisciplineSelected(discipline) {
        return this.filter.disciplines.some((d) => d === discipline);
      },

      selectAllOrganizations() {
        this.$store.dispatch('feed/updateFilter', {
          key: 'organizations',
          value: []
        });
      },

      toggleOrganization(organization) {
        if (!this.isOrganizationSelected(organization)) {
          const value = [organization, ...this.filter.organizations];
          this.$store.dispatch('feed/updateFilter', {
            key: 'organizations',
            value
          });
        } else {
          const value = this.filter.organizations.filter((o) => o.id != organization.id);
          this.$store.dispatch('feed/updateFilter', {
            key: 'organizations',
            value
          });
        }
      },

      isOrganizationSelected(organization) {
        return this.filter.organizations.some((o) => o.id === organization.id);
      },

      selectAllCategories() {
        this.$store.dispatch('feed/updateFilter', {
          key: 'categories',
          value: []
        });
      },

      toggleCategory(category) {
        if (!this.isCategorySelected(category)) {
          const value = [category, ...this.filter.categories];
          this.$store.dispatch('feed/updateFilter', {
            key: 'categories',
            value
          });
        } else {
          const value = this.filter.categories.filter((cat) => cat._id != category._id);
          this.$store.dispatch('feed/updateFilter', {
            key: 'categories',
            value
          });
        }
      },

      isCategorySelected(category) {
        return this.filter.categories.some((cat) => cat._id === category._id);
      },

      onPaginationUpdated(nextState) {
        setTimeout(() => window.scrollTo({
          top: this.$refs.projectsView.offsetTop - 10,
          behavior: 'smooth'
        }), 0);
      },

      isLoggedIn() { return accessService.isLoggedIn(); }
    }
  };
</script>

<style lang="less" scoped>
  .feed-header {
    background-size: cover !important;
    background-repeat: no-repeat !important;
    height: 300px;
    width: 100%;
    font-style: normal;
    color: white;
  }

  .filters-background {
    background-color: #fafafa;
  }

  .organization-item {
    height: 60px;
    width: 180px;
    cursor: pointer;
    background: white;
    border: 1px solid #e5e5e5;
    position: relative;
    display: flex;
    justify-content: center;

    &__img {
      max-height: 100%;
      max-width: 100%;
      align-self: center;
    }

    &__overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      color: #e5e5e5;
    }

    &:hover &__overlay, &--selected &__overlay {
      display: block;
      background: rgba(219, 228, 251, .6);
    }
  }

  .filter-chips {
    margin: -.25rem;

    &__row {
      margin-bottom: .5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .category-filter-btn {
      display: block;
      width: 150px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
  }

</style>
