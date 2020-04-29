<template>
  <div class="fill-height pa-12 xs12">
    <div class="display-1 bold">
      Top witnesses
    </div>

    <div class="c-pt-4 half-bold">
      <div v-if="!isExpertiseEmpty">
        {{ VOTES_MAX_COUNT - user.account.witnesses_voted_for }} votes left. You can vote for {{ VOTES_MAX_COUNT }}
        delegates
      </div>

      <div v-else>
        You have no Expertise Tokens to vote for delegates
      </div>
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
        hide-default-footer
        :options.sync="pagination"
        must-sort
      >
        <template v-slot:item="{item}">
          <tr>
            <td class="text-right">
              {{ item.votingIndex + 1 }}

              <v-btn
                v-if="!user.account.witness_votes.includes(item.owner)"
                text
                icon
                small
                class="ma-0"
                color="primary"
                :loading="isVoteBtnDisabled(item)"
                :disabled="isVoteBtnDisabled(item) || isExpertiseEmpty"
                @click="voteForWitness(item, true)"
              >
                <v-icon size="18px">
                  mdi-arrow-up-drop-circle-outline
                </v-icon>
              </v-btn>

              <v-btn
                v-else
                text
                icon
                small
                class="ma-0"
                color="primary"
                :loading="isVoteBtnDisabled(item)"
                :disabled="isVoteBtnDisabled(item) || isExpertiseEmpty"
                @click="voteForWitness(item, false)"
              >
                <v-icon size="18px">
                  mdi-arrow-up-drop-circle
                </v-icon>
              </v-btn>
            </td>

            <td class="">
              {{ item.owner }}
            </td>
            <td class="">
              {{ item.url }}
            </td>
            <td class="">
              {{ item.votes }}
            </td>
            <td class="text-center">
              {{ item.total_missed }}
            </td>
            <td class="text-center">
              {{ item.last_confirmed_block_num }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
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
        pagination: { sortBy: ['votes'], rowsPerPage: -1, descending: true }
      };
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

    created() {
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
          .catch((err) => {
            console.log(err);
          });
      },

      isVoteBtnDisabled(witness) {
        return this.loadingWitnessesIds.includes(witness.id);
      }
    }
  };
</script>

<style lang="less">
  @import '../../styles/colors.less';
</style>
