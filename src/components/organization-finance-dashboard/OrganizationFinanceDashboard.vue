<template>
  <v-container fluid class="ma-0 pa-0">
    <v-layout row wrap>
      <v-flex xs12 class="c-p-5 c-pt-10">
        <div><h1 class="title">{{organization.name}} Balance</h1></div>
      </v-flex>
      <v-flex xs12 class="c-p-5">
        <v-card height="200px" width="20%" v-for="(item, i) in items" :key="i + '-stat'" style="float: left">
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
      <v-flex xs12 class="c-p-5">
        <div>
          <v-btn class="ma-0" color="primary"><v-icon>attach_money</v-icon>Issue Tokens</v-btn>
        </div>
      </v-flex>
      <v-flex xs4 class="c-p-5">
        <div class="body-2">NSF grant tokens</div>
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
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';
    import moment from 'moment';
    import deipRpc from '@deip/deip-rpc-client';

    export default {
      name: "OrganizationFinanceDashboard",

      data() {
        return {
          amountToIssue: null,
          isIssuingTokens: false,
          items: [{
              amount: 1000000,
              text: "Issued",
            }, {
              amount: 900000,
              text: "Circulating",
            }, {
              amount: 300000,
              text: "Available for NSF",
            }, {
              amount: 600000,
              text: "Awarded to PI's",
              isGreen: true
            }, {
              amount: 100000,
              text: "Withdrawn by PI's",
              isGreen: true
            }
          ]
        }
      },

      computed: {
        ...mapGetters({
          user: 'auth/user',
          isPrincipalInvestigator: 'auth/isPrincipalInvestigator',
          isCertifier: 'auth/isCertifier',
          isProgramOfficer: 'auth/isProgramOfficer',
          isFinancialOfficer: 'auth/isFinancialOfficer',
          organization: 'org_finance_dashboard/organization'
        })
      },

      methods: {

        issueTokens() {
          this.isIssuingTokens = true;
          this.isIssuingTokens = false;
        }

      },
      
      watch: {

      }
    };
</script>

<style lang="less" scoped>

</style>
