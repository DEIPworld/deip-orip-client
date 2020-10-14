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
              <v-radio :value="item" :disabled="!$currentUser" />
            </v-list-item-action>

            <v-list-item-content class="text-caption py-0">
              {{ item.name }}
            </v-list-item-content>

            <v-list-item-action-text class="text--primary font-weight-medium">
              {{ toAssetString(item.fee) }}
            </v-list-item-action-text>
          </v-list-item>
        </v-list>
      </v-radio-group>
      <v-btn
        v-if="$currentUser"
        block
        small
        outlined
        color="primary"
        :disabled="!selected"
        @click="dialog = true"
      >
        Buy a licence
      </v-btn>
    </d-stack>

    <vex-dialog
      v-if="Boolean(selected) && $currentUser"
      v-model="dialog"
      title="Send request"
      :max-width="540"
      :true-disabled="!dialogModel.confirm"
      :disabled="processing"
      :loading="processing"
      @click:confirm="() => sendExpressLicensingRequest()"
    >
      <d-stack gap="32">
        <div class="text-body-2">
          <span class="font-weight-medium">License type:</span> {{ selected.name }}<br>
          <span class="font-weight-medium">License issue fee:</span> {{ toAssetString(selected.fee) }}<br>
          <span class="font-weight-medium">Payment source:</span> {{ paymentSource }}
        </div>

        <v-row>
          <v-col cols="6">
            <d-input-date
              v-model="dialogModel.date"
              label="Request expiration date"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="dialogModel.time"
              v-mask="'##:##'"
              placeholder="00:00"
              label="Request expiration time"
              hide-details="auto"
              outlined
            />
          </v-col>
        </v-row>

        <d-stack :gap="4">
          <v-checkbox
            v-model="dialogModel.confirm"
            class="ma-0 pa-0"
            hide-details="auto"
            label="I agree to the Terms and Conditions listed below"
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
  import DStack from '@/components/Deipify/DStack/DStack';
  import DInputDate from '@/components/Deipify/DInput/DInputDate';
  import { assetsChore } from '@/mixins/chores';
  import { researchAttributeFileUrl } from '@/utils/helpers';
  import { ExpressLicensingService } from '@deip/express-licensing-service';

  const expressLicensingService = ExpressLicensingService.getInstance();

  const dialogModel = () => ({
    confirm: false,
    date: undefined,
    time: undefined
  });

  export default {
    name: 'ExpressLicensingPurchase',
    components: {
      DInputDate,
      DStack
    },
    mixins: [assetsChore],

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
      paymentSource() {
        if (!this.selected) return false;

        const balance = this.$currentUser.balances
          .find((b) => b.asset_id === this.selected.fee.assetId);

        if (!balance) return 'No source';

        const { amount } = balance;
        const asset = this.assetInfo(this.selected.fee.assetId);

        return [asset.string_symbol, amount].join(' / ');
      }
    },

    methods: {
      getFileUrl(file) {
        if (!file) return false;

        return researchAttributeFileUrl(
          this.project.externalId,
          this.attributeId,
          file,
          false,
          true
        );
      },

      sendExpressLicensingRequest() {
        return expressLicensingService.createExpressLicensingRequest({
          privKey: this.$currentUser.privKey,
          username: this.$currentUser.username
        }, {
          requester: this.$currentUser.username,
          researchGroup: this.project.researchGroup.external_id,
          fee: this.toAssetString(this.selected.fee),
          expirationDate: `${this.dialogModel.date}T00:00:00`
        }, {
          researchExternalId: this.project.externalId,
          licencePlan: this.selected
        })
          .then((result) => {
            this.$notifier.showSuccess('Request has been sent successfully!');
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
