<template>
  <div>
    <div class="title">
      Proposals
    </div>

    <div class="display-flex pt-2 justify-space-between align-center">
      <div class="display-flex align-center">
        <span class="uppercase font-weight-medium">Show approved proposals</span>

        <v-switch
          class="ml-4 mt-0 pt-0"
          color="primary"
          hide-details
          :value="filter.areShownPastProposals"
          @change="updateProposalFilter({
            key: 'areShownPastProposals',
            value: !filter.areShownPastProposals
          })"
        />
      </div>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn class="ma-0" v-on="on">
            <div>
              <span v-if="filter.order === 'desc'">Newest First</span>
              <span v-if="filter.order === 'asc'">Oldest First</span>

              <v-icon class="pl-4" small>
                keyboard_arrow_down
              </v-icon>
            </div>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="updateProposalFilter({ key: 'order', value: 'desc' })">
            <v-list-item-title>Newest First</v-list-item-title>
          </v-list-item>

          <v-list-item @click="updateProposalFilter({ key: 'order', value: 'asc' })">
            <v-list-item-title>Oldest First</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div class="pt-4">
      <v-expansion-panels accordion>
        <v-expansion-panel readonly>
          <v-expansion-panel-header hide-actions>
            <div class="display-flex align-center pr-6 grey--text">
              <div class="id-col">
                ID
              </div>
              <div class="proposal-activity">
                Proposal
              </div>
              <div class="date">
                Date
              </div>
              <div class="date">
                Exp. date
              </div>
              <div class="created-by">
                Created by
              </div>
              <div class="voted">
                Voted
              </div>
              <div class="action-col">
                Action
              </div>
            </div>
          </v-expansion-panel-header>
        </v-expansion-panel>
        <template v-if="proposals.length">
          <v-expansion-panel v-for="(proposal, i) in proposals" :key="i">
            <research-group-details-proposals-item :proposal="proposal"/>
          </v-expansion-panel>
        </template>

        <v-expansion-panel v-if="!proposals.length" readonly>
          <v-expansion-panel-header hide-actions>
            <div class="grey--text display-flex height-4">
              <div class="ma-auto">
                Proposal list is empty
              </div>
            </div>
          </v-expansion-panel-header>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'ResearchGroupDetailsProposals',
    props: {},
    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        allProposals: 'researchGroup/proposals',
        filter: 'researchGroup/proposalListFilter'
      }),
      proposals() {
        return _(this.allProposals)
          .filter((proposal) => proposal.is_completed === this.filter.areShownPastProposals)
          .orderBy([this.filter.sortBy], [this.filter.order])
          .value();
      }
    },
    methods: {
      ...mapActions({
        updateProposalFilter: 'researchGroup/updateProposalFilter'
      })
    }
  };
</script>

<style lang="less">
  .id-col {
    width: 60px;
  }

  .proposal-activity {
    flex: 1 0 0;
  }

  .date {
    width: 90px;
    text-align: center;
    flex-shrink: 0;
  }

  .created-by {
    padding-left: 20px;
    width: 200px;
    flex-shrink: 0;
  }

  .voted {
    width: 90px;
    text-align: center;
    flex-shrink: 0;
  }

  .action-col {
    width: 100px;
    display: flex;
    justify-content: center;
  }

</style>
