<template>
  <v-container fluid class="ma-0 pa-0 c-pb-10">
    <v-layout row wrap>
      
      <v-flex xs12 class="pa-4">
        <h1 class="display-1">Payment # {{payment | paymentNumber}}</h1>
      </v-flex>

      <v-flex xs12>
        <v-divider></v-divider>
      </v-flex>

      <v-flex xs6 class="pa-4 grey-background">
        <v-layout row wrap>
          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Amount</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <span class="body-2">$ {{ payment.amount | currency }}</span>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">PI</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <router-link class="a body-2" :to="{ name: 'UserDetails', params: { account_name: payment.pi.account.name } }">{{ payment.pi | fullname }}</router-link>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Requester</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <router-link class="a body-2" :to="{ name: 'UserDetails', params: { account_name: payment.requester.account.name } }">{{ payment.requester | fullname }}</router-link>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Organization</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <a href="#" class="a body-2">{{ payment.organization.name}}</a>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Award #</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <router-link class="a body-2" 
              :to="{ name: 'AgencyProgramDetails', params: {
                      agency: payment.foa.agency_name, 
                      foa: payment.foa.funding_opportunity_number }}">
              {{ payment.award | awardNumber}}
            </router-link>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Funding Agency</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <a href="#" class="a body-2">{{ payment.foa.agency_name.toUpperCase()}}</a>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Timestamp</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <span class="body-2 grey--text">{{moment(payment.timestamp).format('MM/DD/YYYY HH:mm:ss')}}</span>
          </v-flex>
        </v-layout>
      </v-flex>


      <v-flex xs6 class="pa-4 grey-background">
        <v-layout row wrap>

          <v-flex xs12>
            <span class="subheading bold">Attachments</span>
          </v-flex>

          <v-flex xs12 v-if="payment.attachment">
            <div v-for="(file, i) in payment.attachment.packageFiles">
              <v-layout class="pt-2">
                <v-flex xs6>
                  <div class="pa-1 attachment-hash grey--text text--darken-1 text-align-center">{{file.hash}}</div>
                </v-flex>
                <v-flex xs6>
                  <div class="pa-1 pl-3 attachment-file">
                    <a target="_blank" class="a" :title="file.filename" :href="`${fileStorageBaseUrl}/payment-requests/refs/research/${payment.award.research_id}/payment-attachment/${payment.award.id}/${payment.attachment.hash}/${file.hash}`">
                      {{file.filename | ellipsis}}{{file.ext}}
                    </a>
                  </div>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
          <v-flex xs12 v-else>
            <span class="body-1">No attachments</span>
          </v-flex>

        </v-layout>
      </v-flex>

      <v-flex xs12>
        <div class="subheading bold pl-4 pt-2 pb-2 tx-data-divider">Related Blockchain Transactions/Actions</div>
      </v-flex>

      <v-flex xs12 v-for="(record, i) in historyRecords" :key="'status-' + i" class="ma-1" :style="{ 'border-left': '6px solid' +  withdrawalStatusMap[record.status].color }">
        <v-layout row wrap>
          <v-flex xs6>
            <v-layout row wrap>
              <v-flex xs12 class="pa-4">
                <v-chip class="payment-chip" :color="withdrawalStatusMap[record.status].color" :text-color="withdrawalStatusMap[record.status].textColor">
                  <div class="payment-chip-label">
                    <div class="subheading">
                      {{i + 1}}. {{ record.status == WITHDRAWAL_PENDING ? 'REQUESTED' :
                        record.status == WITHDRAWAL_CERTIFIED ? 'CERTIFIED' :
                        record.status == WITHDRAWAL_APPROVED ? 'APPROVED' : '' }}
                    </div>
                  </div>
                </v-chip>
              </v-flex>
              <v-flex xs12 class="pl-4 pr-2">
                <v-layout class="pt-2 pb-2">
                  <v-flex xs3><span class="body-1 grey--text">Timestamp</span></v-flex>
                  <v-flex xs9><span class="body-2 grey--text">{{moment(record.timestamp).format('MM/DD/YYYY HH:mm:ss')}}</span></v-flex>
                </v-layout>
                <v-layout class="pt-2 pb-2">
                  <v-flex xs3><span class="body-1 grey--text">Transaction ID</span></v-flex>
                  <v-flex xs9><a class="a" href="#">{{record.trx_id}}</a></v-flex>
                </v-layout>
                <v-layout class="pt-2 pb-2">
                  <v-flex xs3><span class="body-1 grey--text">Signed By</span></v-flex>
                  <v-flex xs9><router-link class="a body-2" :to="{ name: 'UserDetails', params: { account_name: record.trxSigner.account.name } }">{{ record.trxSigner | fullname }}</router-link></v-flex>
                </v-layout>

                <v-layout class="pt-2 pb-2">
                  <v-flex xs2 class="tx-algo pa-1">
                    <div class="body-2 white--text text--darken-4 pt-1 pl-1">SHA256</div>
                    <div class="body-2 grey--text text--darken-1 pt-1 pl-1">Signature</div>
                  </v-flex>
                  <v-flex xs10 class="tx-data pa-1">
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2">{{record.trxSigner.account.owner.key_auths[0][0] }}</div>
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2">{{record.trxInfo.signatures[0]}}</div>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs6 class="pa-4">
            <v-layout row wrap class="pt-2 pb-2">
              <v-flex xs2>
                <div class="body-1 grey--text">Block</div>
              </v-flex>
              <v-flex xs10>
                <div class="body-2 grey--text"># {{record.block}}</div>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pt-2 pb-2">
              <v-flex xs12>
                <div class="body-1 grey--text">Block ID</div>
              </v-flex>
              <v-flex xs12 class="pt-2">
                <v-layout row wrap>
                  <v-flex xs2 class="tx-algo pa-1">
                    <div class="body-2 white--text text--darken-4 pt-1 pl-1">RIPEMD-160</div>
                  </v-flex>
                  <v-flex xs10 class="tx-data pa-1">
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2">{{record.blockInfo.block_id}}</div>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pt-2 pb-2">
              <v-flex xs12>
                <div class="body-1 grey--text">Block Hash</div>
              </v-flex>
              <v-flex xs12 class="pt-2">
                <v-layout row wrap>
                  <v-flex xs2 class="tx-algo pa-1">
                    <div class="body-2 white--text text--darken-4 pt-1 pl-1">RIPEMD-160</div>
                  </v-flex>
                  <v-flex xs10 class="tx-data pa-1">
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2">{{record.blockInfo.transaction_merkle_root}}</div>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pt-2 pb-2">
              <v-flex xs12>
                <div class="body-1 grey--text">Block Signatures</div>
              </v-flex>

              <v-flex xs12 class="pt-2">
                <v-layout row wrap>
                  <v-flex xs2 class="tx-algo pa-1">
                    <div class="body-2 white--text text--darken-4 pt-1 pl-1">SHA256</div>
                    <div class="body-2 grey--text text--darken-1 pt-1 pl-1">Signature</div>
                  </v-flex>
                  <v-flex xs10 class="tx-data pa-1">
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2">{{record.blockInfo.signing_key}}</div>
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2">{{record.blockInfo.witness_signature}}</div>
                  </v-flex>
                </v-layout>
              </v-flex>

            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>

    import deipRpc from '@deip/deip-rpc-client';
    import { mapGetters } from 'vuex';
    import {
      withdrawalStatus, withdrawalStatusMap, WITHDRAWAL_PENDING, WITHDRAWAL_CERTIFIED, WITHDRAWAL_APPROVED, WITHDRAWAL_REJECTED, 
      fundingContractStatus, FUNDING_CONTRACT_PENDING, FUNDING_CONTRACT_APPROVED, FUNDING_CONTRACT_REJECTED,
    } from './../../services/FundingService';

    export default {
        name: "PaymentDetails",

        data() {
          return {
            fileStorageBaseUrl: window.env.DEIP_SERVER_URL,
            ...withdrawalStatus, 
            withdrawalStatusMap
          }
        },

        computed: {
          ...mapGetters({
              user: 'auth/user',
              isPrincipalInvestigator: 'auth/isPrincipalInvestigator',
              isCertifier: 'auth/isCertifier',
              isProgramOfficer: 'auth/isProgramOfficer',
              isFinancialOfficer: 'auth/isFinancialOfficer',
              organization: 'payment_details/organization',
              payment: 'payment_details/payment',
              historyRecords: 'payment_details/historyRecords'
          })
        },

        methods: {

        },

        watch: {

        },

        created() {}
    };
</script>

<style lang="less" scoped>

  .attachment-hash {
    background-color: #e0e0e0;
    border: 1.3px solid #e0e0e0;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .attachment-file {
    border: 1.3px solid #e0e0e0;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .tx-algo {
    background-color: #e0e0e0;
    border: 1.3px solid #e0e0e0;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .tx-data {
    border: 1.3px solid #e0e0e0;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .tx-data-divider {
    background-color: #cfe8fc
  }

  .payment-chip .payment-chip-label {
    min-width: 150px; 
    text-align: center;
  }

</style>
