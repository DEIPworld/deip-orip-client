<template>
  <d-stack :gap="16">
    <v-radio-group
      v-model="selected"
      class="pa-0 ma-0"
      hide-details="auto"
    >
      <v-list v-if="attrHasData" nav class="pa-0">

        <v-list-item
          v-for="(item, index) of attribute.value"
          :key="`lic-${index}`"
          class="mx-n2"
          link
          @click="selected = item"
        >
          <v-list-item-action class="mr-4 my-2">
            <v-radio :value="item" :disabled="!$currentUser" />
          </v-list-item-action>

          <v-list-item-content class="text-caption">
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

    <ve-dialog
      v-if="Boolean(selected) && $currentUser"
      v-model="dialog"
      title="Send request"
      :max-width="540"
      :true-disabled="!dialogModel.confirm"
    >
      <d-stack>
        <div class="text-body-1">
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
              label="Request expiration time"
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
    </ve-dialog>
  </d-stack>

</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';
  import { assetsChore } from '@/mixins/chores';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DInputDate from '@/components/Deipify/DInput/DInputDate';
  import { researchAttributeFileUrl } from '@/utils/helpers';

  export default {
    name: 'AttributesExpressLicensingRead',
    components: { DInputDate, DStack },
    mixins: [attributeRead, assetsChore],
    data() {
      return {
        selected: null,
        dialog: false,
        dialogModel: {
          confirm: false,
          date: undefined,
          time: undefined
        }
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
          this.projectId,
          this.attribute.researchAttributeId,
          file,
          false,
          true
        );
      }
    }
  };
</script>
