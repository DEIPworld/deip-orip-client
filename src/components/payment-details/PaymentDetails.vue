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
                  <div class="pa-1 attachment-hash grey--text text-align-center">{{file.hash}}</div>
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
              payment: 'payment_details/payment'
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

</style>
