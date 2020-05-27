<template>
  <app-layout>
    <layout-header :background="$options.filters.tenantBackgroundSrc(tenant.account)">
      <div class="display-2 uppercase half-bold">
        Projects
      </div>

      <div class="py-6">
        <v-btn
          v-if="isLoggedIn()"
          :to="{ name: 'CreateResearch' }"
          color="primary"
          class="ma-0"
        >
          Start a project
        </v-btn>

        <template v-else>
          <v-btn :to="{ name: 'SignIn' }" color="primary" class="ma-0 px-12">
            Log In
          </v-btn>
          <div class="white--text body-1 mt-2">
            After creating an account/log in you can add
            new projects or enjoy shared materials
          </div>
        </template>
      </div>
    </layout-header>

    <!-- TODO: refactoring -->
    <div class="d-flex px-6 px-sm-12 py-4">
      <v-sheet tile class="filter-chips">
        <div v-if="selectedTopDisciplines.length" class="filter-chips__row">
          <v-chip
            v-for="discipline in selectedTopDisciplines"
            :key="'filter-by-discipline-' + discipline.id"
            class="ma-1"
            close
            outlined
            @click:close="toggleDiscipline(discipline)"
          >
            {{ discipline.label }}
          </v-chip>
        </div>

        <div v-if="selectedSteppers.length" class="filter-chips__row">
          <template v-for="(item, i) in selectedSteppers">
            <v-chip
              v-for="step in item.steps"
              :key="`filter-${i}-${step}`"
              class="ma-1"
              close
              outlined
              @click:close="toggleStep(item, step)"
            >
              {{ item.shortTitle }} {{ step + 1 }}
            </v-chip>
          </template>
        </div>

        <div v-if="selectedOrganizations.length" class="filter-chips__row">
          <v-chip
            v-for="organization in selectedOrganizations"
            :key="'filter-by-organization-' + organization.id"
            class="ma-1"
            close
            outlined
            @click:close="toggleOrganization(organization)"
          >
            <v-avatar left>
              <img :src="$options.filters.researchGroupLogoSrc(organization.external_id, 50, 50, true)">
            </v-avatar>
            {{ organization.name }}
          </v-chip>
        </div>

        <div v-if="filterByTopOnly" class="filter-chips__row">
          <v-chip
            class="ma-1"
            small
            close
            outlined
            @click:close="filterByTopOnly = false"
          >
            <v-avatar>
              <img src="/assets/img/top-100.svg">
            </v-avatar>
            Top 100
          </v-chip>
        </div>
      </v-sheet>
      <v-spacer />
      <v-sheet tile>
        <v-btn small text @click="filtersIsOpen = !filtersIsOpen">
          {{ filtersIsOpen ? 'Hide Filters' : 'Show Filters' }}
          <v-icon right dense>
            {{ filtersIsOpen ? 'expand_less' : 'expand_more' }}
          </v-icon>
        </v-btn>
      </v-sheet>
    </div>
    <v-divider />
    <v-expand-transition>
      <div v-if="filtersIsOpen">
        <v-sheet tile color="#fafafa" class="pa-12">
          <v-row justify="space-between" align="center" class="mb-6">
            <v-col>
              <div class="subtitle-1">
                Browse by discipline
              </div>
            </v-col>
            <v-col cols="auto">
              <v-btn
                small
                color="primary"
                outlined
                :disabled="isAllDisciplinesSelected"
                @click="selectAllDisciplines()"
              >
                Reset
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-for="(discipline, i) in disciplines"
              :key="'discipline-filter-' + i"
              cols="6"
              md="3"
            >
              <v-btn
                text
                block
                small
                color="primary"
                :input-value="isDisciplineSelected(discipline)"
                @click="toggleDiscipline(discipline)"
              >
                {{ discipline.label }}
              </v-btn>
            </v-col>
            <v-spacer />
          </v-row>

          <v-divider class="my-6" />

          <div v-for="(item, i) in tenant.profile.settings.researchComponents" :key="'research-component-' + i">
            <template v-if="item.isVisible && item.type === 'stepper'">
              <v-row justify="space-between" align="center" class="pb-6">
                <v-col>
                  <div class="subtitle-1">
                    Browse by {{ item.component.readinessLevelShortTitle }}
                  </div>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    small
                    color="primary"
                    outlined
                    :disabled="isAllStepsSelected[i]"
                    @click="resetStepper(item)"
                  >
                    Reset
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col v-for="(step, j) in item.component.readinessLevels" :key="`${item.component.readinessLevelShortTitle}-${j}`" cols="2" class="overflow-hidden">
                  <v-tooltip v-if="step.description || step.title" bottom>
                    <template #activator="{ on }">
                      <v-btn
                        text
                        block
                        small
                        color="primary"
                        :input-value="isStepSelected(item, j)"
                        v-on="on"
                        @click="toggleStep(item, j)"
                      >
                        <div class="full-width text--center">
                          {{ item.component.readinessLevelShortTitle }} {{ j + 1 }}
                        </div>
                      </v-btn>
                    </template>
                    <span>{{ step.description || step.title }}</span>
                  </v-tooltip>
                  <v-btn
                    v-else
                    text
                    block
                    small
                    color="primary"
                    :input-value="isStepSelected(item, j)"
                    v-on="on"
                    @click="toggleStep(item, j)"
                  >
                    <div class="full-width text--center">
                      {{ item.component.readinessLevelShortTitle }} {{ i + 1 }}
                    </div>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </div>

          <v-divider v-if="tenant.profile.settings.researchComponents.length" class="my-6" />

          <v-row class="pb-6" justify="space-between">
            <v-col>
              <span class="subtitle-1">Browse by organizations</span>
            </v-col>
            <v-col cols="auto">
              <v-btn
                small
                color="primary"
                outlined
                :disabled="isAllOrganizationsSelected"
                @click="selectAllOrganizations()"
              >
                Reset
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <div
              v-for="organization of organizations"
              :key="`organization-filter-${organization.id}`"
            >
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <div
                    :input-value="isOrganizationSelected(organization)"
                    :class="{
                      'organization-item ma-2 pa-1': true,
                      'organization-item--selected': isOrganizationSelected(organization)
                    }"
                    v-on="on"
                    @click="toggleOrganization(organization)"
                  >
                    <img

                      class="organization-item__img"
                      :src="$options.filters.researchGroupLogoSrc(organization.external_id, 200, 200)"
                    >
                    <div class="organization-item__overlay" />
                  </div>
                </template>
                <span>{{ organization.name }}</span>
              </v-tooltip>
            </div>
          </v-row>

          <!-- <v-divider class="my-6" /> -->

          <!-- <v-checkbox
            v-model="filterByTopOnly"
            class="ma-0 pa-0"
            hide-details
            label="Browse top projects only"
          /> -->
        </v-sheet>
        <v-divider />
      </div>
    </v-expand-transition>
    <!-- END TODO: refactoring -->

    <layout-section>
      <content-block>
        <template #title>
          <div ref="projectsView">
            Projects
            <v-badge offset-y="-8" offset-x="4" :content="researchFeed.length || '0'" />
          </div>
        </template>

        <v-data-iterator
          :items="researchFeed"
          :items-per-page-options="rowsPerPageItems"
          :options.sync="pagination"
          no-data-text="No Projects found for specified criteria"
          row
          wrap
          @update:page="onPaginationUpdated"
        >
          <template v-slot:default="{items}">
            <v-row class="ma-n3">
              <v-col
                v-for="item in items"
                :key="'feed-item-' + item.external_id"
                cols="12"
                sm="6"
                md="4"
                xl="3"
              >
                <v-sheet class="full-height">
                  <research-project-tile
                    :research="item"
                    :members="item.authors"
                    :token-sale="item.tokenSale"
                    :token-sale-contributions="item.tokenSaleContributions"
                    :group="item.research_group"
                  />
                </v-sheet>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </content-block>
    </layout-section>
  </app-layout>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import moment from 'moment';

  import { AccessService } from '@deip/access-service';

  import * as disciplinesService from '@/components/common/disciplines/DisciplineTreeService';
  import trlData from '@/components/common/trl.json';

  import LayoutHeader from '@/components/layout/components/LayoutHeader';
  import ContentBlock from '@/components/layout/components/ContentBlock';
  import AppLayout from '@/components/layout/components/Layout';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  const accessService = AccessService.getInstance();

  export default {
    name: 'ResearchFeed',
    components: {
      LayoutSection,
      AppLayout,
      ContentBlock,
      LayoutHeader
    },
    data() {
      return {
        filtersIsOpen: false,

        rowsPerPageItems: [9, 30, 100],
        pagination: {
          rowsPerPage: 100
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
      isAllDisciplinesSelected() {
        return this.filter.disciplines.length === 0;
      },
      isAllOrganizationsSelected() {
        return this.filter.organizations.length === 0;
      },
      isAllStepsSelected() {
        return this.tenant.profile.settings.researchComponents.map(({ _id }) => {
          const step = this.filter.steppers.find((item) => _id === item._id)
          return step ? !step.steps.length : true;
        })
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
          value: this.filter.steppers.map((item) => item._id === stepper._id ? {_id: item._id, steps: [] } : item)
        });
      },

      toggleStep(stepper, step) {
        let updatedFilter = [];
        if (this.isStepSelected(stepper, step)) {
          updatedFilter = this.filter.steppers.map((item) => {
            if (item._id === stepper._id){
                return { _id: item._id, shortTitle: item.shortTitle, steps: [...item.steps.filter(s => s !== step)] }
            } else {
              return item
            }
          });
        } else if (this.filter.steppers.find(({_id}) => _id === stepper._id)) {
          updatedFilter = this.filter.steppers.map((item) => {
            if (item._id === stepper._id) {
                return { _id: item._id, shortTitle: item.shortTitle, steps: [...item.steps, step] }
            } else {
              return item
            }
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
        return !!this.filter.steppers.some((t) => t._id === stepper._id ? t.steps.some(s => s === step ) : false);
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

</style>
