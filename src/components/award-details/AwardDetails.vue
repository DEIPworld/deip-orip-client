<template>
  <v-container fluid class="ma-0 pa-0 c-pb-10">
    <v-layout row wrap>

      <v-flex xs10 class="pa-4 grey-background">
        <h1 class="display-1">Award # {{award | awardNumber}} 
          <span v-if="award.isSubaward" class="subheading grey--text">
            (subaward of 
            <router-link class="a body-2" :to="{ name: 'AwardDetails', 
              params: { 
                org: award.parentAward.organization.permlink, 
                contractId: award.contract.id,
                awardId: award.parentAward.id } }"># {{award.parentAward | awardNumber}}
            </router-link>)
          </span>
        </h1>
      </v-flex>
      
      <v-flex xs2 class="pa-4 grey-background">
        <div v-if="isProgramOfficer && !award.isSubaward">
          <v-btn block @click="confirmDistribution.isShown = true" color="success" :disabled="!isAwardNotDistributed || isDistributing" :loading="isDistributing">
            {{isAwardNotDistributed ? 'Distribute' : 'Distributed'}}
          </v-btn>
          <confirm-action-dialog
            :meta="confirmDistribution" 
            :title="``"
            :text="`Are you sure you want to distribute the award?`" 
            @confirmed="distributeTokensToAward(); confirmDistribution.isShown = false"  
            @canceled="confirmDistribution.isShown = false">
          </confirm-action-dialog>
        </div>

        <div v-if="isPrincipalInvestigator">
          <v-btn block color="primary" @click="awardWithdrawMeta.isOpen = true;" :disabled="isAwardNotDistributed || award.pi.account.name != user.username">Request Payment</v-btn>
          <request-award-payment-dialog :meta="awardWithdrawMeta"></request-award-payment-dialog>
        </div>
      </v-flex>

      <v-flex xs6 class="pa-4 grey-background">
        <v-layout row wrap>
          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">PI</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <router-link class="a body-2" :to="{ name: 'UserDetails', params: { account_name: award.pi.account.name } }">{{ award.pi | fullname }}</router-link>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Organization</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <a href="#" class="a body-2">{{ award.organization.name}}</a>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Award title</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <router-link class="a body-2" 
              :to="{ name: 'AgencyProgramDetails', params: {
                      agency: award.contract.foa.agency_name, 
                      foa: award.contract.foa.funding_opportunity_number }}">
              {{award.contract.foa.funding_opportunity_title }}
            </router-link>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Agency</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <a href="#" class="a body-2">{{ award.contract.foa.agency_name.toUpperCase()}}</a>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Duration</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <span class="body-2">{{ moment(new Date(award.from)).format("MM/YY") }} - {{ moment(new Date(award.to)).format("MM/YY") }}</span>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs1 class="grey-background py-3 text-xs-center"><v-divider vertical></v-divider></v-flex>

      <v-flex xs5 class="pa-4 grey-background">
        <v-layout row wrap>
          <v-flex xs5 class="pa-1">
            <span class="body-2 grey--text">Award amount</span>
          </v-flex>
          <v-flex xs7 class="pa-1">
            <span class="bold">$ {{ award.totalAmount | currency}}</span>
          </v-flex>

          <v-flex xs8 class="pa-1"><v-divider></v-divider></v-flex><v-flex xs4></v-flex>

          <v-flex xs5 class="pa-1">
            <span class="body-2 grey--text">Administrative expenses</span>
          </v-flex>
          <v-flex xs7 class="pa-1">
            <span class="body-2">$ {{ award.universityOverheadAmount | currency}}</span>
          </v-flex>

          <v-flex xs5 class="pa-1">
            <span class="body-2 grey--text">Withdrawn by PI</span>
          </v-flex>
          <v-flex xs7 class="pa-1">
            <span class="body-2">$ {{ award.withdrawnPiAmount | currency}}</span><span class="body-2 grey--text"> of $ {{award.piAmount | currency}}</span>
          </v-flex>

          <v-flex xs5 class="pa-1">
            <span class="body-2 grey--text">Withdrawn by Subawardees</span>
          </v-flex>
          <v-flex xs7 class="pa-1">
            <span class="body-2">$ {{ award.withdrawnSubawardeesAmount | currency}}</span><span class="body-2 grey--text"> of $ {{award.subawardeesAmount | currency}}</span>
          </v-flex>

          <v-flex xs8 class="pa-1"><v-divider></v-divider></v-flex><v-flex xs4></v-flex>

          <v-flex xs5 class="pa-1">
            <span class="body-2 grey--text">Available amount</span>
          </v-flex>
          <v-flex xs7 class="pa-1">
            <span class="bold">$ {{ award.remainingAmount | currency}}</span>
          </v-flex>

        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="pa-4" v-if="subawards.length">
      <v-flex xs12 class="py-3"><h3>Subawards</h3></v-flex xs12>
      <v-flex xs12>
        <v-data-table
          class="subawards-table"
          :headers="subawardsHeaders"
          :items="subawards"
          disable-initial-sort
          hide-actions>

          <template slot="items" slot-scope="props">
            <td><router-link class="a body-2" :to="{ name: 'AwardDetails', params: { org: props.item.organization.permlink, contractId: props.item.contract.id, awardId: props.item.subawardId } }">{{props.item | awardNumber}}</router-link></td>
            <td><router-link class="a body-2" :to="{ name: 'UserDetails', params: { account_name: props.item.subawardee.account.name } }">{{props.item.subawardee | fullname}}</router-link></td>
            <td><span class="body-1"><a class="a body-1" href="#">{{props.item.organization.name}}</a></span></td>
            <td><span class="body-1">$ {{props.item.subawardAmount | currency}}</span></td>
            <td>
              <span class="body-1">
                <span v-if="isAwardNotDistributed">N/A</span>
                <span v-else>$ {{props.item.requestedSubawardAmount | currency}}</span>
              </span>
            </td>
            <td>
              <span class="body-1">
                <span v-if="isAwardNotDistributed">N/A</span>
                <span v-else>$ {{props.item.withdrawnSubawardAmount | currency}}</span>
              </span>
            </td>
            <td>
              <span class="body-1">
                <span v-if="isAwardNotDistributed">N/A</span>
                <span v-else>$ {{props.item.remainingSubawardAmount | currency}}</span>
              </span>
            </td>
          </template>

          <template slot="footer">
            <td v-for="(header, i) in subawardsHeaders" class="body-2 bold">
              <span v-if="i == 0">Total</span>
              <span v-if="header.value == 'subawardAmount'">$ {{totalSubawardsAmount | currency}}</span>
              <span v-else-if="header.value == 'requestedSubawardAmount'">$ {{totalSubawardsRequestedAmount | currency}}</span>
              <span v-else-if="header.value == 'withdrawnSubawardAmount'">$ {{totalSubawardsWithdrawnAmount | currency}}</span>
              <span v-else-if="header.value == 'remainingSubawardAmount'">$ {{totalSubawardsRemainingAmount | currency}}</span>
              <span v-else></span>
            </td>
          </template>
        </v-data-table>
      </v-flex>

    </v-layout>

    <v-layout row wrap class="pa-4">
      <v-flex xs12 class="py-3"><h3>Payments</h3></v-flex xs12>
      <v-flex xs12>
        <v-layout style="padding: 10px 0px 0px 0px">

          <v-flex xs3>
            <div style="padding: 0px 20px 0px 0px">
              <v-select
                v-model="paymentsFilter.status"
                :items="paymentsFilterByStatus"
                label="STATUS"
                return-object
                solo dense>
              </v-select>   
            </div>
          </v-flex>

          <v-flex xs3>
            <div style="padding: 0px 20px 0px 0px">
              <v-select
                v-model="paymentsFilter.requester"
                :items="paymentsFilterByRequester"
                label="REQUESTER"
                return-object
                solo dense>
              </v-select>   
            </div>
          </v-flex>

          <v-spacer></v-spacer>

          <v-flex xs2 v-if="isProgramOfficer">
            <div style="padding: 0px 15px 0px 0px">
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
            <div style="padding: 0px 15px 0px 0px">
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
          
          <v-flex xs2 v-if="isTreasury">
            <div style="padding: 0px 15px 0px 0px">
              <v-btn block @click="confirmPayment.isShown = true" color="success" :disabled="!selectedToPay.length || isPaying" :loading="isPaying">
                {{ selectedToPay.length ? `Confirm Payment (${selectedToPay.length})` : `Confirm Payment`}}
              </v-btn>
              <confirm-action-dialog
                :meta="confirmPayment" 
                :title="``" 
                :text="`Are you sure you want to send payment to selected payment requests?`" 
                @confirmed="paySelectedPaymentRequests(); confirmPayment.isShown = false"  
                @canceled="confirmPayment.isShown = false">
              </confirm-action-dialog>
            </div>
          </v-flex>
          
        </v-layout>
      </v-flex>
      <v-flex xs12>
        <v-data-table
          class="awards-table"
          :headers="paymentHeaders"
          :items="filteredPayments"
          v-model="selectedPayments"
          disable-initial-sort
          :no-data-text="isAwardNotDistributed ? `Award is not distributed yet` : `No payments found`" 
          hide-actions>

          <template slot="items" slot-scope="props">
            <td v-if="isCertifier || isProgramOfficer || isTreasury">
              <v-checkbox v-if="
              (props.item.status == WITHDRAWAL_PENDING && isCertifier) || 
              (props.item.status == WITHDRAWAL_CERTIFIED && isProgramOfficer) ||
              (props.item.status == WITHDRAWAL_APPROVED && isTreasury)"
                v-model="props.selected"
                primary
                hide-details
              ></v-checkbox>
            </td>
            <td>
              <v-chip class="payment-status-chip" :color="withdrawalStatusMap[props.item.status].color" :text-color="withdrawalStatusMap[props.item.status].textColor">
                <div class="payment-status-chip-label">{{ withdrawalStatusMap[props.item.status].text }}</div>
              </v-chip>
            </td>
            <td><router-link class="a body-2" :to="{ name: 'PaymentDetails', params: { org: props.item.organization.permlink, contractId: props.item.contract.id, awardId: props.item.awardId, paymentId: props.item.id } }">{{ props.item | paymentNumber }}</router-link></td>
            <td>
              <router-link class="a body-1" :to="{ name: 'UserDetails', params: { account_name: props.item.requester.account.name } }">{{ props.item.requester | fullname}}</router-link>
              <span v-if="(props.item.requester.account.name != props.item.pi.account.name) && !award.isSubaward" class="grey--text caption">(subawardee)</span>
            </td>
            <td><span class="body-1 grey--text">{{moment(props.item.timestamp).format('MM/DD/YYYY HH:mm:ss')}}</span></td>
            <td><div class="body-2 text-align-right">$ {{ props.item.amount | currency }}</div></td>
          </template>

          <template slot="footer">
            <td v-for="(header, i) in paymentHeaders" class="body-2 bold">
              <span v-if="i == 0">Total</span>
              <div v-if="header.value == 'amount'" class="body-2 bold text-align-right">$ {{totalPaymentsAmount | currency}}</div>
              <span v-else></span>
            </td>
          </template>

        </v-data-table>
      </v-flex>

    </v-layout>

  </v-container>
