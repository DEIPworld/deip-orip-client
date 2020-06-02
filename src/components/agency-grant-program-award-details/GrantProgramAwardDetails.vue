<template>
  <v-container fluid class="ma-0 pa-0 full-width full-height">
    <v-card class="elevation-0">
      <v-row>
        <v-col cols="9" class="pa-6">
          <h1 class="display-1">
            Award # {{ awardee.subaward_number }}
            <span v-if="awardee.isSubawardee" class="subtitle-1 grey--text">
              ( subaward of
              <span v-if="isParentPrincipalInvestigator" class="body-2"># {{ awardee.parentAwardee.subaward_number }}</span>
              <router-link
                v-else
                class="a body-2"
                :to="{
                  name: 'GrantProgramAwardDetails',
                  params: {
                    award_number: awardee.parentAwardee.award_number,
                    subaward_number: awardee.parentAwardee.subaward_number
                  }
                }"
              >
                # {{ awardee.parentAwardee.subaward_number }}
              </router-link> )
            </span>
            <v-chip class="mx-6 award-status-chip" :color="awardStatusMap[award.status].color" :text-color="awardStatusMap[award.status].textColor">
              <div class="award-status-chip-label">
                {{ awardStatusMap[award.status].text }}
              </div>
            </v-chip>
          </h1>
        </v-col>

        <v-col cols="3" class="pa-6">
          <div v-if="isAwardPending && isGrantProgramOfficer && !awardee.isSubawardee" class="display-flex justify-end">
            <div class="mr-4">
              <v-btn
                class="award-action-btn"
                color="success"
                :disabled="!isAwardAvailableToApprove || isAwardApproving || isAwardRejecting"
                :loading="isAwardApproving"
                @click="confirmAwardApproval.isShown = true"
              >
                Distribute
              </v-btn>
              <confirm-action-dialog
                :meta="confirmAwardApproval"
                :title="``"
                :text="`Are you sure you want to distribute the award?`"
                @confirmed="approveAward(); confirmAwardApproval.isShown = false"
                @canceled="confirmAwardApproval.isShown = false"
              />
            </div>

            <div>
              <v-btn
                class="award-action-btn"
                color="error"
                :disabled="isAwardCanceled || isAwardRejecting || isAwardApproving"
                :loading="isAwardRejecting"
                @click="confirmAwardRejecting.isShown = true"
              >
                Cancel
              </v-btn>
              <confirm-action-dialog
                :meta="confirmAwardRejecting"
                :title="``"
                :text="`Are you sure you want to cancel the award?`"
                @confirmed="rejectAward(); confirmAwardRejecting.isShown = false"
                @canceled="confirmAwardRejecting.isShown = false"
              />
            </div>
          </div>

          <div v-if="isAwardApproved && isPrincipalInvestigator">
            <v-btn
              block
              color="primary"
              :disabled="isAwardPending"
              @click="awardWithdrawMeta.isOpen = true;"
            >
              Request Payment
            </v-btn>
            <request-award-payment-dialog :meta="awardWithdrawMeta" />
          </div>
        </v-col>

        <v-col cols="6" class="pa-6 grey-background">
          <v-row>
            <v-col cols="3" class="pa-1">
              <span class="body-2 grey--text">PI</span>
            </v-col>
            <v-col cols="9" class="pa-1">
              <router-link class="a body-2" :to="{ name: 'UserDetails', params: { account_name: awardee.pi.account.name } }">
                {{ awardee.pi | fullname }}
              </router-link>
            </v-col>

            <v-col cols="3" class="pa-1">
              <span class="body-2 grey--text">Organization</span>
            </v-col>
            <v-col cols="9" class="pa-1">
              <router-link
                class="a body-2"
                :to="{ name: 'ResearchGroupDetails', params: {
                  research_group_permlink: encodeURIComponent(awardee.organization.permlink)
                }}"
              >
                {{ awardee.organization.name }}
              </router-link>
            </v-col>

            <v-col cols="3" class="pa-1">
              <span class="body-2 grey--text">Award title</span>
            </v-col>
            <v-col cols="9" class="pa-1">
              <router-link
                class="a body-2"
                :to="{
                  name: 'GrantProgramDetails',
                  params: {
                    agency: foa.organization.permlink,
                    foa: foa.funding_opportunity_number
                  }
                }"
              >
                {{ foa.additional_info.funding_opportunity_title }}
              </router-link>
            </v-col>

            <v-col cols="3" class="pa-1">
              <span class="body-2 grey--text">Agency</span>
            </v-col>
            <v-col cols="9" class="pa-1">
              <router-link
                class="a body-2"
                :to="{ name: 'ResearchGroupDetails', params: {
                  research_group_permlink: encodeURIComponent(foa.organization.permlink),
                }}"
              >
                {{ foa.organization.name }}
              </router-link>
            </v-col>

            <v-col cols="3" class="pa-1">
              <span class="body-2 grey--text">Duration</span>
            </v-col>
            <v-col cols="9" class="pa-1">
              <span class="body-2">{{ moment(new Date(awardee.from)).format("MM/YY") }} - {{ moment(new Date(awardee.to)).format("MM/YY") }}</span>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="1" class="grey-background py-4 text-center">
          <v-divider vertical />
        </v-col>

        <v-col v-if="isAwardPending || isAwardCanceled" cols="5" class="pa-6 grey-background">
          <v-row>
            <v-col cols="5" class="pa-1">
              <span class="body-2 grey--text">Award amount</span>
            </v-col>
            <v-col cols="7" class="pa-1">
              <span class="bold">{{ awardee.totalAmount | currency }}</span>
            </v-col>
          </v-row>
        </v-col>

        <v-col v-else cols="5" class="pa-6 grey-background">
          <v-row>
            <v-col cols="5" class="pa-1">
              <span class="body-2 grey--text">Award amount</span>
            </v-col>
            <v-col cols="7" class="pa-1">
              <span class="bold">{{ awardee.totalAmount | currency }}</span>
            </v-col>

            <v-col cols="8" class="pa-1">
              <v-divider />
            </v-col><v-col cols="4" />

            <v-col cols="5" class="pa-1">
              <span class="body-2 grey--text">Administrative expenses</span>
            </v-col>
            <v-col cols="7" class="pa-1">
              <span class="body-2">{{ awardee.universityOverheadAmount | currency }}</span>
            </v-col>

            <v-col cols="5" class="pa-1">
              <span class="body-2 grey--text">Withdrawn by PI</span>
            </v-col>
            <v-col cols="7" class="pa-1">
              <span class="body-2">{{ awardee.withdrawnPiAmount | currency }}</span><span class="body-2 grey--text"> of {{ awardee.piAmount | currency }}</span>
            </v-col>

            <v-col cols="5" class="pa-1">
              <span class="body-2 grey--text">Withdrawn by Subawardees</span>
            </v-col>
            <v-col cols="7" class="pa-1">
              <span class="body-2">{{ awardee.withdrawnSubawardeesAmount | currency }}</span><span class="body-2 grey--text"> of {{ awardee.subawardeesAmount | currency }}</span>
            </v-col>

            <v-col cols="8" class="pa-1">
              <v-divider />
            </v-col><v-col cols="4" />

            <v-col cols="5" class="pa-1">
              <span class="body-2 grey--text">Available amount</span>
            </v-col>
            <v-col cols="7" class="pa-1">
              <span class="bold">{{ awardee.remainingAmount | currency }}</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="subawardees.length" class="px-6 py-4">
        <v-col cols="12" class="py-4 headline">
          Subawards
        </v-col>
        <v-col cols="12">
          <v-data-table
            class="subawards-table"
            :headers="subawardsHeaders"
            :items="subawardees"
            hide-default-footer
          >
            <template v-slot:item="{item}">
              <tr>
                <td>
                  <router-link class="a body-2" :to="{ name: 'GrantProgramAwardDetails', params: { award_number: item.subawardee.award_number, subaward_number: item.subawardee.subaward_number } }">
                    {{ item.subawardee.subaward_number }}
                  </router-link>
                </td>
                <td>
                  <router-link class="a body-2" :to="{ name: 'UserDetails', params: { account_name: item.reciever.account.name } }">
                    {{ item.reciever | fullname }}
                  </router-link>
                </td>
                <td>
                  <router-link class="a body-2" :to="{ name: 'ResearchGroupDetails', params: { research_group_permlink: item.organization.permlink } }">
                    {{ item.organization.name }}
                  </router-link>
                </td>
                <td><span class="body-1">{{ item.totalSubawardeeAmount | currency }}</span></td>
                <td>
                  <span class="body-1">
                    <span v-if="isAwardPending">N/A</span>
                    <span v-else>{{ item.totalSubawardeePendingAmount | currency }}</span>
                  </span>
                </td>
                <td>
                  <span class="body-1">
                    <span v-if="isAwardPending">N/A</span>
                    <span v-else>{{ item.totalSubawardeeWithdrawnAmount | currency }}</span>
                  </span>
                </td>
                <td>
                  <span class="body-1">
                    <span v-if="isAwardPending">N/A</span>
                    <span v-else>{{ item.totalSubawardeeRemainingAmount | currency }}</span>
                  </span>
                </td>
              </tr>
            </template>

            <template v-slot:body.append>
              <tr>
                <td v-for="(header, i) in subawardsHeaders" :key="`${i}-subaward`" class="body-2 bold total-row">
                  <span v-if="i == 0">Total</span>
                  <span v-if="header.value == 'totalSubawardeeAmount'">{{ totalSubawardsAmount | currency }}</span>
                  <span v-else-if="header.value == 'totalSubawardeePendingAmount'">{{ totalSubawardsPendingRequestedAmount | currency }}</span>
                  <span v-else-if="header.value == 'totalSubawardeeWithdrawnAmount'">{{ totalSubawardsWithdrawnAmount | currency }}</span>
                  <span v-else-if="header.value == 'totalSubawardeeRemainingAmount'">{{ totalSubawardsRemainingAmount | currency }}</span>
                  <span v-else />
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-row v-if="!isAwardPending" class="px-6 py-4">
        <v-col cols="12" class="py-4 headline">
          Payments
        </v-col>
        <v-col cols="12">
          <v-row class="py-6">
            <v-col cols="3">
              <v-row class="pr-6">
                <v-select
                  v-model="paymentsFilter.status"
                  :items="paymentsFilterByStatus"
                  label="STATUS"
                  return-object
                  solo
                  dense
                />
              </v-row>
            </v-col>

            <v-col cols="3">
              <v-row class="pr-6">
                <v-select
                  v-model="paymentsFilter.requester"
                  :items="paymentsFilterByRequester"
                  label="REQUESTER"
                  return-object
                  solo
                  dense
                />
              </v-row>
            </v-col>

            <v-spacer />

            <v-col v-if="isUniversityCertifier" cols="2">
              <v-row justify="end">
                <div>
                  <v-btn
                    class="payment-action-btn"
                    color="warning"
                    :disabled="!selectedToCertify.length || isCertifying || isRejecting"
                    :loading="isCertifying"
                    @click="confirmCertifying.isShown = true"
                  >
                    {{ selectedToCertify.length ? `Certify (${selectedToCertify.length})` : `Certify` }}
                  </v-btn>
                  <confirm-action-dialog
                    :meta="confirmCertifying"
                    :title="``"
                    :text="`Are you sure you want to certify selected payment requests?`"
                    @confirmed="certifySelectedPaymentRequests(); confirmCertifying.isShown = false"
                    @canceled="confirmCertifying.isShown = false"
                  />
                </div>
                <div>
                  <v-btn
                    class="payment-action-btn"
                    color="error"
                    :disabled="!selectedToReject.length || isRejecting || isCertifying"
                    :loading="isRejecting"
                    @click="confirmRejecting.isShown = true"
                  >
                    {{ selectedToReject.length ? `Reject (${selectedToReject.length})` : `Reject` }}
                  </v-btn>
                  <confirm-action-dialog
                    :meta="confirmRejecting"
                    :title="``"
                    :text="`Are you sure you want to reject selected payment requests?`"
                    @confirmed="rejectSelectedPaymentRequests(); confirmRejecting.isShown = false"
                    @canceled="confirmRejecting.isShown = false"
                  />
                </div>
              </v-row>
            </v-col>

            <v-col v-if="isGrantProgramOfficer" cols="2">
              <v-row justify="end">
                <div>
                  <v-btn
                    class="payment-action-btn"
                    color="success"
                    :disabled="!selectedToApprove.length || isApproving || isRejecting"
                    :loading="isApproving"
                    @click="confirmApproval.isShown = true"
                  >
                    {{ selectedToApprove.length ? `Approve (${selectedToApprove.length})` : `Approve` }}
                  </v-btn>
                  <confirm-action-dialog
                    :meta="confirmApproval"
                    :title="``"
                    :text="`Are you sure you want to approve selected payment requests?`"
                    @confirmed="approveSelectedPaymentRequests(); confirmApproval.isShown = false"
                    @canceled="confirmApproval.isShown = false"
                  />
                </div>
                <div>
                  <v-btn
                    class="payment-action-btn"
                    color="error"
                    :disabled="!selectedToReject.length || isRejecting || isApproving"
                    :loading="isRejecting"
                    @click="confirmRejecting.isShown = true"
                  >
                    {{ selectedToReject.length ? `Reject (${selectedToReject.length})` : `Reject` }}
                  </v-btn>
                  <confirm-action-dialog
                    :meta="confirmRejecting"
                    :title="``"
                    :text="`Are you sure you want to reject selected payment requests?`"
                    @confirmed="rejectSelectedPaymentRequests(); confirmRejecting.isShown = false"
                    @canceled="confirmRejecting.isShown = false"
                  />
                </div>
              </v-row>
            </v-col>

            <v-col v-if="isTreasuryCertifier" cols="2">
              <v-row justify="end">
                <div>
                  <v-btn
                    class="payment-action-btn"
                    color="success"
                    :disabled="!selectedToPay.length || isPaying"
                    :loading="isPaying"
                    @click="confirmPayment.isShown = true"
                  >
                    {{ selectedToPay.length ? `Confirm Payment (${selectedToPay.length})` : `Confirm Payment` }}
                  </v-btn>
                  <confirm-action-dialog
                    :meta="confirmPayment"
                    :title="``"
                    :text="`Are you sure you want to send payment to selected payment requests?`"
                    @confirmed="paySelectedPaymentRequests(); confirmPayment.isShown = false"
                    @canceled="confirmPayment.isShown = false"
                  />
                </div>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-data-table
            v-model="selectedPayments"
            class="awards-table"
            :headers="paymentHeaders"
            :items="filteredPayments"
            :no-data-text="isAwardPending ? `Award is not distributed yet` : `No payments found`"
            hide-default-footer
          >
            <template v-slot:item="{item}">
              <tr>
                <td v-if="isUniversityCertifier || isGrantProgramOfficer || isTreasuryCertifier">
                  <v-checkbox
                    v-if="
                      (item.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING && isUniversityCertifier) ||
                        (item.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED && isGrantProgramOfficer) ||
                        (item.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED && isTreasuryCertifier)"
                    v-model="selected"
                    primary
                    hide-details
                  />
                </td>
                <td>
                  <router-link class="a body-2" :to="{ name: 'GrantProgramAwardWithdrawalDetails', params: { award_number: item.awardee.award_number, subaward_number: item.awardee.subaward_number, payment_number: item.paymentNumber } }">
                    {{ item.paymentNumber }}
                  </router-link>
                </td>
                <td>
                  <v-chip class="payment-status-chip" :color="withdrawalStatusMap[item.status].color" :text-color="withdrawalStatusMap[item.status].textColor">
                    <div class="payment-status-chip-label">
                      {{ withdrawalStatusMap[item.status].text }}
                    </div>
                  </v-chip>
                </td>
                <td>
                  <router-link class="a body-1" :to="{ name: 'UserDetails', params: { account_name: item.requester.account.name } }">
                    {{ item.requester | fullname }}
                  </router-link>
                  <div v-if="item.awardee.isNextSubawardee" class="grey--text caption">
                    (subawardee)
                  </div>
                </td>
                <td><span class="body-1 grey--text">{{ moment(item.timestamp).format('MM/DD/YYYY HH:mm:ss') }}</span></td>
                <td>
                  <div class="body-2 text-align-right">
                    {{ item.amount | currency }}
                  </div>
                </td>
              </tr>
            </template>

            <template v-slot:body.append>
              <tr>
                <td v-for="(header, i) in paymentHeaders" :key="`${i}-payment-header`" class="body-2 bold total-row">
                  <span v-if="i == 0">Total</span>
                  <div v-if="header.value == 'amount'" class="body-2 bold text-align-right">
                    {{ totalPaymentsAmount | currency }}
                  </div>
                  <span v-else />
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>

  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import { AWARD_STATUS, AWARD_WITHDRAWAL_REQUEST_STATUS } from '@/variables';
  import { GrantsService } from '@deip/grants-service';

  const grantsService = GrantsService.getInstance();

  export default {
    name: 'GrantProgramAwardDetails',

    data() {
      return {

        paymentsFilter: {
          status: { text: 'ALL STATUSES', value: undefined },
          requester: { text: 'ALL REQUESTERS', value: undefined }
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

        isAwardApproving: false,
        confirmAwardApproval: { isShown: false },

        isAwardRejecting: false,
        confirmAwardRejecting: { isShown: false },

        awardWithdrawMeta: { isOpen: false, award: null },

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
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',

        isUniversityCertifier: 'auth/isUniversityCertifier',
        isGrantProgramOfficer: 'auth/isGrantProgramOfficer',
        isGrantFinanceOfficer: 'auth/isGrantFinanceOfficer',
        isTreasuryCertifier: 'auth/isTreasuryCertifier',

        award: 'agencyGrantProgramAwardDetails/award',
        awardee: 'agencyGrantProgramAwardDetails/awardee',
        subawardees: 'agencyGrantProgramAwardDetails/subawardees',
        payments: 'agencyGrantProgramAwardDetails/payments',
        foa: 'agencyGrantProgramAwardDetails/foa',

        isAwardPending: 'agencyGrantProgramAwardDetails/isAwardPending',
        isAwardApproved: 'agencyGrantProgramAwardDetails/isAwardApproved',
        isAwardAvailableToApprove: 'agencyGrantProgramAwardDetails/isAwardAvailableToApprove',
        isAwardCanceled: 'agencyGrantProgramAwardDetails/isAwardCanceled'
      }),

      isParentPrincipalInvestigator() {
        return this.awardee.pi.account.name == this.user.account.name;
      },

      isPrincipalInvestigator() {
        return this.awardee.awardee == this.user.account.name;
      },

      subawardsHeaders() {
        return [
          { text: 'SUBAWARD #', value: 'subawardId' },
          { text: 'SUBAWARDEE', value: 'subawardee' },
          { text: 'ORGANIZATION', value: 'organization.name' },
          { text: 'SUBAWARD AMOUNT', value: 'totalSubawardeeAmount' },
          { text: 'REQUESTED', value: 'totalSubawardeePendingAmount' },
          { text: 'WITHDRAWN', value: 'totalSubawardeeWithdrawnAmount' },
          { text: 'AVAILABLE AMOUNT', value: 'totalSubawardeeRemainingAmount' }
        ];
      },

      paymentHeaders() {
        return this.isGrantProgramOfficer ? [
          { text: '', sortable: false }, // display checkbox for NSF PO
          { text: 'PAYMENT #', value: 'paymentId' },
          { text: 'STATUS', value: 'status' },
          { text: 'REQUESTER', value: 'requester.account.name' },
          { text: 'TIMESTAMP', value: 'timestamp' },
          { text: 'AMOUNT', value: 'amount', align: 'right' }
        ] : this.isGrantFinanceOfficer ? [
          { text: 'PAYMENT #', value: 'paymentId' },
          { text: 'STATUS', value: 'status' },
          { text: 'REQUESTER', value: 'requester.account.name' },
          { text: 'TIMESTAMP', value: 'timestamp' },
          { text: 'AMOUNT', value: 'amount', align: 'right' }
        ] : this.isUniversityCertifier ? [
          { text: '', sortable: false }, // display checkbox for Organization Certifier
          { text: 'PAYMENT #', value: 'paymentId' },
          { text: 'STATUS', value: 'status' },
          { text: 'REQUESTER', value: 'requester.account.name' },
          { text: 'TIMESTAMP', value: 'timestamp' },
          { text: 'AMOUNT', value: 'amount', align: 'right' }
        ] : this.isTreasuryCertifier ? [
          { text: '', sortable: false }, // display checkbox for Treasury
          { text: 'PAYMENT #', value: 'paymentId' },
          { text: 'STATUS', value: 'status' },
          { text: 'REQUESTER', value: 'requester.account.name' },
          { text: 'TIMESTAMP', value: 'timestamp' },
          { text: 'AMOUNT', value: 'amount', align: 'right' }
        ] : [
          { text: 'PAYMENT #', value: 'paymentId' },
          { text: 'STATUS', value: 'status' },
          { text: 'REQUESTER', value: 'requester.account.name' },
          { text: 'TIMESTAMP', value: 'timestamp' },
          { text: 'AMOUNT', value: 'amount', align: 'right' }
        ];
      },

      totalSubawardsAmount() {
        return this.subawardees
          .map((tx) => tx.totalSubawardeeAmount)
          .reduce((sum, amount) => sum + amount, 0);
      },

      totalSubawardsWithdrawnAmount() {
        return this.subawardees
          .filter((tx) => tx.subawardee.status != AWARD_STATUS.PENDING)
          .map((tx) => tx.totalSubawardeeWithdrawnAmount)
          .reduce((sum, amount) => sum + amount, 0);
      },

      totalSubawardsPendingRequestedAmount() {
        return this.subawardees
          .filter((tx) => tx.subawardee.status != AWARD_STATUS.PENDING)
          .map((tx) => tx.totalSubawardeePendingAmount)
          .reduce((sum, amount) => sum + amount, 0);
      },

      totalSubawardsRemainingAmount() {
        return this.subawardees
          .filter((tx) => tx.subawardee.status != AWARD_STATUS.PENDING)
          .map((tx) => tx.totalSubawardeeRemainingAmount)
          .reduce((sum, amount) => sum + amount, 0);
      },

      paymentsFilterByStatus() {
        return [
          { text: 'ALL STATUSES', value: undefined },
          { text: 'PENDING CERTIFICATION', value: [AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING] },
          { text: 'PENDING APPROVAL', value: [AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED] },
          { text: 'PENDING MONEY TRANSFER', value: [AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED] },
          { text: 'REJECTED', value: [AWARD_WITHDRAWAL_REQUEST_STATUS.REJECTED] },
          { text: 'PAID', value: [AWARD_WITHDRAWAL_REQUEST_STATUS.PAID] }
        ];
      },

      paymentsFilterByRequester() {
        const uniqueRequesters = [{ text: 'ALL REQUESTERS', value: undefined }];
        for (let i = 0; i < this.payments.length; i++) {
          const { requester } = this.payments[i];
          if (!uniqueRequesters.some((o) => o.id == requester.account.name)) {
            const name = this.$options.filters.fullname(requester);
            uniqueRequesters.push({ text: name, value: requester.account.name });
          }
        }
        return uniqueRequesters;
      },

      filteredPayments() {
        return this.payments
          .filter((p) => (this.paymentsFilter.status != undefined && this.paymentsFilter.status.value != undefined ? this.paymentsFilter.status.value.some((s) => s == p.status) : true))
          .filter((p) => (this.paymentsFilter.requester != undefined && this.paymentsFilter.requester.value != undefined ? this.paymentsFilter.requester.value == p.requester.account.name : true));
      },

      totalPaymentsAmount() {
        return this.filteredPayments
          .map((tx) => tx.amount)
          .reduce((sum, amount) => sum + amount, 0);
      }
    },

    watch: {
      selectedPayments(newVal, oldVal) {
        this.selectedToCertify = newVal.filter((p) => p.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING);
        this.selectedToApprove = newVal.filter((p) => p.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED);
        this.selectedToPay = newVal.filter((p) => p.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED);
        this.selectedToReject = newVal.filter((p) => p.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING || AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED);
      },
      '$route.params': {
        handler(params) {
          if (this.awardee.award_number != params.award_number
            || this.awardee.subaward_number != params.subaward_number) {
            this.$router.go();
          }
        },
        immediate: true
      }
    },

    created() {},

    methods: {

      isReseachGroupMember(researchGroupId) {
        return this.$store.getters['auth/userIsResearchGroupMember'](researchGroupId);
      },

      certifySelectedPaymentRequests() {
        this.isCertifying = true;

        const promises = this.selectedToCertify.map(
          (p) => grantsService.certifyAwardWithdrawalRequest(this.user.privKey, {
            paymentNumber: p.paymentNumber,
            awardNumber: p.awardNumber,
            subawardNumber: p.subawardNumber,
            certifier: this.user.username
          })
        );

        Promise.all(promises)
          .then(() => {
            const reload = new Promise((resolve, reject) => {
              this.$store.dispatch('agencyGrantProgramAwardDetails/loadAwardDetails', {
                notify: resolve,
                awardNumber: this.awardee.award_number,
                subawardNumber: this.awardee.subaward_number
              });
            });
            return Promise.all([reload]);
          })
          .then(() => {
            this.$notifier.showSuccess('Payment requests have been certified successfully!');
          })
          .catch((err) => {
            console.log(err);
            this.$notifier.showError()
          })
          .finally(() => {
            this.selectedPayments = [];
            this.selectedToCertify = [];
            this.isCertifying = false;
          });
      },

      approveSelectedPaymentRequests() {
        this.isApproving = true;

        const promises = this.selectedToApprove.map(
          (p) => grantsService.approveAwardWithdrawalRequest(this.user.privKey, {
            paymentNumber: p.paymentNumber,
            awardNumber: p.awardNumber,
            subawardNumber: p.subawardNumber,
            approver: this.user.username
          })
        );

        Promise.all(promises)
          .then(() => {
            const reload = new Promise((resolve, reject) => {
              this.$store.dispatch('agencyGrantProgramAwardDetails/loadAwardDetails', {
                notify: resolve,
                awardNumber: this.awardee.award_number,
                subawardNumber: this.awardee.subaward_number
              });
            });
            return Promise.all([reload]);
          })
          .then(() => {
            this.$notifier.showSuccess('Payment requests have been approved successfully!');
          })
          .catch((err) => {
            console.log(err);
            this.$notifier.showError()
          })
          .finally(() => {
            this.selectedPayments = [];
            this.selectedToApprove = [];
            this.isApproving = false;
          });
      },

      rejectSelectedPaymentRequests() {
        this.isRejecting = true;

        const promises = this.selectedToReject.map(
          (p) => grantsService.rejectAwardWithdrawalRequest(this.user.privKey, {
            paymentNumber: p.paymentNumber,
            awardNumber: p.awardNumber,
            subawardNumber: p.subawardNumber,
            rejector: this.user.username
          })
        );

        Promise.all(promises)
          .then(() => {
            const reload = new Promise((resolve, reject) => {
              this.$store.dispatch('agencyGrantProgramAwardDetails/loadAwardDetails', {
                notify: resolve,
                awardNumber: this.awardee.award_number,
                subawardNumber: this.awardee.subaward_number
              });
            });
            return Promise.all([reload]);
          })
          .then(() => {
            this.$notifier.showSuccess('Payment requests have been rejected successfully!');
          })
          .catch((err) => {
            console.log(err);
            this.$notifier.showError()
          })
          .finally(() => {
            this.selectedPayments = [];
            this.selectedToReject = [];
            this.isRejecting = false;
          });
      },

      paySelectedPaymentRequests() {
        this.isPaying = true;

        const promises = this.selectedToPay.map(
          (p) => grantsService.payAwardWithdrawalRequest(this.user.privKey, {
            paymentNumber: p.paymentNumber,
            awardNumber: p.awardNumber,
            subawardNumber: p.subawardNumber,
            payer: this.user.username
          })
        );

        Promise.all(promises)
          .then(() => {
            const reload = new Promise((resolve, reject) => {
              this.$store.dispatch('agencyGrantProgramAwardDetails/loadAwardDetails', {
                notify: resolve,
                awardNumber: this.awardee.award_number,
                subawardNumber: this.awardee.subaward_number
              });
            });
            return Promise.all([reload]);
          })
          .then(() => {
            this.$notifier.showSuccess('Money transfer has been sent successfully!');
          })
          .catch((err) => {
            console.log(err);
            this.$notifier.showError()
          })
          .finally(() => {
            this.selectedPayments = [];
            this.selectedToPay = [];
            this.isPaying = false;
          });
      },

      approveAward() {
        this.isAwardApproving = true;
        grantsService.approveFundingOpportunityAward(this.user.privKey, {
          awardNumber: this.awardee.award_number,
          approver: this.user.username
        })
          .then(() => {
            const reload = new Promise((resolve, reject) => {
              this.$store.dispatch('agencyGrantProgramAwardDetails/loadAwardDetails', {
                notify: resolve,
                awardNumber: this.awardee.award_number,
                subawardNumber: this.awardee.subaward_number
              });
            });
            return Promise.all([reload]);
          })
          .then(() => {
            this.$notifier.showSuccess('Grant Tokens have been distributed successfully!');
          })
          .catch((err) => {
            console.log(err);
            this.$notifier.showError()
          })
          .finally(() => {
            this.isAwardApproving = false;
          });
      },

      rejectAward() {
        this.isAwardRejecting = true;
        grantsService.rejectFundingOpportunityAward(this.user.privKey, {
          awardNumber: this.awardee.award_number,
          rejector: this.user.username
        })
          .then(() => {
            const reload = new Promise((resolve, reject) => {
              this.$store.dispatch('agencyGrantProgramAwardDetails/loadAwardDetails', {
                notify: resolve,
                awardNumber: this.awardee.award_number,
                subawardNumber: this.awardee.subaward_number
              });
            });
            return Promise.all([reload]);
          })
          .then(() => {
            this.$notifier.showSuccess('The award has been rejected successfully!');
          })
          .catch((err) => {
            console.log(err);
            this.$notifier.showError()
          })
          .finally(() => {
            this.isAwardRejecting = false;
          });
      }
    }
  };
</script>

<style lang="less" scoped>

  .award-action-btn {
    min-width: 120px;
  }

  .payment-action-btn {
    min-width: 120px;
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

  .award-status-chip .award-status-chip-label {
    min-width: 120px;
    text-align: center;
    text-transform: uppercase;
  }


</style>
