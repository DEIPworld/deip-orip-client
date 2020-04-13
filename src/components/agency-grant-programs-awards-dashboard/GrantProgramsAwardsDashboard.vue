<template>
  <v-container fluid class="ma-0 pa-0">
    <v-card class="elevation-0 pa-2">

    <v-layout row wrap>
      <v-flex xs12 class="pa-4">
        <h1 class="display-1">Dashboard</h1>
      </v-flex>

      <v-flex xs12 v-if="isGrantFinanceOfficer">
        <v-layout row justify-space-between>
          <v-flex class="grey-background token-stat-card" v-for="(item, i) in tokenStat" :key="`${i}-token-stat`" :class="[{ 'delimiter': (i + 1) != tokenStat.length }]"> 
            <v-card elevation="0" height="200px" class="px-2 grey-background">
              <v-list dense class="grey-background" >
                <v-list-tile>
                  <v-list-tile-content class="subheading grey--text bold">{{item.text}}</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content class="headline bold" :class="item.isGreen ? 'green--text text--darken-1': 'blue--text text--darken-1'">{{item.amount | currency}}</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content class="grey--text">
                    <span class="body-2"> 
                      <v-icon class="subheading">local_atm</v-icon>
                      NSF Grant Tokens
                    </span>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 class="px-2">
        <v-layout row class="pt-5">
          <v-tabs slot="extension" v-model="tab" grow color="#f5f5f5" style="width: 500px">
            <v-tabs-slider :color="themeSettings['tabs-slider-color']"></v-tabs-slider>
            <v-tab key="awards" :class="themeSettings['tabs-text-class']">
              Awards
            </v-tab>
            <v-tab key="payments" :class="themeSettings['tabs-text-class']">
              Payments
            </v-tab>
          </v-tabs>
        </v-layout>
      </v-flex>

      <v-flex xs12 class="px-2">
        <v-tabs-items v-model="tab">
          <v-tab-item key="awards">
            <v-layout row wrap class="py-4">
              
              <v-flex xs12>
                <v-layout row>
                  <v-flex xs3>
                    <v-layout row class="pr-4">
                      <v-select
                        v-model="awardsFilter.status"
                        :items="awardsFilterByStatus"
                        label="STATUS"
                        return-object
                        solo dense>
                      </v-select>   
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex xs12>
                <v-layout row>
                  <v-data-table
                    class="awards-table"
                    :headers="awardHeaders"
                    :items="filteredAwards"
                    disable-initial-sort
                    :no-data-text="`No awards found`"
                    hide-actions>

                    <template slot="items" slot-scope="props">
                      <td><router-link class="a body-2" :to="{ name: 'GrantProgramAwardDetails', params: { award_number: props.item.awardee.award_number, subaward_number: props.item.awardee.subaward_number } }">{{ props.item.awardee.subaward_number }}</router-link></td>
                      <td>
                        <v-chip class="award-status-chip" :color="awardStatusMap[props.item.award.status].color" :text-color="awardStatusMap[props.item.award.status].textColor">
                          <div class="award-status-chip-label">{{ awardStatusMap[props.item.award.status].text }}</div>
                        </v-chip>
                      </td>
                      <td v-if="isGrantProgramOfficer || isGrantFinanceOfficer"><router-link class="a body-1" :to="{ name: 'UserDetails', params: { account_name: props.item.topPi.account.name } }">{{ props.item.topPi | fullname}}</router-link></td>
                      <td v-if="isGrantProgramOfficer || isGrantFinanceOfficer"><div><a href="#" class="a body-1">{{ props.item.organization.name }}</a></div></td>
                      <td><span class="body-1">{{ moment(new Date(props.item.foa.open_date)).format("MM/YY") }} - {{ moment(new Date(props.item.foa.close_date)).format("MM/YY") }}</span></td>
                      <td><span class="body-1">{{ props.item.totalAmount | currency }}</span></td>
                      <td>
                        <span class="body-1">
                          <span v-if="props.item.award.status == AWARD_STATUS.PENDING || props.item.award.status == AWARD_STATUS.REJECTED">N/A</span>
                          <span v-else>{{ props.item.universityOverheadAmount | currency}}</span>
                        </span>
                      </td>
                      <td>
                        <span class="body-1">
                          <span v-if="props.item.award.status == AWARD_STATUS.PENDING || props.item.award.status == AWARD_STATUS.REJECTED">N/A</span>
                          <span v-else>{{ props.item.pendingAmount | currency}}</span>
                        </span>
                      </td>
                      <td>
                        <span class="body-1">
                          <span v-if="props.item.award.status == AWARD_STATUS.PENDING || props.item.award.status == AWARD_STATUS.REJECTED">N/A</span>
                          <span v-else>{{ props.item.withdrawnAmount | currency }}</span>
                        </span>
                      </td>
                      <td>
                        <span class="body-1">
                          <span v-if="props.item.award.status == AWARD_STATUS.PENDING || props.item.award.status == AWARD_STATUS.REJECTED">N/A</span>
                          <span v-else>{{ props.item.remainingAmount | currency }}</span>
                        </span>
                      </td>
                    </template>

                    <template slot="footer">
                      <td v-for="(header, i) in awardHeaders" :key="`${i}-award-header`" class="body-2 bold total-row">
                        <span v-if="i == 0">Total</span>
                        <span v-if="header.value == 'totalAmount'">{{totalAwardsAmount | currency}}</span>
                        <span v-else-if="header.value == 'universityOverheadAmount'">{{totalAdminExpensesAmount | currency}}</span>
                        <span v-else-if="header.value == 'pendingAmount'">{{totalPendingAmount | currency}}</span>
                        <span v-else-if="header.value == 'withdrawnAmount'">{{totalWithdrawnAmount | currency}}</span>
                        <span v-else-if="header.value == 'remainingAmount'">{{totalRemainingAmount | currency}}</span>
                        <span v-else></span>
                      </td>
                    </template>

                  </v-data-table>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-tab-item>

          <v-tab-item key="payments">
            <v-layout row wrap class="py-4">
              
              <v-flex xs12>
                <v-layout row>
                  <v-flex xs3>
                    <v-layout row class="pr-4">
                      <v-select
                        v-model="paymentsFilter.status"
                        :items="paymentsFilterByStatus"
                        label="STATUS"
                        return-object
                        solo dense>
                      </v-select>   
                    </v-layout>
                  </v-flex>

                  <v-flex xs3 v-if="isGrantProgramOfficer || isGrantFinanceOfficer || isTreasuryCertifier">
                    <v-layout row class="pr-4">
                      <v-select
                        v-model="paymentsFilter.organization"
                        :items="paymentsFilterByOrganization"
                        label="ORGANIZATION"
                        return-object
                        solo dense>
                      </v-select>
                    </v-layout>
                  </v-flex>

                  <v-flex xs3 v-if="isGrantProgramOfficer || isGrantFinanceOfficer || isTreasuryCertifier">
                    <v-layout row>
                      <v-select
                        v-model="paymentsFilter.topPi"
                        :items="paymentsFilterByPI"
                        label="PI"
                        return-object
                        solo dense>
                      </v-select>
                    </v-layout>
                  </v-flex>

                  <v-spacer></v-spacer>

                  <v-flex xs3 v-if="isUniversityCertifier">
                    <v-layout row justify-end>
                      <div>
                        <v-btn class="payment-action-btn" @click="confirmCertifying.isShown = true" color="warning" :disabled="!selectedToCertify.length || isCertifying || isRejecting" :loading="isCertifying">
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
                      <div>
                        <v-btn class="payment-action-btn" @click="confirmRejecting.isShown = true" color="error" :disabled="!selectedToReject.length || isRejecting || isCertifying" :loading="isRejecting">
                          {{ selectedToReject.length ? `Reject (${selectedToReject.length})` : `Reject`}}
                        </v-btn>
                        <confirm-action-dialog
                          :meta="confirmRejecting" 
                          :title="``"
                          :text="`Are you sure you want to reject selected payment requests?`" 
                          @confirmed="rejectSelectedPaymentRequests(); confirmRejecting.isShown = false"  
                          @canceled="confirmRejecting.isShown = false">
                        </confirm-action-dialog>
                      </div>
                    </v-layout>
                  </v-flex>

                  <v-flex xs2 v-if="isGrantProgramOfficer">
                    <v-layout row justify-end>
                      <div>
                        <v-btn class="payment-action-btn" @click="confirmApproval.isShown = true" color="success" :disabled="!selectedToApprove.length || isApproving || isRejecting" :loading="isApproving">
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
                      <div>
                        <v-btn class="payment-action-btn" @click="confirmRejecting.isShown = true" color="error" :disabled="!selectedToReject.length || isRejecting || isApproving" :loading="isRejecting">
                          {{ selectedToReject.length ? `Reject (${selectedToReject.length})` : `Reject`}}
                        </v-btn>
                        <confirm-action-dialog
                          :meta="confirmRejecting" 
                          :title="``"
                          :text="`Are you sure you want to reject selected payment requests?`" 
                          @confirmed="rejectSelectedPaymentRequests(); confirmRejecting.isShown = false"  
                          @canceled="confirmRejecting.isShown = false">
                        </confirm-action-dialog>
                      </div>
                    </v-layout>
                  </v-flex>

                  <v-flex xs2 v-if="isTreasuryCertifier">
                    <v-layout row justify-end>
                      <div>
                        <v-btn class="payment-action-btn" @click="confirmPayment.isShown = true" color="success" :disabled="!selectedToPay.length || isPaying" :loading="isPaying">
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
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex xs12>
                <v-data-table
                  class="payments-table"
                  :headers="paymentHeaders"
                  :items="filteredPayments"
                  v-model="selectedPayments"
                  :no-data-text="`No payments found`"
                  disable-initial-sort
                  hide-actions>

                  <template slot="items" slot-scope="props">
                    <td v-if="isUniversityCertifier || isGrantProgramOfficer || isTreasuryCertifier">
                      <v-checkbox v-if="
                        (props.item.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING && isUniversityCertifier) || 
                        (props.item.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED && isGrantProgramOfficer) ||
                        (props.item.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED && isTreasuryCertifier)"
                        v-model="props.selected"
                        primary
                        hide-details
                      ></v-checkbox>
                    </td>
                    <td>
                      <router-link class="a body-2" :to="{ name: 'GrantProgramAwardWithdrawalDetails', params: { award_number: props.item.awardee.award_number, subaward_number: props.item.awardee.subaward_number, payment_number: props.item.paymentNumber }}"> {{ props.item.paymentNumber }}</router-link>
                    </td>
                    <td>
                      <v-chip class="payment-status-chip" :color="withdrawalStatusMap[props.item.status].color" :text-color="withdrawalStatusMap[props.item.status].textColor">
                        <div class="payment-status-chip-label">{{ withdrawalStatusMap[props.item.status].text }}</div>
                      </v-chip>
                    </td>
                    <td>
                      <span><router-link class="a body-2" :to="{ name: 'GrantProgramAwardDetails', params: { award_number: props.item.awardee.award_number, subaward_number: props.item.awardee.subaward_number } }">{{ props.item.awardee.subaward_number }}</router-link></span>
                    </td>
                    <td v-if="isGrantProgramOfficer || isGrantFinanceOfficer || isTreasuryCertifier"><router-link class="a body-1" :to="{ name: 'UserDetails', params: { account_name: props.item.topPi.account.name } }">{{ props.item.topPi | fullname }}</router-link></td>
                    <td v-if="isGrantProgramOfficer || isGrantFinanceOfficer || isTreasuryCertifier"><router-link class="a body-2" :to="{ name: 'ResearchGroupDetails', params: { research_group_permlink: props.item.organization.permlink }}">{{ props.item.organization.name }}</router-link></td>
                    <td>
                      <router-link class="a body-1" :to="{ name: 'UserDetails', params: { account_name: props.item.requester.account.name } }">{{ props.item.requester | fullname }}</router-link>
                      <!-- <div v-if="props.item.awardee.isSubawardee && props.item.requester.account.name != user.account.name" class="grey--text caption">(subawardee)</div> -->
                      <div v-if="props.item.awardee.isSubawardee && isMemberOfAnyReseachGroup(props.item.parentOrganizations.map(o => o.id))" class="grey--text caption">(subawardee)</div>
                    </td>
                    <td><span class="body-1 grey--text">{{moment(props.item.timestamp).format('MM/DD/YYYY HH:mm:ss')}}</span></td>
                    <td><div class="body-2 text-align-right">{{ props.item.amount | currency }}</div></td>
                  </template>

                  <template slot="footer">
                    <td v-for="(header, i) in paymentHeaders" :key="`${i}-payment-header`" class="body-2 bold total-row">
                      <span v-if="i == 0">Total</span>
                      <div v-if="header.value == 'amount'" class="text-align-right">{{totalPaymentsAmount | currency}}</div>
                      <span v-else></span>
                    </td>
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>

    </v-layout>
    </v-card>
  </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';
    import moment from 'moment';
    import deipRpc from '@deip/rpc-client';
    import { AWARD_STATUS, AWARD_WITHDRAWAL_REQUEST_STATUS } from '@/variables';
    import { GrantsService } from '@deip/grants-service';

    const grantsService = GrantsService.getInstance();

    const awardsTab = 0;
    const paymentsTab = 1;

    const tabPreferenceMap = {
      'alice': awardsTab,
      'thomas': paymentsTab,
      'peter': awardsTab,
      'bob': awardsTab,
      'john': awardsTab,
      'david': paymentsTab,
      'kim': paymentsTab
    }

    export default {
      name: "GrantProgramAwardsDashboard",

      data() {
        return {
          tab: 0,

          awardsFilter: {
            status: { text: 'ALL STATUSES', value: undefined }
          },

          paymentsFilter: {
            status: { text: 'ALL STATUSES', value: undefined },
            organization: { text: "ALL ORGANIZATIONS", value: undefined },
            topPi: { text: "ALL PIs", value: undefined }
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

          selectedToReject: [],
          isRejecting: false,
          confirmRejecting: { isShown: false },

          AWARD_STATUS,
          AWARD_WITHDRAWAL_REQUEST_STATUS,

          awardStatusMap: {
            [AWARD_STATUS.PENDING]: { text: 'Not Distributed', color: '#e0e0e0', textColor: '#302a1b' },
            [AWARD_STATUS.APPROVED]: { text: 'Distributed', color: '#02b56a', textColor: '#dbf5ea' },
            [AWARD_STATUS.REJECTED]: { text: 'Canceled', color: '#ff5252', textColor: '#dbf5ea' }
          },

          withdrawalStatusMap: {
            [AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING]: { text: 'Pending Certification', color: '#ffccbc', textColor: '#302a1b' },
            [AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED]: { text: 'Pending Approval', color: '#ffe492', textColor: '#302a1b' },
            [AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED]: { text: 'Pending Money Transfer', color: '#8fc3f7', textColor: '#302a1b' },
            [AWARD_WITHDRAWAL_REQUEST_STATUS.PAID]: { text: 'Paid', color: '#02b56a', textColor: '#dbf5ea' },
            [AWARD_WITHDRAWAL_REQUEST_STATUS.REJECTED]: { text: 'Rejected', color: '#ff5252', textColor: '#dbf5ea' }
          }

        }
      },

      computed: {
        ...mapGetters({
          user: 'auth/user',
          currentOrganization: 'agencyGrantProgramAwardsDashboard/currentOrganization',

          isGrantProgramOfficer: 'auth/isGrantProgramOfficer',
          isGrantFinanceOfficer: 'auth/isGrantFinanceOfficer',
          isUniversityCertifier: 'auth/isUniversityCertifier',
          isTreasuryCertifier: 'auth/isTreasuryCertifier',

          awards: 'agencyGrantProgramAwardsDashboard/awards',
          payments: 'agencyGrantProgramAwardsDashboard/payments',
          tokenInfo: 'agencyGrantProgramAwardsDashboard/tokenInfo',

          themeSettings: 'layout/themeSettings'
        }),

        awardHeaders() {
          return this.isGrantFinanceOfficer ? [
            { text: 'AWARD #', value: 'award.subaward_number' },
            { text: 'STATUS', value: 'award.status' },
            { text: 'PI', value: 'topPi.account.name' }, // display PI info for NSF PO
            { text: 'ORGANIZATION', value: 'organization.name' }, // display organization info for NSF PO
            { text: 'DURATION', value: 'foa.open_date' },
            { text: 'AWARD AMOUNT', value: 'totalAmount' },
            { text: 'ADMIN EXPENSES', value: 'universityOverheadAmount' },
            { text: 'REQUESTED', value: 'pendingAmount' },
            { text: 'WITHDRAWN', value: 'withdrawnAmount' },
            { text: 'AVAILABLE AMOUNT', value: 'remainingAmount'}
          ] : this.isGrantProgramOfficer ? [
            { text: 'AWARD #', value: 'award.subaward_number' },
            { text: 'STATUS', value: 'award.status' },
            { text: 'PI', value: 'topPi.account.name' }, // display PI info for NSF PO
            { text: 'ORGANIZATION', value: 'organization.name' }, // display organization info for NSF PO
            { text: 'DURATION', value: 'foa.open_date' },
            { text: 'AWARD AMOUNT', value: 'totalAmount' },
            { text: 'ADMIN EXPENSES', value: 'universityOverheadAmount' },
            { text: 'REQUESTED', value: 'pendingAmount' },
            { text: 'WITHDRAWN', value: 'withdrawnAmount' },
            { text: 'AVAILABLE AMOUNT', value: 'remainingAmount' }
          ] : [
            { text: 'AWARD #', value: 'award.subaward_number' },
            { text: 'STATUS', value: 'award.status' },
            { text: 'DURATION', value: 'foa.open_date' },
            { text: 'AWARD AMOUNT', value: 'totalAmount' },
            { text: 'ADMIN EXPENSES', value: 'universityOverheadAmount' },
            { text: 'REQUESTED', value: 'pendingAmount' },
            { text: 'WITHDRAWN', value: 'withdrawnAmount' },
            { text: 'AVAILABLE AMOUNT', value: 'remainingAmount' }
          ];
        },

        filteredAwards() {
          const filtered = [];

          if (this.isTreasuryCertifier) {
            // display all top-level awards where the US Treasury is specified as the payer
            filtered.push(...this.awards.filter(a => !a.awardee.isSubawardee && this.isMemberOfReseachGroup(a.foa.treasury_id)));
          } else if (this.isGrantProgramOfficer || this.isGrantFinanceOfficer) {
            // display all top-level awards for Grant Programs creators
            filtered.push(...this.awards.filter(a => !a.awardee.isSubawardee && this.isMemberOfReseachGroup(a.foa.organization_id)));
          } else if (this.isUniversityCertifier) {
            // display all top-level awards for University certifiers
            filtered.push(...this.awards.filter(a => !a.awardee.isSubawardee && this.isMemberOfReseachGroup(a.award.university_id)));
          } else {
            // display all awards allocated for the current PI
            filtered.push(...this.awards.filter(a => this.isMemberOfReseachGroup(a.research.research_group_id)));
          }

          return filtered
            .filter((a) => { return this.awardsFilter.status != undefined && this.awardsFilter.status.value != undefined ? this.awardsFilter.status.value.some(s => s == a.award.status) : true; })
        },

        totalAwardsAmount() {
          return this.filteredAwards
            // .filter(tx => tx.award.status != AWARD_STATUS.PENDING)
            .map(a => a.totalAmount)
			      .reduce((sum, amount) => sum + amount, 0);
        },

        totalPendingAmount() {
          return this.filteredAwards
            .filter(a => a.award.status != AWARD_STATUS.PENDING && a.award.status != AWARD_STATUS.REJECTED)
            .map(a => a.pendingAmount)
			      .reduce((sum, amount) => sum + amount, 0);
        },
        
        totalAdminExpensesAmount() {
          return this.filteredAwards
            .filter(a => a.award.status != AWARD_STATUS.PENDING && a.award.status != AWARD_STATUS.REJECTED)
            .map(a => a.universityOverheadAmount)
			      .reduce((sum, amount) => sum + amount, 0);
        },

        totalWithdrawnAmount() {
          return this.filteredAwards
            .filter(a => a.award.status != AWARD_STATUS.PENDING && a.award.status != AWARD_STATUS.REJECTED)
            .map(a => a.withdrawnAmount)
			      .reduce((sum, amount) => sum + amount, 0);
        },

        totalRemainingAmount() {
          return this.filteredAwards
            .filter(a => a.award.status != AWARD_STATUS.PENDING && a.award.status != AWARD_STATUS.REJECTED)
            .map(a => a.remainingAmount)
			      .reduce((sum, amount) => sum + amount, 0);
        },

        paymentHeaders() {
          return this.isGrantProgramOfficer ? [
            { text: '', sortable: false },  // display checkbox for NSF PO
            { text: 'PAYMENT #', value: 'paymentNumber' },
            { text: 'STATUS', value: 'status' },
            { text: 'AWARD #', value: 'subaward_number' },
            { text: 'PI', value: 'topPi.account.name' }, // display PI info for NSF PO
            { text: 'ORGANIZATION', value: 'organization.name' }, // display organization info for NSF PO
            { text: 'REQUESTER', value: 'requester.account.name' },
            { text: 'TIMESTAMP', value: 'timestamp' },
            { text: 'AMOUNT', value: 'amount', align: 'right' }
          ] : this.isGrantFinanceOfficer ? [
            { text: 'PAYMENT #', value: 'paymentNumber' },
            { text: 'STATUS', value: 'status' },
            { text: 'AWARD #', value: 'subaward_number' },
            { text: 'PI', value: 'topPi.account.name' }, // display PI info for NSF FO
            { text: 'ORGANIZATION', value: 'organization.name' }, // display organization info for NSF FO
            { text: 'REQUESTER', value: 'requester.account.name' },
            { text: 'TIMESTAMP', value: 'timestamp' },
            { text: 'AMOUNT', value: 'amount', align: 'right' }
          ] : this.isUniversityCertifier ? [
            { text: '', sortable: false }, // display checkbox for Organization Certifier
            { text: 'PAYMENT #', value: 'paymentNumber' },
            { text: 'STATUS', value: 'status' },
            { text: 'AWARD #', value: 'subaward_number' },
            { text: 'REQUESTER', value: 'requester.account.name' },
            { text: 'TIMESTAMP', value: 'timestamp' },
            { text: 'AMOUNT', value: 'amount', align: 'right' }
          ] : this.isTreasuryCertifier ? [
            { text: '', sortable: false },  // display checkbox for Treasury
            { text: 'PAYMENT #', value: 'paymentNumber' },
            { text: 'STATUS', value: 'status' },
            { text: 'AWARD #', value: 'subaward_number' },
            { text: 'PI', value: 'topPi.account.name' }, // display PI info for Treasury
            { text: 'ORGANIZATION', value: 'organization.name' }, // display organization info for Treasury
            { text: 'REQUESTER', value: 'requester.account.name' },
            { text: 'TIMESTAMP', value: 'timestamp' },
            { text: 'AMOUNT', value: 'amount', align: 'right' }
          ] : [
            { text: 'PAYMENT #', value: 'paymentNumber' },
            { text: 'STATUS', value: 'status' },
            { text: 'AWARD #', value: 'subaward_number' },
            { text: 'REQUESTER', value: 'requester.account.name' },
            { text: 'TIMESTAMP', value: 'timestamp' },
            { text: 'AMOUNT', value: 'amount', align: 'right' }
          ];
        },

        awardsFilterByStatus() {
          return [ 
            { text: 'ALL STATUSES', value: undefined },
            { text: 'NOT DISTRIBUTED', value: [ AWARD_STATUS.PENDING ] },
            { text: 'DISTRIBUTED', value: [ AWARD_STATUS.APPROVED ] },
            { text: 'CANCELED', value: [ AWARD_STATUS.REJECTED ] }
          ];
        },

        paymentsFilterByStatus() {
          return [ 
            { text: 'ALL STATUSES', value: undefined },
            { text: 'PENDING CERTIFICATION', value: [ AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING ] },
            { text: 'PENDING APPROVAL', value: [ AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED ] },
            { text: 'PENDING MONEY TRANSFER', value: [ AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED ] },
            { text: 'REJECTED', value: [ AWARD_WITHDRAWAL_REQUEST_STATUS.REJECTED ] },
            { text: 'PAID', value: [ AWARD_WITHDRAWAL_REQUEST_STATUS.PAID ] },
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
            let topPi = this.payments[i].topPi;
            if (!uniquePIs.some(o => o.id == topPi.account.name)) {
              let name = this.$options.filters.fullname(topPi);
              uniquePIs.push({ text: name, value: topPi.account.name });
            }
          }
          return uniquePIs;
        },

        filteredPayments() {
          const filtered = [];

          if (this.isTreasuryCertifier) {
            // display all payments where the US Treasury is specified as the payer
            filtered.push(...this.payments.filter(p => this.isMemberOfReseachGroup(p.foa.treasury_id)));
          } else if (this.isGrantProgramOfficer || this.isGrantFinanceOfficer) {
            // display all payments related to Grant Programs creators
            filtered.push(...this.payments.filter(p => this.isMemberOfReseachGroup(p.foa.organization_id)));
          } else if (this.isUniversityCertifier) {
            // display all payments for University certifiers
            filtered.push(...this.payments.filter(p => this.isMemberOfReseachGroup(p.award.university_id)));
          } else {
            // display all payments related to the current PI
            filtered.push(...this.payments.filter(p => p.awardee.isSubawardee 
              ? this.isMemberOfReseachGroup(p.organization.id) || this.isMemberOfAnyReseachGroup(p.parentOrganizations.map(o => o.id))
              : this.isMemberOfReseachGroup(p.organization.id)
            ));
          };
          
          return filtered
            .filter((p) => { return this.paymentsFilter.status != undefined && this.paymentsFilter.status.value != undefined ? this.paymentsFilter.status.value.some(s => s == p.status) : true; })
            .filter((p) => { return this.paymentsFilter.organization != undefined && this.paymentsFilter.organization.value != undefined ? this.paymentsFilter.organization.value == p.organization.id : true; })
            .filter((p) => { return this.paymentsFilter.topPi != undefined && this.paymentsFilter.topPi.value != undefined ? this.paymentsFilter.topPi.value == p.topPi.account.name : true; });
        },

        totalPaymentsAmount() {
          return this.filteredPayments
            .map(tx => tx.amount)
			      .reduce((sum, amount) => sum + amount, 0);
        },

        tokenStat() {
		      return this.tokenInfo ? [
            {
              amount: this.tokenInfo.totalIssuedTokensAmount,
              text: "Issued",
            }, 
            {
              amount: this.tokenInfo.totalCirculatingTokensAmount,
              text: "Circulating",
            }, 
            {
              amount: this.tokenInfo.totalAvailableTokensAmount,
              text: "Available for NSF",
            }, 
            {
              amount: this.tokenInfo.totalAwardedTokensAmount,
              text: "Awarded",
              isGreen: true
            }, 
            {
              amount: this.tokenInfo.totalWithdrawnTokensAmount,
              text: "Withdrawn",
              isGreen: true
            }
          ] : [];
        }
      },

      methods: {

        isMemberOfReseachGroup(researchGroupId) {
          return this.$store.getters['auth/userIsResearchGroupMember'](researchGroupId);
        },

        isMemberOfAnyReseachGroup(researchGroupsIds) {
           let userGroups = this.$store.getters['auth/userGroups'];
           return userGroups.some(rg => researchGroupsIds.some(id => id == rg.id)); 
        },

        certifySelectedPaymentRequests() {
          this.isCertifying = true;

          let promises = this.selectedToCertify.map(
            p => grantsService.certifyAwardWithdrawalRequest(this.user.privKey, {
              paymentNumber: p.paymentNumber,
              awardNumber: p.awardNumber,
              subawardNumber: p.subawardNumber,
              certifier: this.user.username
            })
          );

          Promise.all(promises)
            .then(() => {
              let reload = new Promise((resolve, reject) => {
                this.$store.dispatch('agencyGrantProgramAwardsDashboard/loadAwards', { 
                  organizationId: this.currentOrganization.id, 
                  notify: resolve 
                });
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
              this.selectedPayments = [];
              this.selectedToCertify = [];
              this.isCertifying = false;
            });
        },

        approveSelectedPaymentRequests() {
          this.isApproving = true;

          let promises = this.selectedToApprove.map(
            p => grantsService.approveAwardWithdrawalRequest(this.user.privKey, {
              paymentNumber: p.paymentNumber,
              awardNumber: p.awardNumber,
              subawardNumber: p.subawardNumber,
              approver: this.user.username
            })
          );

          Promise.all(promises)
            .then(() => {
              let reload = new Promise((resolve, reject) => {
                this.$store.dispatch('agencyGrantProgramAwardsDashboard/loadAwards', { 
                  organizationId: this.currentOrganization.id, 
                  notify: resolve 
                });
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
              this.selectedPayments = [];
              this.selectedToApprove = [];
              this.isApproving = false;
            });
        },

        rejectSelectedPaymentRequests() {
          this.isRejecting = true;

          let promises = this.selectedToReject.map(
            p => grantsService.rejectAwardWithdrawalRequest(this.user.privKey, {
              paymentNumber: p.paymentNumber,
              awardNumber: p.awardNumber,
              subawardNumber: p.subawardNumber,
              rejector: this.user.username
            })
          );

          Promise.all(promises)
            .then(() => {
              let reload = new Promise((resolve, reject) => {
                this.$store.dispatch('agencyGrantProgramAwardsDashboard/loadAwards', { 
                  organizationId: this.currentOrganization.id, 
                  notify: resolve 
                });
              });
              return Promise.all([reload]);
            })
            .then(() => {
              this.$store.dispatch('layout/setSuccess', {
                message: `Payment requests have been rejected successfully!`
              });
            })
            .catch((err) => {
              console.log(err);
              this.$store.dispatch('layout/setError', {
                message: `An error occurred while sending the request, please try again later.`
              });
            })
            .finally(() => {
              this.selectedPayments = [];
              this.selectedToReject = [];
              this.isRejecting = false;
            });
        },
                
        paySelectedPaymentRequests() {
          this.isPaying = true;

          let promises = this.selectedToPay.map(
            p => grantsService.payAwardWithdrawalRequest(this.user.privKey, {
              paymentNumber: p.paymentNumber,
              awardNumber: p.awardNumber,
              subawardNumber: p.subawardNumber,
              payer: this.user.username
            })
          );

          Promise.all(promises)
            .then(() => {
              let reloadAwards = new Promise((resolve, reject) => {
                this.$store.dispatch('agencyGrantProgramAwardsDashboard/loadAwards', { 
                  organizationId: this.currentOrganization.id, 
                  notify: resolve 
                });
              });

              let reloadTokenStats = new Promise((resolve, reject) => {
                this.$store.dispatch('agencyGrantProgramAwardsDashboard/loadTokenStats', { 
                  organizationId: this.currentOrganization.id, 
                  notify: resolve 
                });
              });

              return Promise.all([reloadAwards, reloadTokenStats]);
            })
            .then(() => {
              this.$store.dispatch('layout/setSuccess', {
                message: `Payments have been sent successfully!`
              });
            })
            .catch((err) => {
              console.log(err);
              this.$store.dispatch('layout/setError', {
                message: `An error occurred while sending the request, please try again later.`
              });
            })
            .finally(() => {
              this.selectedPayments = [];
              this.selectedToPay = [];
              this.isPaying = false;
            });
        }
      },
      
      watch: {
        'selectedPayments': function (newVal, oldVal) {
          this.selectedToCertify = newVal.filter(p => p.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING);
          this.selectedToApprove = newVal.filter(p => p.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED);
          this.selectedToPay = newVal.filter(p => p.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED);
          this.selectedToReject = newVal.filter(p => p.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING || AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED);
        }
      },

      created() {
        let preference = tabPreferenceMap[this.user.account.name];
        if (preference !== undefined) {
          this.tab = preference;
        }
      }

    };
</script>

<style lang="less" scoped>

  .awards-table {
    width: 100%;
  }

  .payments-table {
    width: 100%;
  }

  .payment-action-btn {
    min-width: 120px;
  }

  .token-stat-card {
    max-width: 250px;
    width: 250px;
  }

  .delimiter {
    // border-right: 2px solid #e0e0e0;
    // border-radius: 0px;
  }

  .total-row {
    background-color: var(--v-secondary-base); 
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .award-status-chip .award-status-chip-label {
    min-width: 120px; 
    text-align: center;
    text-transform: uppercase;
  }

  .payment-status-chip .payment-status-chip-label {
    min-width: 170px; 
    text-align: center;
    text-transform: uppercase;
  }

</style>
