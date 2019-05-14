<template>
  <v-container fluid class="ma-0 pa-0">
    <v-layout row wrap>
     <v-flex xs12 class="c-p-5 c-pt-10">
      <!-- <v-card>
          <v-card-text class="px-0 pa-0">
            <v-breadcrumbs divider="/" :items="[]"></v-breadcrumbs>
          </v-card-text>
        </v-card> -->
        <div> <h1 class="title">{{organization.name}} Dashboard</h1></div>
      </v-flex>
      <v-flex xs12 class="c-p-5">

        <v-tabs slot="extension" v-model="tab" grow color="blue lighten-4">
          <v-tabs-slider color="grey"></v-tabs-slider>
          <v-tab  key="awards">
            Awards
          </v-tab>

          <v-tab key="transactions">
            Transactions
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item key="awards">
            <div>
              <v-card height="100vh">
                <v-card-title class="headline"></v-card-title>
                <v-card-text>
                  <v-layout>
                    <v-flex xs12>
                      <template row>
                        <v-data-table
                          :headers="awardHeaders"
                          :items="awards"
                          >

                          <template slot="items" slot-scope="props">
                            <td>{{ props.item.awardNumber }}</td>
                            <td>{{ moment(new Date(props.item.from)).format("MM/YY") }}</td>
                            <td>{{ moment(new Date(props.item.to)).format("MM/YY") }}</td>
                            <td v-if="isProgramOfficer">{{ props.item.org.name }}</td>
                            <td v-if="isProgramOfficer">{{ props.item.pi | fullname}}</td>
                            <td>$ {{ props.item.totalAmount }}</td>
                            <td>$ {{ props.item.withdrawnAmount }}</td>
                            <td>$ {{ props.item.pendingAmount }}</td>
                            <td>$ {{ props.item.availableAmount }}</td>
                          </template>

                        </v-data-table>
                      </template>

                      <div v-if="isPrincipalInvestigator || isCertifier">
                        <v-btn color="primary" @click="openRequestPaymentDialog()" dark>Request Payment</v-btn>
                        <request-award-payment-dialog :meta="selectedAwardToWithdrawMeta"></request-award-payment-dialog>
                      </div>

                    </v-flex>
                  </v-layout>
                </v-card-text>
                <v-card-actions class="text-xs-center"></v-card-actions>
              </v-card>
            </div>
          </v-tab-item>

          <v-tab-item key="transactions">
            <div>
              <v-card height="100vh">
                <v-card-title class="headline"></v-card-title>
                <v-card-text>
                  <v-layout>
                    <v-flex xs12>
                      <template row>
                        <v-data-table
                          :headers="transactionsHeaders"
                          :items="transactions"
                          v-model="selected">

                          <template slot="items" slot-scope="props">
                            <td>
                              <v-checkbox v-if="
                                (isCertifier && props.item.status == WITHDRAWAL_PENDING) || (props.item.status == WITHDRAWAL_CERTIFIED && isProgramOfficer)"
                                v-model="props.selected"
                                primary
                                hide-details
                              ></v-checkbox>
                            </td>

                            <td>{{ props.item.paymentNumber }}</td>
                            <td>{{ props.item.awardNumber }}</td>
                            <td>$ {{ props.item.amount }}</td>
                            <td v-if="isProgramOfficer">{{ props.item.org.name }}</td>
                            <td v-if="isProgramOfficer">{{ props.item.pi | fullname}}</td>
                            <td>{{ props.item.statusTitle }}</td>
                            <td v-if="!props.item.attachment"></td>
                            <td v-else>
                              <div v-for="file in props.item.attachment.packageFiles">
                                <a target="_blank" class="a" :href="`${fileStorageBaseUrl}/payment-requests/refs/research/${props.item.award.research_id}/payment-attachment/${props.item.award.id}/${props.item.attachment.hash}/${file.hash}`">
									                {{file.filename}}
							                  </a>
                              </div>
                            </td>
                         <!--   <td class="layout px-0">
                              <div> 
                                <v-btn @click="certifyPaymentRequest(props.item.paymentId)" v-if="props.item.status == WITHDRAWAL_PENDING && isCertifier" small color="warning" dark>Certify</v-btn>
                                <v-btn @click="approvePaymentRequest(props.item.paymentId)" v-if="props.item.status == WITHDRAWAL_CERTIFIED && isProgramOfficer" small color="success" dark>Approve</v-btn>
                                <v-btn v-else-if="props.item.status == WITHDRAWAL_APPROVED" disabled small >Approved</v-btn>
                              </div>
                            </td> -->
                          </template>

                        </v-data-table>
                      </template>

                      <div v-if="isCertifier">
                        <v-btn style="min-width: 150px" @click="confirmCertifying.isShown = true" color="warning" :disabled="!selectedToCertify.length || isCertifying" :loading="isCertifying">
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

                      <div v-if="isProgramOfficer">
                        <v-btn style="min-width: 150px" @click="confirmApproval.isShown = true" color="success" :disabled="!selectedToApprove.length || isApproving" :loading="isApproving">
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
                  </v-layout>
                </v-card-text>
                <v-card-actions class="text-xs-center"></v-card-actions>
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
    import { withdrawalStatus, WITHDRAWAL_PENDING, WITHDRAWAL_CERTIFIED, WITHDRAWAL_APPROVED, WITHDRAWAL_REJECTED } from './../../services/FundingService'
    import deipRpc from '@deip/deip-rpc-client';

    export default {
      name: "OrganizationDashboard",

      data() {
        return {
          selected: [],

          selectedToCertify: [],
          isCertifying: false,
          confirmCertifying: { isShown: false },

          selectedToApprove: [],
          isApproving: false,
          confirmApproval: { isShown: false },

          tab: null,
          selectedAwardToWithdrawMeta: { isOpen: false, contract: null },
          fileStorageBaseUrl: window.env.DEIP_SERVER_URL,
          ...withdrawalStatus
        }
      },

      computed: {
        ...mapGetters({
          awards: 'org_dashboard/currentOrganizationAwards',
          transactions: 'org_dashboard/currentOrganizationTransactions',
          organization: 'org_dashboard/organization',
          user: 'auth/user',
          isPrincipalInvestigator: 'auth/isPrincipalInvestigator',
          isCertifier: 'auth/isCertifier',
          isProgramOfficer: 'auth/isProgramOfficer',
          isFinancialOfficer: 'auth/isFinancialOfficer'
        }),

        awardHeaders() {
          return this.isProgramOfficer ? [
            { text: 'Award ID', align: 'left', sortable: false, value: 'awardNumber' },
            { text: 'From', value: 'from' },
            { text: 'To', value: 'to' },
            { text: 'Organization', value: 'org' }, // display organization info for NSF stuff
            { text: 'PI', value: 'org' }, // display PI info for NSF stuff
            { text: 'Total amount', value: 'totalAmount' },
            { text: 'Withdrawn amount', value: 'withdrawnAmount' },
            { text: 'Pending amount', value: 'pendingAmount' },
            { text: 'Avalable amount', value: 'availableAmount' }
          ] : [
            { text: 'Award ID', align: 'left', sortable: false, value: 'awardNumber' },
            { text: 'From', value: 'from' },
            { text: 'To', value: 'to' },
            { text: 'Total amount', value: 'totalAmount' },
            { text: 'Withdrawn amount', value: 'withdrawnAmount' },
            { text: 'Pending amount', value: 'pendingAmount' },
            { text: 'Avalable amount', value: 'availableAmount' }
          ];
        },
        
        transactionsHeaders() {
          return this.isProgramOfficer ? [
            { text: '', sortable: false  },  // display checkbox for NSF approval
            { text: 'Payment ID', value: 'paymentNumber' },
            { text: 'Award ID', value: 'awardNumber' },
            { text: 'Amount', value: 'amount' },
            { text: 'Organization', value: 'org' }, // display organization info for NSF stuff
            { text: 'PI', value: 'org' }, // display PI info for NSF stuff
            { text: 'Status', value: 'status' },
            { text: 'Attachments', value: 'attachment' },
          ] : this.isCertifier ? [
            { text: '', sortable: false  }, // display checkbox for Organization Certifier
            { text: 'Payment ID', value: 'paymentNumber' },
            { text: 'Award ID', value: 'awardNumber' },
            { text: 'Amount', value: 'amount' },
            { text: 'Status', value: 'status' },
            { text: 'Attachments', value: 'attachment' },
          ] : [
            { text: 'Payment ID', value: 'paymentNumber' },
            { text: 'Award ID', value: 'awardNumber' },
            { text: 'Amount', value: 'amount' },
            { text: 'Status', value: 'status' },
            { text: 'Attachments', value: 'attachment' },
          ];
        }
      },

      methods: {
        openRequestPaymentDialog() {
          // this.selectedAwardToWithdrawMeta.contract = contract;
          this.selectedAwardToWithdrawMeta.isOpen = true;
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
                this.$store.dispatch('org_dashboard/loadFundingContracts', { notify: resolve });
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
                this.$store.dispatch('org_dashboard/loadFundingContracts', { notify: resolve });
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
        'selected': function (newVal, oldVal) {
          this.selectedToCertify = newVal.filter(p => p.status == WITHDRAWAL_PENDING);
          this.selectedToApprove = newVal.filter(p => p.status == WITHDRAWAL_CERTIFIED);
        }
      }
    };
</script>

<style lang="less" scoped>

</style>