</template>

<script>

    import deipRpc from '@deip/deip-rpc-client';
    import { mapGetters } from 'vuex';
    import {
      withdrawalStatus, withdrawalStatusMap, WITHDRAWAL_PENDING, WITHDRAWAL_CERTIFIED, WITHDRAWAL_APPROVED, WITHDRAWAL_PAID, WITHDRAWAL_REJECTED, 
      fundingContractStatus, FUNDING_CONTRACT_PENDING, FUNDING_CONTRACT_APPROVED, FUNDING_CONTRACT_REJECTED,
    } from './../../services/FundingService';

    export default {
        name: "AwardDetails",

        data() {
          return {
            
            paymentsFilter: {
              status: { text: 'ALL STATUSES', value: undefined },
              requester: { text: "ALL REQUESTERS", value: undefined },
            },

            selectedPayments: [],

            selectedToCertify: [],
            isCertifying: false,
            confirmCertifying: { isShown: false },

            selectedToApprove: [],
            isApproving: false,
            confirmApproval: { isShown: false },

            selectedToPay: [],
            isPaying: false,
            confirmPayment: { isShown: false },

            isDistributing: false,
            confirmDistribution: { isShown: false },

            awardWithdrawMeta: { isOpen: false, award: null },

            withdrawalStatusMap,
            ...withdrawalStatus,
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
              isTreasury: 'auth/isTreasury',
              organization: 'award_details/organization',
              award: 'award_details/award',
              payments: 'award_details/payments',
              subawards: 'award_details/subawards'
          }),

          isAwardNotDistributed() {
            return this.award.contract.status == FUNDING_CONTRACT_PENDING;
          },

          subawardsHeaders() {
            return [
              { text: 'SUBAWARD #', value: 'subawardId' },
              { text: 'SUBAWARDEE', value: 'subawardee' },
              { text: 'ORGANIZATION', value: 'organization.name' },
              { text: 'SUBAWARD AMOUNT', value: 'subawardAmount' },
              { text: 'REQUESTED', value: 'requestedSubawardAmount' },
              { text: 'WITHDRAWN', value: 'withdrawnSubawardAmount' },
              { text: 'AVAILABLE AMOUNT', value: 'remainingSubawardAmount' }
            ];
          },

          paymentHeaders() {
            return this.isProgramOfficer ? [
              { text: '', sortable: false },  // display checkbox for NSF PO
              { text: 'STATUS', value: 'status' },
              { text: 'PAYMENT #', value: 'paymentId' },
              { text: 'REQUESTER', value: 'requester.account.name' },
              { text: 'TIMESTAMP', value: 'timestamp' },
              { text: 'AMOUNT', value: 'amount', align: 'right' }
            ] : this.isFinancialOfficer ? [
              { text: 'STATUS', value: 'status' },
              { text: 'PAYMENT #', value: 'paymentId' },
              { text: 'REQUESTER', value: 'requester.account.name' },
              { text: 'TIMESTAMP', value: 'timestamp' },
              { text: 'AMOUNT', value: 'amount', align: 'right' }
            ] : this.isCertifier ? [
              { text: '', sortable: false }, // display checkbox for Organization Certifier
              { text: 'STATUS', value: 'status' },
              { text: 'PAYMENT #', value: 'paymentId' },
              { text: 'REQUESTER', value: 'requester.account.name' },
              { text: 'TIMESTAMP', value: 'timestamp' },
              { text: 'AMOUNT', value: 'amount', align: 'right' }
            ] : this.isTreasury ? [
              { text: '', sortable: false }, // display checkbox for Treasury
              { text: 'STATUS', value: 'status' },
              { text: 'PAYMENT #', value: 'paymentId' },
              { text: 'REQUESTER', value: 'requester.account.name' },
              { text: 'TIMESTAMP', value: 'timestamp' },
              { text: 'AMOUNT', value: 'amount', align: 'right' }
            ] : [
              { text: 'STATUS', value: 'status' },
              { text: 'PAYMENT #', value: 'paymentId' },
              { text: 'REQUESTER', value: 'requester.account.name' },
              { text: 'TIMESTAMP', value: 'timestamp' },
              { text: 'AMOUNT', value: 'amount', align: 'right' }
            ];
          },

          totalSubawardsAmount() {
            return this.subawards
              .map(tx => tx.subawardAmount)
              .reduce((sum, amount) => sum + amount, 0);
          },

          totalSubawardsWithdrawnAmount() {
            return this.subawards
              .filter(tx => tx.contract.status != FUNDING_CONTRACT_PENDING)
              .map(tx => tx.withdrawnSubawardAmount)
              .reduce((sum, amount) => sum + amount, 0);
          },

          totalSubawardsRequestedAmount() {
            return this.subawards
              .filter(tx => tx.contract.status != FUNDING_CONTRACT_PENDING)
              .map(tx => tx.requestedSubawardAmount)
              .reduce((sum, amount) => sum + amount, 0);
          },
          
          totalSubawardsRemainingAmount() {
            return this.subawards
              .filter(tx => tx.contract.status != FUNDING_CONTRACT_PENDING)
              .map(tx => tx.remainingSubawardAmount)
              .reduce((sum, amount) => sum + amount, 0);
          },

          paymentsFilterByStatus() {
            return [ 
              { text: 'ALL STATUSES', value: undefined },
              { text: 'PENDING CERTIFICATION', value: [ WITHDRAWAL_PENDING ] },
              { text: 'PENDING APPROVAL', value: [ WITHDRAWAL_CERTIFIED ] },
              { text: 'PENDING MONEY TRANSFER', value: [ WITHDRAWAL_APPROVED ] },
              { text: 'PAID', value: [ WITHDRAWAL_PAID ] },
            ];
          },

          paymentsFilterByRequester() {
            const uniqueRequesters = [{ text: "ALL REQUESTERS", value: undefined }];
            for (let i = 0; i < this.payments.length; i++) {
              let requester = this.payments[i].requester;
              if (!uniqueRequesters.some(o => o.id == requester.account.name)) {
                let name = this.$options.filters.fullname(requester);
                uniqueRequesters.push({ text: name, value: requester.account.name });
              }
            }
            return uniqueRequesters;
          },

          filteredPayments() {
            return this.payments
              .filter((p) => { return this.paymentsFilter.status != undefined && this.paymentsFilter.status.value != undefined ? this.paymentsFilter.status.value.some(s => s == p.status) : true; })
              .filter((p) => { return this.paymentsFilter.requester != undefined && this.paymentsFilter.requester.value != undefined ? this.paymentsFilter.requester.value == p.requester.account.name : true; });
          },
          
          totalPaymentsAmount() {
            return this.filteredPayments
              .map(tx => tx.amount)
              .reduce((sum, amount) => sum + amount, 0);
          }
        },

        methods: {

          certifySelectedPaymentRequests() {
            this.isCertifying = true;

            let promises = this.selectedToCertify.map(
              p => deipRpc.broadcast.certifyFundingWithdrawalRequestAsync(
                this.user.privKey,
                this.user.username,
                p.paymentId,
                p.organization.id
            ));

            Promise.all(promises)
              .then(() => {
                let reload = new Promise((resolve, reject) => {
                  this.$store.dispatch('award_details/loadAward', { notify: resolve, contractId: this.award.contract.id, awardId: this.award.id });
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
                this.user.username,
                p.organization.id
            ));

            Promise.all(promises)
              .then(() => {
                let reload = new Promise((resolve, reject) => {
                  this.$store.dispatch('award_details/loadAward', { notify: resolve, contractId: this.award.contract.id, awardId: this.award.id });
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
          },

          paySelectedPaymentRequests() {
            this.isPaying = true;

            let promises = this.selectedToPay.map(
              p => deipRpc.broadcast.payFundingWithdrawalRequestAsync(
                this.user.privKey,
                p.paymentId,
                this.user.username,
                p.organization.id
            ));

            Promise.all(promises)
              .then(() => {
                let reload = new Promise((resolve, reject) => {
                  this.$store.dispatch('award_details/loadAward', { notify: resolve, contractId: this.award.contract.id, awardId: this.award.id });
                });
                return Promise.all([reload]);
              })
              .then(() => {
                this.$store.dispatch('layout/setSuccess', {
                  message: `Money transfer has been sent successfully!`
                });
              })
              .catch((err) => {
                console.log(err);
                this.$store.dispatch('layout/setError', {
                    message: `An error occurred while sending the request, please try again later.`
                });
              })
              .finally(() => {
                this.selectedToPay = [];
                this.isPaying = false;
              });
          },

          distributeTokensToAward() {
            this.isDistributing = true;

            deipRpc.broadcast.approveFundingAsync(this.user.privKey, this.award.contract.id, this.user.username)
              .then(() => {
                let reload = new Promise((resolve, reject) => {
                  this.$store.dispatch('award_details/loadAward', { notify: resolve, contractId: this.award.contract.id, awardId: this.award.id });
                });
                return Promise.all([reload]);
              })
              .then(() => {
                this.$store.dispatch('layout/setSuccess', {
                  message: `NSF Grant Tokens have been sent successfully!`
                });
              })
              .catch((err) => {
                console.log(err);
                this.$store.dispatch('layout/setError', {
                  message: `An error occurred while sending the request, please try again later.`
                });
              })
              .finally(() => {
                this.isDistributing = false;
              });
          }

        },

        watch: {
          'selectedPayments': function (newVal, oldVal) {
            this.selectedToCertify = newVal.filter(p => p.status == WITHDRAWAL_PENDING);
            this.selectedToApprove = newVal.filter(p => p.status == WITHDRAWAL_CERTIFIED);
            this.selectedToPay = newVal.filter(p => p.status == WITHDRAWAL_APPROVED);
          },
          '$route.params': {
            handler(params) {
              if (this.award.organization.permlink != params.org || 
                  this.award.contract.id != params.contractId || 
                  this.award.id != params.awardId) {
                    this.$router.go();
              }
            },
            immediate: true
          }
        },

        created() {}
    };
</script>

<style lang="less" scoped>

  .grey-background {
    background-color: #f5f5f5
  }

  .total-row {
    background-color: var(--v-secondary-base); 
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .payment-status-chip .payment-status-chip-label {
    min-width: 170px; 
    text-align: center;
    text-transform: uppercase;
  }

</style>
