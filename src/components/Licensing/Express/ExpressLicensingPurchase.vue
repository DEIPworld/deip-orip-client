<template>
  <div>
    <d-stack :gap="16">
      <v-radio-group
        v-model="selected"
        class="pa-0 ma-0"
        hide-details="auto"
        mandatory
      >
        <v-list v-if="licenses.length" nav class="pa-0">
          <v-list-item
            v-for="(item, index) of licenses"
            :key="`lic-${index}`"
            class="mx-n2 my-0"
            link
            @click="selected = item"
          >
            <v-list-item-action class="mr-4 my-2">
              <v-radio :value="item" :disabled="$isGuest" />
            </v-list-item-action>

            <v-list-item-content class="text-caption py-1 pr-2">
              <v-clamp
                autoresize
                :max-lines="2"
              >
                {{ item.name }}
              </v-clamp>
            </v-list-item-content>

            <v-list-item-action-text class="text--primary font-weight-medium">
              {{ $$toAssetUnits(item.fee) }}
            </v-list-item-action-text>
          </v-list-item>
        </v-list>
      </v-radio-group>
      <v-btn
        v-if="$isUser"
        block
        small
        outlined
        color="primary"
        :disabled="!selected"
        @click="dialog = true"
      >
        {{ $t('licensing.buy') }}
      </v-btn>
    </d-stack>

    <vex-dialog
      v-if="Boolean(selected) && $isUser"
      v-model="dialog"
      :title="$t('licensing.dialog.title')"
      :max-width="540"
      :true-disabled="!dialogModel.confirm || !hasPaymentSourceBalance"
      :disabled="processing"
      :loading="processing"
      @click:confirm="() => sendExpressLicensingRequest()"
    >
      <d-stack gap="32">
        <div class="text-body-2">
          <span class="font-weight-medium">
            {{ $t('licensing.dialog.licType') }}:
          </span> {{ selected.name }}<br>
          <span class="font-weight-medium">
            {{ $t('licensing.dialog.licIssueFee') }}:
          </span> {{ $$toAssetUnits(selected.fee) }}<br>
          <span class="font-weight-medium">
            {{ $t('licensing.dialog.paySource') }}:
          </span> {{ paymentSourceInfo }}
        </div>

        <v-sheet max-width="380px">
          <d-date-time-input
            v-model="dialogModel.date"
            :label="$t('licensing.dialog.dateField')"
            only-future
          />
        </v-sheet>

        <d-stack :gap="4">
          <v-checkbox
            v-model="dialogModel.confirm"
            class="ma-0 pa-0"
            hide-details="auto"
            :label="$t('licensing.dialog.agreeField')"
          />

          <div class="pl-8">
            <a
              class="link text-caption text--secondary"
              :href="getFileUrl(selected.file)"
              @click.stop
            >
              {{ selected.file }}
            </a>
          </div>
        </d-stack>
      </d-stack>
    </vex-dialog>
  </div>
</template>

<script>
  import { ContractAgreementService } from '@deip/contract-agreement-service';
  import { genSha256Hash } from '@deip/toolbox';
  import DStack from '@/components/Deipify/DStack/DStack';
  import { assetsChore } from '@/mixins/chores';
  import { CONTRACT_AGREEMENT_TYPE } from '@/variables';
  import DDateTimeInput from '@/components/Deipify/DInput/DDateTimeInput';
  import { attributesChore } from '@/mixins/chores/attributesChore';
  import { attributeFileUrl } from '@/utils/helpers';

  const contractAgreementService = ContractAgreementService.getInstance();

  const dialogModel = () => ({
    confirm: false,
    date: undefined
  });

  export default {
    name: 'ExpressLicensingPurchase',
    components: {
      DDateTimeInput,
      DStack
    },
    mixins: [assetsChore, attributesChore],

    props: {
      licenses: {
        type: Array,
        default: () => ([])
      },

      project: {
        type: Object,
        default: () => ({})
      },

      attributeId: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        selected: null,
        processing: false,
        dialog: false,
        dialogModel: dialogModel()
      };
    },

    computed: {
      hasPaymentSourceBalance() {
        if (!this.selected) return false;
        const balance = this.$currentUser.balances
          .find((b) => (
            b.asset_id === this.selected.fee.assetId
            || b.symbol === this.selected.fee.assetId));

        if (!balance) return false;

        const feeAmount = Number(this.selected.fee.amount);

        return Number(balance.amount) >= feeAmount;
      },
      paymentSourceInfo() {
        if (!this.selected) return false;

        const balance = this.$currentUser.balances
          .find((b) => (
            b.asset_id === this.selected.fee.assetId
            || b.symbol === this.selected.fee.assetId));

        if (!balance) return this.$t('licensing.dialog.noSource');

        const asset = this.$$assetInfo(this.selected.fee.assetId);

        return [asset.symbol, this.$$toAssetUnits(balance)].join(' / ');
      }
    },

    methods: {
      getFileUrl(file) {
        if (!file) return false;
        const attrInfo = this.$$getAttributeInfo(this.attributeId);
        return attributeFileUrl(
          attrInfo,
          this.project._id,
          this.attributeId,
          file,
          false,
          true
        );
      },

      sendExpressLicensingRequest() {
        const parties = [this.project.teamId, this.$currentUser.username];
        const hash = genSha256Hash(this.selected.file);

        return contractAgreementService.proposeContractAgreement({
          initiator: {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.username
          },
          creator: this.$currentUser.username,
          hash,
          terms: {
            projectId: this.project._id,
            ...this.selected
          },
          activationTime: undefined,
          expirationTime: new Date(this.dialogModel.date).getTime(),
          type: CONTRACT_AGREEMENT_TYPE.PROJECT_LICENSE,
          parties
        })
          .then(() => {
            this.$notifier.showSuccess(this.$t('licensing.dialog.reqSentSucc'));
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
          })
          .finally(() => {
            this.dialogModel = dialogModel();
            this.dialog = false;
          });
      }
    }
  };
</script>
