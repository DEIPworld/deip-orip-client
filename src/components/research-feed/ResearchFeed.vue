<template>
  <app-layout>
    <layout-header centered full-width :muted="false" :background="$options.filters.tenantBackgroundSrc(tenant.account)">
      <div class="pt-6 display-flex flex-wrap justify-center">
        <v-btn v-if="isLoggedIn()" :to="{ name: 'CreateResearch' }" color="primary" class="width-225 ma-0 px-5">Start a project
        </v-btn>
        <template v-else>
          <v-btn :to="{ name: 'SignUp' }" color="primary" class="width-225 px-5 ma-2">Become a member</v-btn>
          <v-btn :to="{ name: 'SignIn' }" light class="width-225 px-5 blue--text ma-2">Start a project</v-btn>
        </template>
      </div>
    </layout-header>
    <v-divider />

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

        <div v-if="selectedTrls.length" class="filter-chips__row">
          <v-chip
            v-for="trl in selectedTrls"
            :key="'filter-by-trl-' + trl.id"
            class="ma-1"
            close
            outlined
            @click:close="toggleTrl(trl)"
          >
            {{ trl.label }}
          </v-chip>
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

          <v-row justify="space-between" align="center" class="pb-6">
            <v-col>
              <div class="subtitle-1">
                Browse by TRL
              </div>
            </v-col>
            <v-col cols="auto">
              <v-btn
                small
                color="primary"
                outlined
                :disabled="isAllTrlSelected"
                @click="resetTrl()"
              >
                Reset
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-for="(trl, i) in trls" :key="'trl-filter-' + i" cols="2">
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn
                    text
                    block
                    small
                    color="primary"
                    :input-value="isTrlSelected(trl)"
                    v-on="on"
                    @click="toggleTrl(trl)"
                  >
                    <div class="full-width text--center">
                      {{ trl.label }}
                    </div>
                  </v-btn>
                </template>
                <span>{{ trl.hint }}</span>
              </v-tooltip>
            </v-col>
          </v-row>

          <v-divider class="my-6" />

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
                :key="'feed-item-' + item.research_id"
                cols="12"
                sm="6"
                md="4"
                xl="3"
              >
                <v-sheet>
                  <research-project-tile
                    :research="{
                      id: item.research_id,
                      external_id: item.external_id,
                      title: item.title,
                      permlink: item.permlink,
                      group_permlink: item.group_permlink,
                      last_update_time: item.last_update_time,
                      number_of_negative_reviews: item.number_of_negative_reviews,
                      number_of_positive_reviews: item.number_of_positive_reviews,
                      research_group: item.group,
                      isTop: item.isTop,
                      researchRef: item.researchRef
                    }"
                    :members="item.authors"
                    :token-sale="item.tokenSale"
                    :token-sale-contributions="item.tokenSaleContributions"
                    :group="item.group"
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
      selectedTrls() {
        return this.filter.trl;
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
      isAllTrlSelected() {
        return this.filter.trl.length === 0;
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
      resetTrl() {
        this.$store.dispatch('feed/updateFilter', {
          key: 'trl',
          value: []
        });
      },

      toggleTrl(trl) {
        if (!this.isTrlSelected(trl)) {
          this.$store.dispatch('feed/updateFilter', {
            key: 'trl',
            value: [trl, ...this.filter.trl]
          });
        } else {
          this.$store.dispatch('feed/updateFilter', {
            key: 'trl',
            value: this.filter.trl.filter((t) => t.id !== trl.id)
          });
        }
      },

      isTrlSelected(trl) {
        return !!this.filter.trl.some((t) => t.id === trl.id);
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
        this.$refs.projectsView.scrollIntoView();
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

  .width-225{
    width: 225px;
  }


</style>
