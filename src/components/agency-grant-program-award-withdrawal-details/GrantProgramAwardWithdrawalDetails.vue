<template>
  <v-container fluid class="ma-0 pa-0">
    <v-layout row wrap>
      
      <v-flex xs12 class="pb-4 pt-4 pl-4">
        <div class="display-1">Payment # {{withdrawal.paymentNumber}}
          <span class="ml-2 paymnet-current-status-box">
            <span class="body-1 paymnet-current-status-label" 
              :style="{ 
                'background-color': withdrawalStatusMap[withdrawal.status].color, 
                'border-color': withdrawalStatusMap[withdrawal.status].color,
                'color': withdrawalStatusMap[withdrawal.status].textColor
              }">
              {{ withdrawalStatusMap[withdrawal.status].statusText }}
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
            <span class="body-2">{{ withdrawal.amount | currency }}</span>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">PI</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <router-link class="a body-2" :to="{ name: 'UserDetails', params: { account_name: withdrawal.pi.account.name } }">{{ withdrawal.pi | fullname }}</router-link>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Requester</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <router-link class="a body-2" :to="{ name: 'UserDetails', params: { account_name: withdrawal.requester.account.name } }">{{ withdrawal.requester | fullname }}</router-link>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Organization</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <router-link class="a body-2" :to="{
              name: 'ResearchGroupDetails',
              params: {
                research_group_permlink:  awardee.organization.permlink
              }
            }">{{ awardee.organization.name }}</router-link>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Award #</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <router-link class="a body-2" :to="{ 
                name: 'GrantProgramAwardDetails', 
                params: { 
                  awardNumber: awardee.award_number,
                  subawardNumber: awardee.subaward_number 
                } }">
              {{ awardee.isSubawardee ? `${awardee.award_number} / ${awardee.subaward_number}` : `${awardee.award_number}` }}
            </router-link>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Funding Agency</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <router-link class="a body-2" :to="{
              name: 'ResearchGroupDetails',
              params: {
                research_group_permlink: foa.organization.permlink
              }
            }">{{ foa.organization.name }}</router-link>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Timestamp</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <span class="body-2 grey--text">{{moment(withdrawal.timestamp).format('MM/DD/YYYY HH:mm:ss')}}</span>
          </v-flex>
        </v-layout>
      </v-flex>


      <v-flex xs6 class="pa-4 grey-background">
        <v-layout row wrap>

          <v-flex xs12>
            <span class="subheading bold">Attachments</span>
          </v-flex>

          <v-flex xs12 v-if="withdrawal.attachment">
            <div v-for="(file, i) in withdrawal.attachment.packageFiles" :key="`${i}-attachment`">
              <v-layout row class="pt-2">
                <v-flex xs6 class="attachment-hash">
                  <div class="pa-1 break-all grey--text text--darken-1">{{file.hash}}</div>
                </v-flex>
                <v-flex xs6 class="attachment-file">
                  <div class="pa-1">
                    <a target="_blank" class="a" :title="file.filename" :href="getAttachmentUrl(withdrawal.awardNumber, withdrawal.paymentNumber, file.hash)">
                      {{file.filename}} 
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
            <div class="body-1">{{withdrawal.description || 'Not specified'}}</div>
          </v-flex>

        </v-layout>
      </v-flex>

      <v-flex xs12>
        <v-card class="elevation-0 pa-4" :style="{'background-color': themeSettings['secondary-color']}">
          <div class="headline">Blockchain Transactions/Actions:</div>
        </v-card>
      </v-flex>

      <v-flex xs12 v-for="(record, i) in withdrawalHistoryRecords" :key="'status-' + i" class="ma-2" :style="{ 'border-left': '6px solid' +  withdrawalStatusMap[record.status].color }">
        <v-card class="elevation-0">
        <v-layout row wrap>
          <v-flex xs6>
            <v-layout row wrap>
              <v-flex xs12 class="pa-4">
                <v-chip class="withdrawal-chip" :color="withdrawalStatusMap[record.status].color" :text-color="withdrawalStatusMap[record.status].textColor">
                  <div class="withdrawal-chip-label">
                    <div class="subheading">
                      {{ withdrawalStatusMap[record.status].statusText }}
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
                  <v-flex xs9>
                    <router-link class="a body-2" :to="{ name: 'UserDetails', params: { account_name: record.trxSigner.account.name } }">{{ record.trxSigner | fullname }}</router-link>
                    <span class="body-2 grey--text pl-2">({{ record.trxOrg.name }})</span>
                  </v-flex>
                </v-layout>

                <v-layout class="pt-2 pb-2">
                  <v-flex xs2 class="tx-algo pa-1">
                    <div class="body-2 white--text text--darken-4 pt-1 pl-1">SHA256</div>
                    <div class="body-2 grey--text text--darken-1 pt-1 pl-1">Signature</div>
                  </v-flex>
                  <v-flex xs10 class="tx-data pa-1">
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2 break-all">{{record.trxSigner.account.owner.key_auths[0][0] }}</div>
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2 break-all">{{record.trxInfo.signatures[0]}}</div>
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
                <div class="body-1 grey--text">Merkle Root</div>
              </v-flex>
              <v-flex xs12 class="pt-2">
                <v-layout row wrap>
                  <v-flex xs2 class="tx-algo pa-1">
                    <div class="body-2 white--text text--darken-4 pt-1 pl-1">RIPEMD-160</div>
                  </v-flex>
                  <v-flex xs10 class="tx-data pa-1">
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2 break-all">{{record.blockInfo.transaction_merkle_root}}</div>
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
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2 break-all">{{record.blockInfo.signing_key}}</div>
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2 break-all">{{record.blockInfo.witness_signature}}</div>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex xs12 class="pt-2" v-for="(witness, i) in getOtherWitnesses(record)" :key="i + '-block-signer'">
                <v-layout row wrap>
                  <v-flex xs2 class="tx-algo pa-1">
                    <div class="body-2 bold white--text text--darken-4 pt-1 pl-1 mb-1 signer">{{getWitnessOrg(witness.owner)}}</div>
                    <div class="body-2 white--text text--darken-4 pl-1">SHA256</div>
                    <div class="body-2 grey--text text--darken-1 pt-1 pl-1">Signature</div>
                  </v-flex>
                  <v-flex xs10 class="tx-data pa-1">
                    <div class="body-2 pt-1 pl-1">&nbsp;</div>
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2 break-all">{{witness.signing_key}}</div>
                    <div class="break-letter body-1 grey--text text--darken-1 pt-1 pl-2 pr-2 break-all">{{witness.witness_signature}}</div>
                  </v-flex>
                </v-layout>
              </v-flex>

            </v-layout>
          
          </v-flex>
        </v-layout>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

    import deipRpc from '@deip/rpc-client';
    import { mapGetters } from 'vuex';
    import { AWARD_STATUS, AWARD_WITHDRAWAL_REQUEST_STATUS } from '@/variables';
    import { AccessService } from '@deip/access-service';

    const accessService = AccessService.getInstance();
    
    export default {
        name: "AgencyAwardWithdrawalDetails",

        data() {
          return {
            fileStorageBaseUrl: window.env.DEIP_SERVER_URL,

            AWARD_WITHDRAWAL_REQUEST_STATUS,

            witnesses: [
              { owner: 'initdelegate1', signing_key: 'DEIP6GGrScrv5S8MDwAiQrg5Tvh4KPndcEV7ZDu8f9zfQ96gfTsNXP' }, 
              { owner: 'initdelegate2', signing_key: 'DEIP69cfB2TGrQgZRXKspwBn9E94CjLZDMABEFyyq9BeLVo8JhaXgZ' }
            ],

            withdrawalStatusMap: {
              [AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING]: { text: 'Pending Certification', color: '#ffccbc', textColor: '#302a1b', statusText: "REQUESTED" },
              [AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED]: { text: 'Pending Approval', color: '#ffe492', textColor: '#302a1b', statusText: "CERTIFIED" },
              [AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED]: { text: 'Pending Money Transfer', color: '#8fc3f7', textColor: '#302a1b', statusText: "APPROVED" },
              [AWARD_WITHDRAWAL_REQUEST_STATUS.PAID]: { text: 'Paid', color: '#02b56a', textColor: '#dbf5ea', statusText: "PAID" },
              [AWARD_WITHDRAWAL_REQUEST_STATUS.REJECTED]: { text: 'Rejected', color: '#ff5252', textColor: '#dbf5ea', statusText: "REJECTED" }
            }
          }
        },

        computed: {
          ...mapGetters({
              user: 'auth/user',
              themeSettings: 'layout/themeSettings',
              
              withdrawal: 'agencyGrantProgramAwardWithdrawalDetails/withdrawal',
              awardee: 'agencyGrantProgramAwardWithdrawalDetails/awardee',
              foa: 'agencyGrantProgramAwardWithdrawalDetails/foa',
              treasury: 'agencyGrantProgramAwardWithdrawalDetails/treasury',
              withdrawalHistoryRecords: 'agencyGrantProgramAwardWithdrawalDetails/withdrawalHistoryRecords'
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
          },

          getAttachmentUrl(awardNumber, paymentNumber, hash, download = false) {
            return `${window.env.DEIP_SERVER_URL}/api/award-withdrawal-requests/${awardNumber}/${paymentNumber}/${hash}?download=${download}&authorization=${accessService.getAccessToken()}`
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

  .withdrawal-chip .withdrawal-chip-label {
    min-width: 150px; 
    text-align: center;
  }

  .top-withdrawal-chip .top-withdrawal-chip-label {
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
