<template>
  <v-layout>
    <v-flex class="fill-height pa-5 xs12">
      <div class="display-1 bold">Top witnesses</div>

      <div class="c-pt-4 half-bold">
        <div v-if="!isExpertiseEmpty">
          {{ VOTES_MAX_COUNT - user.account.witnesses_voted_for }} votes left. You can vote for {{ VOTES_MAX_COUNT }}
          delegates
        </div>

        <div v-else>You have no Expertise Tokens to vote for delegates</div>
      </div>

      <div class="c-mt-6">
        <v-data-table
          class="elevation-1 witnesses-table"
          :headers="[
                        { text: '', sortable: false, width: '100px' },
                        { text: 'Witness', value: 'owner' },
                        { text: 'Info', sortable: false },
                        { text: 'Votes', value: 'votes' },
                        { text: 'Missed blocks', value: 'total_missed', align: 'center' },
                        { text: 'Last block', value: 'last_confirmed_block_num', align: 'center', sortable: false }
                    ]"
          :items="witnesses"
          :pagination.sync="pagination"
          hide-actions
          must-sort
        >
          <template slot="items" slot-scope="props">
            <tr>
              <td class="text-xs-right">
                {{ props.item.votingIndex + 1 }}

                <v-btn v-if="!user.account.witness_votes.includes(props.item.owner)"
                       flat icon small
                       class="ma-0" color="primary"
                       :loading="isVoteBtnDisabled(props.item)"
                       :disabled="isVoteBtnDisabled(props.item) || isExpertiseEmpty"
                       @click="voteForWitness(props.item, true)"
                >
                  <v-icon size="18px">mdi-arrow-up-drop-circle-outline</v-icon>
                </v-btn>

                <v-btn v-else
                       flat icon small
                       class="ma-0" color="primary"
                       :loading="isVoteBtnDisabled(props.item)"
                       :disabled="isVoteBtnDisabled(props.item) || isExpertiseEmpty"
                       @click="voteForWitness(props.item, false)"
                >
                  <v-icon size="18px">mdi-arrow-up-drop-circle</v-icon>
                </v-btn>
              </td>

              <td class="">{{ props.item.owner }}</td>
              <td class="">{{ props.item.url }}</td>
              <td class="">{{ props.item.votes }}</td>
              <td class="text-xs-center">{{ props.item.total_missed }}</td>
              <td class="text-xs-center">{{ props.item.last_confirmed_block_num }}</td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import _ from 'lodash';

  export default {
    name: 'VotingForBlockProducers',

    data() {
      return {
        VOTES_MAX_COUNT: 30,
        loadingWitnessesIds: [],
        pagination: { sortBy: 'votes', rowsPerPage: -1, descending: true }
      }
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        witnesses: 'votingForBlockProducers/witnesses'
      }),

      isExpertiseEmpty() {
        return this.user.account.expert_tokens_balance === 0;
      }
    },

    methods: {
      voteForWitness(witness, isApproving) {
        this.loadingWitnessesIds.push(witness.id);

        deipRpc.broadcast.accountWitnessVoteAsync(
          this.user.privKey,
          this.user.username,
          witness.owner,
          isApproving
        )
          .then(() => this.$store.dispatch('auth/loadAccount'))
          .then(() => {
            const balance = this.user.account.expert_tokens_balance;

            witness.votes = isApproving ? witness.votes + balance : witness.votes - balance;
            _.pull(this.loadingWitnessesIds, witness.id);
            this.$forceUpdate();
          })
          .catch(err => {
            console.log(err);
          });
      },

      isVoteBtnDisabled(witness) {
        return this.loadingWitnessesIds.includes(witness.id);
      }
    },

    created() {
    }
  };
</script>

<style lang="less">
  @import '../../styles/colors.less';
</style>
