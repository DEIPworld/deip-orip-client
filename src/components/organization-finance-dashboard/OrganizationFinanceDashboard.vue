<template>
  <v-container fluid class="ma-0 pa-0 c-pb-10">
    <v-layout row wrap>
    
      <v-flex xs12 class="c-p-5 c-pt-10">
        <div><h1 class="display-1">{{organization.name}} Balance</h1></div>
      </v-flex>

      <v-flex xs2 class="c-pt-5 c-pb-1 grey-background" v-for="(item, i) in tokenStat" :key="i + '-stat'"> 
        <v-card elevation="0" height="200px" class="grey-background">
          <v-list dense class="c-p-1 c-pb-5 grey-background" :class="[{ 'delimiter': (i + 1) != tokenStat.length }]">
            <v-list-tile>
              <v-list-tile-content class="grey--text">
                <span class="body-2"> 
                  <v-icon class="subheading">local_atm</v-icon>
                  NSF Grant Tokens
                </span>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content class="headline bold" :class="item.isGreen ? 'green--text text--darken-1': 'blue--text text--darken-1'">{{item.amount | currency}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content class="subheading grey--text">{{item.text}}</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>

      <v-flex xs2 class="grey-background">
        <v-card elevation="0" height="100%" class="grey-background">
          <div class="c-pt-3 c-pr-4 c-pl-4 grey-background ">
            <!-- <div>
              <v-btn :outline="showIssueTokensControl" class="ma-0" block color="primary" @click="toggleIssueTokensControl()">
                <v-icon v-if="!showIssueTokensControl">attach_money</v-icon> {{showIssueTokensControl ? 'Hide' : 'Issue Tokens'}}</span>
              </v-btn>
            </div> -->
            <div class="c-pt-2">
              <div class="body-2">NSF Grant Tokens</div>
              <div class="c-pt-2">
                <v-text-field v-model="amountToIssue" label="Amount" mask="##############" append-icon="local_atm"></v-text-field>
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
          </div>
        </v-card>
      </v-flex>


      <v-flex xs6 class="c-pr-5 c-pl-5 c-pt-5 c-mt-10">

        <v-tabs slot="extension" v-model="tab" grow color="#f5f5f5">
          <v-tabs-slider color="green"></v-tabs-slider>
          <v-tab key="awards" class="green--text text--darken-1">
            Awards
          </v-tab>

          <v-tab key="payments" class="green--text text--darken-1">
            Payments
          </v-tab>
        </v-tabs>
      </v-flex>

      <v-flex xs6></v-flex>

      <v-flex xs12>
        <v-tabs-items v-model="tab">
          <v-tab-item key="awards">
            <div>
              <v-card height="100vh">
                <v-card-text>
                  <v-layout>
                    <v-flex xs12>
                      <template row>

                        <v-data-table
                          :headers="awardHeaders"
                          :items="awards"
                          disable-initial-sort
                          hide-actions>

                          <template slot="items" slot-scope="props">
                            <td><router-link class="a body-2" :to="{ name: 'AwardDetails', params: { org: props.item.organization.permlink, contractId: props.item.contract.id, awardId: props.item.awardId } }">{{ props.item | awardNumber }}</router-link></td>
                            <td v-if="isProgramOfficer || isFinancialOfficer"><router-link class="a body-1" :to="{ name: 'UserDetails', params: { account_name: props.item.pi.account.name } }">{{ props.item.pi | fullname}}</router-link></td>
                            <td v-if="isProgramOfficer || isFinancialOfficer"><div><a href="#" class="a body-1">{{ props.item.organization.name }}</a></div></td>
                            <td><span class="body-1">{{ moment(new Date(props.item.from)).format("MM/YY") }} - {{ moment(new Date(props.item.to)).format("MM/YY") }}</span></td>
                            <td><span class="body-1">$ {{ props.item.totalAmount | currency }}</span></td>
                            <td>
                              <span class="body-1">
                                <span v-if="props.item.contract.status == FUNDING_CONTRACT_PENDING">N/A</span>
                                <span v-else>$ {{ props.item.requestedAmount | currency}}</span>
                              </span>
                            </td>
                            <td>
                              <span class="body-1">
                                <span v-if="props.item.contract.status == FUNDING_CONTRACT_PENDING">N/A</span>
                                <span v-else>$ {{ props.item.universityOverheadAmount | currency}}</span>
                              </span>
                            </td>
                            <td>
                              <span class="body-1">
                                <span v-if="props.item.contract.status == FUNDING_CONTRACT_PENDING">N/A</span>
                                <span v-else>$ {{ props.item.remainingAmount | currency }}</span>
                              </span>
                            </td>
                          </template>
                        </v-data-table>
                      </template>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex xs12>
                      <div class="awards-total-row body-1 bold">
                        <table style="width: 100%">
                          <tbody>
                            <tr>
                              <td v-for="(header, i) in awardHeaders" :style="{ width: header.width, padding: '0px 24px'}">
                                <span v-if="i == 0">Total</span>
                                <span v-if="header.value == 'totalAmount'">$ {{totalAwardsAmount | currency}}</span>
                                <span v-else-if="header.value == 'requestedAmount'">$ {{totalRequestedAmount | currency}}</span>
                                <span v-else-if="header.value == 'universityOverheadAmount'">$ {{totalAdminExpensesAmount | currency}}</span>
                                <span v-else-if="header.value == 'remainingAmount'">$ {{totalRemainingAmount | currency}}</span>
                                <span v-else></span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </div>
          </v-tab-item>

          <v-tab-item key="payments">
            <div>
              <v-card height="100vh">

                <v-card-text>
                  <v-layout>
                    <v-flex xs12>
                      <template row>

                        <v-layout style="padding: 10px 0px 0px 0px">

                          <v-flex xs3>
                            <div style="padding: 0px 10px 0px 10px">
                              <v-select
                                v-model="paymentsFilter.status"
                                :items="paymentsFilterByStatus"
                                label="STATUS"
                                return-object
                                solo dense>
                              </v-select>   
                            </div>
                          </v-flex>

                          <v-flex xs3 v-if="isProgramOfficer || isFinancialOfficer">
                            <div style="padding: 0px 10px 0px 10px">
                              <v-select
                                v-model="paymentsFilter.organization"
                                :items="paymentsFilterByOrganization"
                                label="ORGANIZATION"
                                return-object
                                solo dense>
                              </v-select>
                            </div>                       
                          </v-flex>

                          <v-flex xs3 v-if="isProgramOfficer || isFinancialOfficer">
                            <div style="padding: 0px 10px 0px 10px">
                              <v-select
                                v-model="paymentsFilter.pi"
                                :items="paymentsFilterByPI"
                                label="PI"
                                return-object
                                solo dense>
                              </v-select>
                            </div>                       
                          </v-flex>

                          <v-spacer></v-spacer>

                          <v-flex xs2 v-if="isProgramOfficer">
                            <div style="padding: 0px 10px 0px 10px">
                              <v-btn block @click="confirmApproval.isShown = true" color="success" :disabled="!selectedToApprove.length || isApproving" :loading="isApproving">
                                {{ selectedToApprove.length ? `Approve (${selectedToApprove.length})` : `Approve`}}
                              </v-btn>
                              <confirm-action-dialog
                                :meta="confirmApproval" 
                                :title="``"
                                :text="`Are you sure you want to approve selected payment requests?`" 
                                @confirmed="approveSelectedPaymentRequests(); confirmApproval.isShown = false"  
                                @canceled="confirmApproval.isShown = false">
                              </confirm-action-dialog>
                            </div>
                          </v-flex>

                          <v-flex xs2 v-if="isCertifier">
                            <div style="padding: 0px 10px 0px 10px">
                              <v-btn block @click="confirmCertifying.isShown = true" color="warning" :disabled="!selectedToCertify.length || isCertifying" :loading="isCertifying">
                                {{ selectedToCertify.length ? `Certify (${selectedToCertify.length})` : `Certify`}}
                              </v-btn>
                              <confirm-action-dialog
                                :meta="confirmCertifying" 
                                :title="``" 
                                :text="`Are you sure you want to certify selected payment requests?`" 
                                @confirmed="certifySelectedPaymentRequests(); confirmCertifying.isShown = false"  
                                @canceled="confirmCertifying.isShown = false">
                              </confirm-action-dialog>
                            </div>
                          </v-flex>

                        </v-layout>

                        <v-data-table
                          :headers="paymentHeaders"
                          :items="filteredPayments"
                          v-model="selectedPayments"
                          disable-initial-sort
                          hide-actions>

                          <template slot="items" slot-scope="props">
                            <td v-if="isCertifier || isProgramOfficer">
                              <v-checkbox v-if="(isCertifier && props.item.status == WITHDRAWAL_PENDING) || (props.item.status == WITHDRAWAL_CERTIFIED && isProgramOfficer)"
                                v-model="props.selected"
                                primary
                                hide-details
                              ></v-checkbox>
                            </td>
                            <td>
                              <v-chip class="payment-chip" :color="withdrawalStatusMap[props.item.status].color" :text-color="withdrawalStatusMap[props.item.status].textColor">
                                <div class="payment-chip-label">{{ withdrawalStatusMap[props.item.status].text }}</div>
                              </v-chip>
                            </td>
                            <td><span class="body-1">{{ props.item | paymentNumber }}</span></td>
                            <td><router-link class="a body-2" :to="{ name: 'AwardDetails', params: { org: props.item.organization.permlink, contractId: props.item.contract.id, awardId: props.item.awardId } }">{{ props.item.award | awardNumber }}</router-link></td>
                            <td v-if="isProgramOfficer || isFinancialOfficer"><router-link class="a body-1" :to="{ name: 'UserDetails', params: { account_name: props.item.pi.account.name } }">{{ props.item.pi | fullname}}</router-link></td>
                            <td v-if="isProgramOfficer || isFinancialOfficer"><div><a href="#" class="a body-1">{{ props.item.organization.name }}</a></div></td>
                            <td>
                              <router-link class="a body-1" :to="{ name: 'UserDetails', params: { account_name: props.item.requester.account.name } }">{{ props.item.requester | fullname}}</router-link>
                              <span v-if="props.item.requester.account.name != props.item.pi.account.name" class="grey--text caption">(subawardee)</span>
                            </td>
                            <td><span class="body-1 grey--text">{{moment(props.item.timestamp).format('MM/DD/YYYY HH:mm:ss')}}</span></td>
                            <td><div class="body-2 text-align-right">$ {{ props.item.amount | currency }}</div></td>
                          </template>
                        </v-data-table>

                      </template>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex xs12>
                      <div class="awards-total-row body-1 bold">
                        <table style="width: 100%">
                          <tbody>
                            <tr>
                              <td v-for="(header, i) in paymentHeaders" :style="{ width: header.width, padding: '0px 24px' }">
                                <span v-if="i == 0">Total</span>
                                <div v-if="header.value == 'amount'" class="body-2 text-align-right">$ {{totalPaymentsAmount | currency}}</div>
                                <span v-else></span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </v-flex>
                  </v-layout>

                </v-card-text>
              </v-card>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';
    import moment from 'moment';
    import deipRpc from '@deip/deip-rpc-client';
    import {
      withdrawalStatus, withdrawalStatusMap, WITHDRAWAL_PENDING, WITHDRAWAL_CERTIFIED, WITHDRAWAL_APPROVED, WITHDRAWAL_REJECTED, 
      fundingContractStatus, FUNDING_CONTRACT_PENDING, FUNDING_CONTRACT_APPROVED, FUNDING_CONTRACT_REJECTED,
      fundingTransactionStatus, FUNDING_TRANSACTION_TRANSFER, FUNDING_TRANSACTION_WITHDRAW, FUNDING_TRANSACTION_FEE
    } from './../../services/FundingService';

    export default {
      name: "OrganizationFinanceDashboard",

      data() {
        return {
          tab: null,

          paymentsFilter: {
            status: { text: 'ALL STATUSES', value: undefined },
            organization: { text: "ALL ORGANIZATIONS", value: undefined },
            pi: { text: "ALL PIs", value: undefined }
          },

          amountToIssue: null,
          isIssuingTokens: false,
          showIssueTokensControl: false,

          selectedPayments: [],

          selectedToCertify: [],
          isCertifying: false,
          confirmCertifying: { isShown: false },

          selectedToApprove: [],
          isApproving: false,
          confirmApproval: { isShown: false },

          withdrawalStatusMap,
          ...withdrawalStatus,
          ...fundingTransactionStatus,
          ...fundingContractStatus
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
          tokenInfo: 'org_finance_dashboard/tokenInfo',
          awards: 'org_finance_dashboard/awards',
          payments: 'org_finance_dashboard/payments'
        }),

        awardHeaders() {
          return this.isFinancialOfficer ? [
            { text: 'AWARD #', value: 'awardId', width: "10%" },
            { text: 'PI', value: 'pi.account.name', width: "11%" }, // display PI info for NSF PO
            { text: 'ORGANIZATION', value: 'organization.name', width: "12%" }, // display organization info for NSF PO
            { text: 'DURATION', value: 'from', width: "13%" },
            { text: 'AWARD AMOUNT', value: 'totalAmount', width: "13.5%" },
            { text: 'REQUESTED', value: 'requestedAmount', width: "13.5%" },
            { text: 'ADMIN EXPENSES', value: 'universityOverheadAmount', width: "13.5%" },
            { text: 'REMAINING', value: 'remainingAmount', width: "13.5%" }
          ] : this.isProgramOfficer ? [
            { text: 'AWARD #', value: 'awardId', width: "10%" },
            { text: 'PI', value: 'pi.account.name', width: "11%" }, // display PI info for NSF PO
            { text: 'ORGANIZATION', value: 'organization.name', width: "12%" }, // display organization info for NSF PO
            { text: 'DURATION', value: 'from', width: "13%" },
            { text: 'AWARD AMOUNT', value: 'totalAmount', width: "13.5%" },
            { text: 'REQUESTED', value: 'requestedAmount', width: "13.5%" },
            { text: 'ADMIN EXPENSES', value: 'universityOverheadAmount', width: "13.5%" },
            { text: 'REMAINING', value: 'remainingAmount', width: "13.5%" }
          ] : [
            { text: 'AWARD #', value: 'awardId', width: "16.6%" },
            { text: 'DURATION', value: 'from', width: "16.6%" },
            { text: 'AWARD AMOUNT', value: 'totalAmount', width: "16.6%" },
            { text: 'REQUESTED', value: 'requestedAmount', width: "16.6%" },
            { text: 'ADMIN EXPENSES', value: 'universityOverheadAmount', width: "16.6%" },
            { text: 'REMAINING', value: 'remainingAmount', width: "16.6%" }
          ];
        },

        totalAwardsAmount() {
          return this.awards
            // .filter(tx => tx.contract.status != FUNDING_CONTRACT_PENDING)
            .map(tx => tx.totalAmount)
			      .reduce((sum, amount) => sum + amount, 0);
        },

        totalRequestedAmount() {
          return this.awards
            .filter(tx => tx.contract.status != FUNDING_CONTRACT_PENDING)
            .map(tx => tx.requestedAmount)
			      .reduce((sum, amount) => sum + amount, 0);
        },
        
        totalAdminExpensesAmount() {
          return this.awards
            .filter(tx => tx.contract.status != FUNDING_CONTRACT_PENDING)
            .map(tx => tx.universityOverheadAmount)
			      .reduce((sum, amount) => sum + amount, 0);
        },

        totalRemainingAmount() {
          return this.awards
            .filter(tx => tx.contract.status != FUNDING_CONTRACT_PENDING)
            .map(tx => tx.remainingAmount)
			      .reduce((sum, amount) => sum + amount, 0);
        },

        paymentHeaders() {
          return this.isProgramOfficer ? [
            { text: '', sortable: false, width: "5%" },  // display checkbox for NSF PO
            { text: 'STATUS', value: 'status', align: 'center', width: "15%" },
            { text: 'PAYMENT #', value: 'paymentId', width: "10%" },
            { text: 'AWARD #', value: 'awardId', width: "10%" },
            { text: 'PI', value: 'pi.account.name', width: "15%" }, // display PI info for NSF PO
            { text: 'ORGANIZATION', value: 'organization.name', width: "5%" }, // display organization info for NSF PO
            { text: 'REQUESTER', value: 'pi.account.name', width: "15%" },
            { text: 'TIMESTAMP', value: 'timestamp', width: "10%" },
            { text: 'AMOUNT', value: 'amount', align: 'right', width: "15%" }
          ] : this.isFinancialOfficer ? [
            { text: 'STATUS', value: 'status', align: 'center', width: "15%" },
            { text: 'PAYMENT #', value: 'paymentId', width: "10%" },
            { text: 'AWARD #', value: 'awardId', width: "10%" },
            { text: 'PI', value: 'pi.account.name', width: "15%" }, // display PI info for NSF FO
            { text: 'ORGANIZATION', value: 'organization.name', width: "10%" }, // display organization info for NSF FO
            { text: 'REQUESTER', value: 'pi.account.name', width: "15%" },
            { text: 'TIMESTAMP', value: 'timestamp', width: "10%" },
            { text: 'AMOUNT', value: 'amount', align: 'right', width: "15%" }
          ] : this.isCertifier ? [
            { text: '', sortable: false, width: "5%" }, // display checkbox for Organization Certifier
            { text: 'STATUS', value: 'status', align: 'center', width: "20%" },
            { text: 'PAYMENT #', value: 'paymentId', width: "10%" },
            { text: 'AWARD #', value: 'awardId', width: "10%" },
            { text: 'REQUESTER', value: 'pi.account.name', width: "20%" },
            { text: 'TIMESTAMP', value: 'timestamp', width: "15%" },
            { text: 'AMOUNT', value: 'amount', align: 'right', width: "20%" }
          ] : [
            { text: 'STATUS', value: 'status', align: 'center', width: "20%" },
            { text: 'PAYMENT #', value: 'paymentId', width: "10%" },
            { text: 'AWARD #', value: 'awardId', width: "10%"  },
            { text: 'REQUESTER', value: 'pi.account.name', width: "20%"  },
            { text: 'TIMESTAMP', value: 'timestamp', width: "15%" },
            { text: 'AMOUNT', value: 'amount', align: 'right', width: "25%"  }
          ];
        },

        paymentsFilterByStatus() {
          return [ 
            { text: 'ALL STATUSES', value: undefined },
            { text: 'PENDING CERTIFICATION', value: [ WITHDRAWAL_PENDING ] },
            { text: 'PENDING APPROVAL', value: [ WITHDRAWAL_CERTIFIED ] },
            { text: 'PAID', value: [ WITHDRAWAL_APPROVED ] },
          ];
        },

        paymentsFilterByOrganization() {
          const uniqueOrganizations = [{ text: "ALL ORGANIZATIONS", value: undefined }];
          for (let i = 0; i < this.payments.length; i++) {
            let organization = this.payments[i].organization;
            if (!uniqueOrganizations.some(o => o.id == organization.id)) {
              uniqueOrganizations.push({ text: organization.name, value: organization.id });
            }
          }
          return uniqueOrganizations;
        },

        paymentsFilterByPI() {
          const uniquePIs= [{ text: "ALL PIs", value: undefined }];
          for (let i = 0; i < this.payments.length; i++) {
            let pi = this.payments[i].pi;
            if (!uniquePIs.some(o => o.id == pi.account.name)) {
              let name = this.$options.filters.fullname(pi);
              uniquePIs.push({ text: name, value: pi.account.name });
            }
          }
          return uniquePIs;
        },

        filteredPayments() {
          return this.payments
            .filter((p) => { return this.paymentsFilter.status != undefined && this.paymentsFilter.status.value != undefined ? this.paymentsFilter.status.value.some(s => s == p.status) : true; })
            .filter((p) => { return this.paymentsFilter.organization != undefined && this.paymentsFilter.organization.value != undefined ? this.paymentsFilter.organization.value == p.organization.id : true; })
            .filter((p) => { return this.paymentsFilter.pi != undefined && this.paymentsFilter.pi.value != undefined ? this.paymentsFilter.pi.value == p.pi.account.name : true; });
        },

        totalPaymentsAmount() {
          return this.filteredPayments
            .map(tx => tx.amount)
			      .reduce((sum, amount) => sum + amount, 0);
        },

        tokenStat() {
		      return this.tokenInfo ? [
            {
              amount: this.tokenInfo.total_issued,
              text: "Issued",
            }, {
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

        certifySelectedPaymentRequests() {
          this.isCertifying = true;

          let promises = this.selectedToCertify.map(
            p => deipRpc.broadcast.certifyFundingWithdrawalRequestAsync(
              this.user.privKey,
              this.user.username,
              p.paymentId
          ));

          Promise.all(promises)
            .then(() => {
              let reload = new Promise((resolve, reject) => {
                this.$store.dispatch('org_finance_dashboard/loadAwards', { notify: resolve });
              });
              return Promise.all([reload]);
            })
            .then(() => {
              this.$store.dispatch('layout/setSuccess', {
                message: `Payment requests have been certified successfully!`
              });
            })
            .catch((err) => {
              console.log(err);
              this.$store.dispatch('layout/setError', {
                  message: `An error occurred while sending the request, please try again later.`
              });
            })
            .finally(() => {
              this.selectedToCertify = [];
              this.isCertifying = false;
            });
        },

        approveSelectedPaymentRequests() {
          this.isApproving = true;

          let promises = this.selectedToApprove.map(
            p => deipRpc.broadcast.approveFundingWithdrawalRequestAsync(
              this.user.privKey,
              p.paymentId,
              this.user.username
          ));

          Promise.all(promises)
            .then(() => {
              let reload = new Promise((resolve, reject) => {
                this.$store.dispatch('org_finance_dashboard/loadAwards', { notify: resolve });
              });
              return Promise.all([reload]);
            })
            .then(() => {
              this.$store.dispatch('layout/setSuccess', {
                message: `Payment requests have been approved successfully!`
              });
            })
            .catch((err) => {
              console.log(err);
              this.$store.dispatch('layout/setError', {
                  message: `An error occurred while sending the request, please try again later.`
              });
            })
            .finally(() => {
              this.selectedToApprove = [];
              this.isApproving = false;
            });
        }
      },
      
      watch: {
        'selectedPayments': function (newVal, oldVal) {
          this.selectedToCertify = newVal.filter(p => p.status == WITHDRAWAL_PENDING);
          this.selectedToApprove = newVal.filter(p => p.status == WITHDRAWAL_CERTIFIED);
        }
      }

    };
</script>

<style lang="less" scoped>

  .grey-background {
    background-color: #f5f5f5
  }

  .delimiter {
    border-right: 2px solid #e0e0e0;
    border-radius: 0px;
  }

  .awards-total-row {
    background-color: var(--v-secondary-base); 
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .payment-chip .payment-chip-label {
    min-width: 150px; 
    text-align: center;
  }
</style>
