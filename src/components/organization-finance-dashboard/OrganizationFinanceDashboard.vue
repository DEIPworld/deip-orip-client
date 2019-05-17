<template>
  <v-container fluid class="ma-0 pa-0 c-pb-10">
    <v-layout row wrap>
      <v-flex xs12 class="c-p-5 c-pt-10">
        <div><h1 class="title">{{organization.name}} Balance</h1></div>
      </v-flex>
      <v-flex xs12 class="c-p-5">
        <v-card height="200px" width="20%" v-for="(item, i) in tokenStat" :key="i + '-stat'" style="float: left">
          <v-list dense class="c-p-5">
            <v-list-tile>
              <v-list-tile-content class="grey--text">
                <span class="body-2"> 
                  <v-icon class="subheading">local_atm</v-icon>
                  Tokens
                </span>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content class="headline bold" :class="item.isGreen ? 'green--text': 'blue--text'">{{item.amount}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content class="subheading grey--text">{{item.text}}</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex xs2 class="c-p-5">
        <div class="c-pb-10">
          <v-btn :outline="showIssueTokensControl" class="ma-0" style="min-width: 150px" color="primary" @click="toggleIssueTokensControl()">
            <v-icon v-if="!showIssueTokensControl">attach_money</v-icon> {{showIssueTokensControl ? 'Hide' : 'Issue Tokens'}}</span>
          </v-btn>
        </div>
        <div v-show="showIssueTokensControl">
          <div class="body-2">NSF Grant Tokens</div>
          <div class="c-pt-2">
            <v-text-field v-model="amountToIssue" label="Amount" mask="##############" suffix="$"></v-text-field>
          </div>
          <div class="c-pt-2">
            <v-btn @click="issueTokens()" 
              class="ma-0" block color="primary" 
              :disabled="!amountToIssue || isIssuingTokens" 
              :loading="isIssuingTokens">
              Emit
            </v-btn>
          </div>
        </div>
      </v-flex>
      <v-flex xs10 class="c-p-5">
        <v-flex xs12>
          <template row v-if="transactions.length">
            <div class="subheading c-mb-5">Financial Transactions</div>
            <v-data-table :headers="financialTransactionsHeaders" :items="transactions" :pagination.sync="financialTransactionsPagination">
              <template slot="items" slot-scope="props">
                <td class="body-1">
                  <v-icon small class="c-pr-1" v-if="props.item.senderProfile.account">account_box</v-icon>
                  <v-icon small class="c-pr-1" v-else-if="props.item.senderProfile.permlink == 'nsf'">account_balance</v-icon>                  
                  <v-icon small class="c-pr-1" v-else>school</v-icon>
                  {{ getFinancialTransactionSenderName(props.item) }}</td>
                <td class="body-1">
                  <v-icon small class="c-pr-1" v-if="props.item.receiverProfile.account">account_box</v-icon>
                  <v-icon small class="c-pr-1" v-else>school</v-icon>
                  {{ getFinancialTransactionReceiverName(props.item) }}</td>
                <td class="body-1">
                <!--  <v-icon small class="c-pr-1">school</v-icon> -->
                  {{ getTxUniversity(props.item) }}
                </td>
                <td class="body-1">{{ getTransactionType(props.item) }}</td>
                <td class="body-1">{{moment(props.item.time).format('MMMM Do YYYY, h:mm:ss a')}}</td>
                <td><span class="body-2">$ {{fromAssetsToFloat(props.item.amount)}}</span></td>
              </template>
            </v-data-table>
          </template>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';
    import moment from 'moment';
    import deipRpc from '@deip/deip-rpc-client';
    import {
      FUNDING_TRANSACTION_TRANSFER,
      FUNDING_TRANSACTION_WITHDRAW,
      FUNDING_TRANSACTION_FEE,
      fundingTransactionStatus
    } from './../../services/FundingService'

    export default {
      name: "OrganizationFinanceDashboard",

      data() {
        return {
          amountToIssue: null,
          isIssuingTokens: false,
          showIssueTokensControl: false,
          financialTransactionsHeaders: [{
              text: 'From', 
              value: 'sender_organisation_id' 
            }, {
              text: 'To', 
              value: 'receiver_organisation_id' 
            }, {
              text: 'Organization', 
              value: 'receiver_organisation_id' 
            }, {
              text: 'Transaction', 
              value: 'type' 
            }, {
              text: 'Date & Time', 
              value: 'time' 
            }, {
              text: 'Amount', 
              value: 'amount.amount' 
            },
          ],
          financialTransactionsPagination: {
            rowsPerPage: 25,
            sortBy: 'time',
            descending: true
          },
          ...fundingTransactionStatus
        }
      },

      computed: {
        ...mapGetters({
          user: 'auth/user',
          isPrincipalInvestigator: 'auth/isPrincipalInvestigator',
          isCertifier: 'auth/isCertifier',
          isProgramOfficer: 'auth/isProgramOfficer',
          isFinancialOfficer: 'auth/isFinancialOfficer',
          organization: 'org_finance_dashboard/organization',
          organizations: 'org_finance_dashboard/organizations',
          transactions: 'org_finance_dashboard/transactions',
          tokenInfo: 'org_finance_dashboard/tokenInfo'
        }),

        tokenStat() {
		      return this.tokenInfo ? [
            {
              amount: this.tokenInfo.total_issued,
              text: "Issued",
            },
            {
              amount: this.tokenInfo.circulating_supply,
              text: "Circulating",
            }, {
              amount: this.tokenInfo.available_to_issuer,
              text: "Available for NSF",
            }, {
              amount: this.tokenInfo.distributed,
              text: "Awarded to PI's",
              isGreen: true
            }, {
              amount: this.tokenInfo.withdrawn,
              text: "Withdrawn by PI's",
              isGreen: true
            }
          ] : [];
        }
      },

      methods: {

        issueTokens() {
          this.isIssuingTokens = true;
          deipRpc.broadcast.issueAssetBackedTokensAsync(
            this.user.privKey,
            this.user.username,
            3, parseInt(this.amountToIssue)
          )
          .then(() => {
            this.$store.dispatch('layout/setSuccess', {
              message: `Tokens have been issued successfully!`
            });
            return this.$store.dispatch('org_finance_dashboard/loadStatisticToken', { symbol: "NGT"});
          })
          .catch((err) => {
            console.log(err);
            this.$store.dispatch('layout/setError', {
                message: `An error occurred while sending the request, please try again later.`
            });
          })
          .finally(() => {
            this.isIssuingTokens = false;
            this.amountToIssue = null;
          })
        },

        toggleIssueTokensControl() {
          this.showIssueTokensControl = !this.showIssueTokensControl;
        },

        getFinancialTransactionSenderName(tx) {
          return tx.senderProfile && tx.senderProfile.account ? this.$options.filters.fullname(tx.senderProfile) : (tx.senderProfile ? tx.senderProfile.name : "");
        },

        getFinancialTransactionReceiverName(tx) {
          return tx.receiverProfile && tx.receiverProfile.account ? this.$options.filters.fullname(tx.receiverProfile) : (tx.receiverProfile ? tx.receiverProfile.name : "");
        },

        getTxUniversity(tx) {
          // return this.organizations.filter(o => o.id == tx.receiver_organisation_id).map(o => o.name)[0] || "";
          let org = this.organizations.find(o => tx.receiverProfile && tx.receiverProfile.account && tx.receiverProfile.account.organisation_id == o.id) || { name: 'NSF' };
          return org.name;
        },

        getTransactionType(tx) {
          if (tx.type == FUNDING_TRANSACTION_TRANSFER) {
            return "Award";
          }
          if (tx.type == FUNDING_TRANSACTION_WITHDRAW) {
            return "Withdraw";
          }
          if (tx.type == FUNDING_TRANSACTION_FEE) {
            return "University overhead";
          }
          return "";
        }

      },
      
      watch: {

      }

    };
</script>

<style lang="less" scoped>

</style>
