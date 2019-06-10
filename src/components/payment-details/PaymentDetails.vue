<template>
  <v-container fluid class="ma-0 pa-0 pb-5">
    <v-layout row wrap>
      
      <v-flex xs12 class="pb-4 pt-4 pl-4">
        <div class="display-1">Payment # {{payment | paymentNumber}}
          <span class="ml-2 paymnet-current-status-box">
            <span class="body-1 paymnet-current-status-label" 
              :style="{ 
                'background-color': withdrawalStatusMap[payment.status].color, 
                'border-color': withdrawalStatusMap[payment.status].color,
                'color': withdrawalStatusMap[payment.status].textColor
              }">
              {{ 
                payment.status == WITHDRAWAL_PENDING ? 'REQUESTED' :
                payment.status == WITHDRAWAL_CERTIFIED ? 'CERTIFIED' :
                payment.status == WITHDRAWAL_APPROVED ? 'APPROVED' :
                payment.status == WITHDRAWAL_PAID ? 'PAID' : '' 
              }}
            </span>
          </span>
        </div>
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
            <router-link class="a body-2" :to="{ 
                name: 'AwardDetails', 
                params: { 
                  org: payment.organization.permlink, 
                  contractId: payment.contract.id, 
                  awardId: payment.award.id } 
                }">
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

          <v-flex xs12 class="mt-3">
            <div class="subheading bold">Purpose</div>
            <div class="body-1">{{payment.description || 'Not specified'}}</div>
          </v-flex>

        </v-layout>
      </v-flex>

      <v-flex xs12>
        <div class="subheading bold pl-4 pt-2 pb-2 tx-data-divider" :style="{'background-color': theme['secondary-color']}">Related Blockchain Transactions/Actions</div>
      </v-flex>

      <v-flex xs12 v-for="(record, i) in historyRecords" :key="'status-' + i" class="ma-1" :style="{ 'border-left': '6px solid' +  withdrawalStatusMap[record.status].color }">
        <v-layout row wrap>
          <v-flex xs6>
            <v-layout row wrap>
              <v-flex xs12 class="pa-4">
                <v-chip class="payment-chip" :color="withdrawalStatusMap[record.status].color" :text-color="withdrawalStatusMap[record.status].textColor">
                  <div class="payment-chip-label">
                    <div class="subheading">
                      {{ 
                        record.status == WITHDRAWAL_PENDING ? 'REQUESTED' :
                        record.status == WITHDRAWAL_CERTIFIED ? 'CERTIFIED' :
                        record.status == WITHDRAWAL_APPROVED ? 'APPROVED' :
                        record.status == WITHDRAWAL_PAID ? 'PAID' : '' 
                      }}
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
                    <div class="body-2 bold white--text text--darken-4 pt-1 pl-1 mb-1 signer">{{getWitnessOrg(record.blockInfo.witness)}}</div>
                    <div class="body-2 white--text text--darken-4 pl-1">SHA256</div>
                    <div class="body-2 grey--text text--darken-1 pt-1 pl-1">Signature</div>
                  </v-flex>
                  <v-flex xs10 class="tx-data pa-1">
                    <div class="body-2 pt-1 pl-1">&nbsp;</div>
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2">{{record.blockInfo.signing_key}}</div>
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2">{{record.blockInfo.witness_signature}}</div>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex xs12 class="pt-2" v-for="witness in getOtherWitnesses(record)">
                <v-layout row wrap>
                  <v-flex xs2 class="tx-algo pa-1">
                    <div class="body-2 bold white--text text--darken-4 pt-1 pl-1 mb-1 signer">{{getWitnessOrg(witness.owner)}}</div>
                    <div class="body-2 white--text text--darken-4 pl-1">SHA256</div>
                    <div class="body-2 grey--text text--darken-1 pt-1 pl-1">Signature</div>
                  </v-flex>
                  <v-flex xs10 class="tx-data pa-1">
                    <div class="body-2 pt-1 pl-1">&nbsp;</div>
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2">{{witness.signing_key}}</div>
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2">{{witness.witness_signature}}</div>
                  </v-flex>
                </v-layout>
              </v-flex>

            </v-layout>
          </v-flex>
        </v-layout>

        <v-layout>
          <v-spacer></v-spacer>
          <v-flex xs10>
            <v-divider></v-divider>
          </v-flex>
          <v-spacer></v-spacer>
        </v-layout>
        
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
        name: "PaymentDetails",

        data() {
          return {
            theme: window.env.THEME,
            fileStorageBaseUrl: window.env.DEIP_SERVER_URL,
            ...withdrawalStatus, 
            withdrawalStatusMap,

            witnesses: [
              { owner: 'initdelegate1', signing_key: 'DEIP6GGrScrv5S8MDwAiQrg5Tvh4KPndcEV7ZDu8f9zfQ96gfTsNXP' }, 
              { owner: 'initdelegate2', signing_key: 'DEIP69cfB2TGrQgZRXKspwBn9E94CjLZDMABEFyyq9BeLVo8JhaXgZ' }
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
              organization: 'payment_details/organization',
              payment: 'payment_details/payment',
              historyRecords: 'payment_details/historyRecords'
          })
        },

        methods: {
          getOtherWitnesses(record) {
            let witnesses = this.witnesses.filter(w => w.owner != record.blockInfo.witness);

            for (let i = 0; i < witnesses.length; i++) {
              let witness = witnesses[i];

              if (i == 0) {
                let sig = record.blockInfo.witness_signature.split("").reverse().join("");
                witness.witness_signature = sig;
              } else {
                let part1 = record.blockInfo.witness_signature.slice(0, record.blockInfo.witness_signature.length / 2);
                let part2 = record.blockInfo.witness_signature.slice(record.blockInfo.witness_signature.length / 2, record.blockInfo.witness_signature.length);
                let sig = part2 + part1;
                witness.witness_signature = sig;
              }
            }
            return witnesses;
          },

          getWitnessOrg(witness) {
            if (witness == "initdelegate") return "NSF";
            if (witness == "initdelegate1") return "MIT";
            if (witness == "initdelegate2") return "TREASURY";
            return "NSF";
          }
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

  .top-payment-chip .top-payment-chip-label {
    min-width: 150px; 
    text-align: center;
  }

  .paymnet-current-status-box {
    display: inline-block;
    vertical-align: super;
  }

  .paymnet-current-status-label {
    border: 1px solid;
    padding: 3px 35px;
    border-radius: 12px;
  }

  .signer {
    border-bottom: 1px solid white;
  }

</style>
