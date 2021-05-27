<template>
  <div>
    <v-btn
      outlined
      small
      max-height="30"
      class="text-caption"
      color="primary"
      @click="openDialog()"
    >
      <v-icon left>
        mdi-bank-plus
      </v-icon>
      {{ 'Deposit' }}
    </v-btn>
    <vex-dialog
      v-model="isOpened"
      :title="$t('wallet.depositDialog.depositFunds')"
      :disabled="isDepositing"
      :loading="isDepositing"
      :button-true-text="$t('wallet.depositDialog.depositFunds')"
      :button-false-text="$t('wallet.cancel')"
      @click:confirm="deposit()"
    >
      <v-row>
        <v-form
          ref="depositFundsForm"
          v-model="form.valid"
        >
          <d-asset-input
            v-model="form.value"
            label="Amount"
            required
          />
        </v-form>    
      </v-row>
    </vex-dialog>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { defaultAssetId } from '@/variables';
  import { AssetsService } from '@deip/assets-service';
  import { AccessService } from '@deip/access-service';
  import { assetsChore } from '@/mixins/chores';
  import DAssetInput from '@/components/Deipify/DInput/DAssetInput';
  import crypto from '@deip/lib-crypto';
  import axios from 'axios';

  const assetsService = AssetsService.getInstance();
  const accessService = AccessService.getInstance();

  export default {
    name: 'DepositFundsAction',

    components: {
      DAssetInput
    },

    mixins: [assetsChore],

    computed: {},

    props: {
      account: {
        type: String,
        required: true
      },
      assetId: {
        type: String,
        default: defaultAssetId,
        required: true
      }
    },

    data() {
      return {
        isOpened: false,
        isDepositing: false,
        form: {
          valid: false,
          account: null,
          value: null
        }
      };
    },

    methods: {
      openDialog() {
        this.isOpened = true;
      },
      deposit() {
        if (!this.form.value.amount || parseInt(this.form.value.amount) < 1) {
          return;
        }
        
        this.isDepositing = true;
        const payload = {
          amount: parseInt(this.form.value.amount) * 100, // cents
          currency: this.form.value.assetId,
          account: this.form.account,
          timestamp: Date.now()
        };
        const payloadStr = JSON.stringify(payload, Object.keys(payload).sort());
        const privateKey = crypto.PrivateKey.from(this.$currentUser.privKey);
        const sigBuff = privateKey.sign(new TextEncoder('utf-8').encode(payloadStr).buffer);
        const sigHex = crypto.hexify(sigBuff);
        axios.post(`${this.$env.DEIP_SERVER_URL}/webhook/assets/deposit?authorization=${accessService.getAccessToken()}`, {
          ...payload,
          sigHex
        })
        .then(({ data }) => {
          window.location.href = data.redirectUrl;
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.isDepositing = false;
        });
      }
    },

    created() {
      this.form.value = {
        amount: 1,
        assetId: this.assetId,
      };
      this.form.account = this.account;
    },
  };
</script>
