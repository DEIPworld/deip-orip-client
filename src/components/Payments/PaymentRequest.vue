<template>
  <div v-if="deposit">
    <layout-section>
      <div class="d-flex justify-start align-center">
        <h2 class="mr-4">
          Payment Status:
        </h2>
        <h2 :class="deposit.status == DEPOSIT_REQUEST_STATUS.APPROVED 
          ? 'green--text text--darken-1' 
          : deposit.status == DEPOSIT_REQUEST_STATUS.REJECTED || errorText
            ? 'red--text text--darken-1' 
            : 'blue--text text--darken-1'"
        >
          {{ 
            deposit.status == DEPOSIT_REQUEST_STATUS.APPROVED 
              ? 'Approved' 
              : deposit.status == DEPOSIT_REQUEST_STATUS.REJECTED || errorText
                ? 'Rejected' 
                : 'In progress' 
          }}
        </h2>
      </div>
    </layout-section>
    <v-divider />
    <layout-section>
      <content-block
        no-gutters
      >
        <div v-if="deposit.status == DEPOSIT_REQUEST_STATUS.APPROVED" >
          Payment {{deposit._id}} has been processed successfully, you can see your updated balance at the <router-link
            class="a full-width break-word font-weight-medium"
            :to="{ name: deposit.username == deposit.account ? 'userWallet' : 'groupWallet', params: { account: deposit.account } }"
          >Assets</router-link> page
        </div>
        <div v-else-if="deposit.status == DEPOSIT_REQUEST_STATUS.PENDING">
          Payment {{deposit._id}} is being processed currently, it may take a while to get it completed. See the <router-link
            class="a full-width break-word font-weight-medium"
            :to="{ name: deposit.username == deposit.account ? 'userWallet' : 'groupWallet', params: { account: deposit.account } }"
          >Assets</router-link> page to check your balance.
        </div>
        <div v-else-if="deposit.status == DEPOSIT_REQUEST_STATUS.REJECTED">
          Payment {{deposit._id}} has failed to proceed, please contact to system Administrator to check payment request
        </div>
        <div v-if="errorText" class="red--text text--darken-1">{{errorText}}</div>
        <!-- <div class="text-body-2 white-space-pre-line py-2">
          {{ JSON.stringify(deposit, null, 2) }}
        </div> -->
      </content-block>
    </layout-section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { AccessService } from '@deip/access-service';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import ContentBlock from '@/components/layout/components/ContentBlock';
  import axios from 'axios';

  const accessService = AccessService.getInstance();

  export default {
    name: 'PaymentRequest',
    components: { ContentBlock, LayoutSection },
    data() {
      return {
        deposit: null,
        errorText: '',
        DEPOSIT_REQUEST_STATUS: {
          PENDING: 1,
          APPROVED: 2,
          REJECTED: 3
        }
      };
    },
    computed: {
    },
    created() {
      const requestToken = this.$route.query.requestToken;
      axios.get(`${this.$env.DEIP_SERVER_URL}/webhook/assets/deposit/${requestToken}?authorization=${accessService.getAccessToken()}`)
        .then(({ data }) => {
          this.deposit = data;
          this.errorText = this.$route.query.errorText || '';
        })
        .catch((err) => {
          console.error(err);
        });
    },
  };
</script>

<style lang="less" scoped>
</style>
