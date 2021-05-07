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
  import { assetsChore } from '@/mixins/chores';
  import DAssetInput from '@/components/Deipify/DInput/DAssetInput';

  const assetsService = AssetsService.getInstance();

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
            value: null,
            rules: {
              amount: [
                (value) => {
                  if (isNaN(value)) return this.$t('wallet.transferAction.flNumber');
                  if (!value || value < 0) return this.$t('wallet.transferAction.posFlNumber');

                  return true;
                }
              ]
            }
          }
      };
    },

    methods: {
      openDialog() {
        this.isOpened = true;
      },
      deposit() {
        console.log("Deposit funds");
      }
    },

    created() {
      this.form.value = {
        amount: 0,
        assetId: this.assetId
      };
    },
  };
</script>
