<template>
  <v-container fluid class="ma-0 pa-0">
    <v-layout row wrap>
     <v-flex xs12>
      <!-- <v-card>
          <v-card-text class="px-0 pa-0">
            <v-breadcrumbs divider="/" :items="[]"></v-breadcrumbs>
          </v-card-text>
        </v-card> -->
        <div>{{organization.name}}</div>
      </v-flex>
      <v-flex xs12>

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
                            <td>$ {{ props.item.totalAmount }}</td>
                            <td>$ {{ props.item.withdrawnAmount }}</td>
                            <td>$ {{ props.item.pendingAmount }}</td>
                            <td>$ {{ props.item.availableAmount }}</td>
                          </template>

                        </v-data-table>
                      </template>

                      <div class="">
                        <v-btn color="primary" @click="openRequestPaymentDialog()" dark>Request Payment</v-btn>
                        <request-award-payment-dialog 
                          :meta="selectedAwardToWithdrawMeta">
                        </request-award-payment-dialog>
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
                          >

                          <template slot="items" slot-scope="props">
                            <td>{{ props.item.paymentNumber }}</td>
                            <td>{{ props.item.awardNumber }}</td>
                            <td>$ {{ props.item.amount }}</td>
                            <td>{{ props.item.statusTitle }}</td>
                            <td v-if="!props.item.attachment"></td>
                            <td v-else>
                              <div v-for="file in props.item.attachment.packageFiles">
                                <a target="_blank" class="a" :href="`${fileStorageBaseUrl}/payment-requests/refs/research/${props.item.award.research_id}/payment-attachment/${props.item.award.id}/${props.item.attachment.hash}/${file.hash}`">
									                  {{file.filename}}
							                  </a>
                              </div>
                            </td>
                            <td class="layout px-0">
                              <div>
                                <v-btn v-if="props.item.status == 1" small color="warning" dark>Certify</v-btn>
                                <v-btn v-else-if="props.item.status == 2" disabled small >Approved</v-btn>
                              </div>
                            </td>
                          </template>

                        </v-data-table>
                      </template>
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

    export default {
      name: "OrganizationDashboard",

      data() {
        return {
          tab: null,
          selectedAwardToWithdrawMeta: { isOpen: false, contract: null },
          fileStorageBaseUrl: window.env.DEIP_SERVER_URL,

          awardHeaders: [
            {
              text: 'Award ID',
              align: 'left',
              sortable: false,
              value: 'awardNumber'
            },
            { text: 'From', value: 'from' },
            { text: 'To', value: 'to' },
            { text: 'Total amount', value: 'totalAmount' },
            { text: 'Withdrawn amount', value: 'withdrawnAmount' },
            { text: 'Pending amount', value: 'pendingAmount' },
            { text: 'Avalable amount', value: 'availableAmount' }
          ],

          transactionsHeaders: [
            { text: 'Payment ID', value: 'paymentNumber' },
            { text: 'Award ID', value: 'awardNumber' },
            { text: 'Amount', value: 'amount' },
            { text: 'Status', value: 'status' },
            { text: 'Attachments', value: 'attachment' },
            { text: 'Actions', sortable: false }
          ]
        }
      },

      computed: {
        ...mapGetters({
          awards: 'org_dashboard/currentOrganizationAwards',
          transactions: 'org_dashboard/currentOrganizationTransactions',
          organization: 'org_dashboard/organization'
        })
      },

      methods: {
        openRequestPaymentDialog() {
          // this.selectedAwardToWithdrawMeta.contract = contract;
          this.selectedAwardToWithdrawMeta.isOpen = true;
        }
      }
    };
</script>

<style lang="less" scoped>

</style>
