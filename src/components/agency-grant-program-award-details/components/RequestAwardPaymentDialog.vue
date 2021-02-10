<template>
  <div>
    <v-dialog
      v-model="meta.isOpen"
      persistent
      transition="scale-transition"
      max-width="700px"
    >
    <v-form ref="form" @submit.prevent="onSubmit">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="close()">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Request a Payment</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text class="pa-5">
          <!--  <v-select
            outlined
            ref="paymentAward"
            v-model="formData.awardee"
            :items="awards"
            label="Award ID"
            return-object
          >
            <template slot="item" slot-scope="data">
              <span class="c-mr-1 c-ml-1">{{ data.item | awardNumber }}</span>
              <span class="c-mr-1 c-ml-1">|</span>
              <span class="c-mr-1 c-ml-1">{{ data.item.contract.foa.funding_opportunity_number }}</span>
            </template>
            <template slot="selection" slot-scope="data">
              <span class="c-mr-1 c-ml-1">{{ data.item | awardNumber }}</span>
              <span class="c-mr-1 c-ml-1">|</span>
              <span class="c-mr-1 c-ml-1">{{ data.item.contract.foa.funding_opportunity_number }}</span>
            </template>

            :hint="`Available amount: $ ${amountHint}`"

          </v-select> -->

          <v-text-field
            ref="paymentNumber"
            v-model="formData.paymentNumber"
            outlined
            label="Payment Number"
            :rules="[
              rules.required,
              rules.payentNumber
            ]"
            :disabled="!awardee"
          />

          <v-text-field
            ref="paymentAmount"
            v-model="formData.paymentAmount"
            v-mask="'##############'"
            label="Amount"
            outlined
            :rules="[
              rules.required,
              rules.isDigit,
              rules.withinAwardAvailableAmount
            ]"
            persistent-hint
            :disabled="!awardee"
          />

          <datetime-picker
            ref="paymentDateInput"
            :allowed-dates="allowedPaymentDates"
            date-placeholder="Payment Date"
            :date-hint="awardee ? `Award period: ${moment(new Date(awardee.from)).format('MM/YY')} - ${moment(new Date(awardee.to)).format('MM/YY')}` : ''"
            :date-persistent-hint="true"
            :datetime="formData.paymentDate"
            :rules="[
              rules.greaterThanNow,
              rules.withinAwardPeriod
            ]"
            :disabled="!awardee"
            @input="setPaymentDate"
          />

          <v-textarea
            ref="description"
            v-model="formData.description"
            class="c-mt-2"
            label="Payment purpose"
            rows="2"
            outlined
            auto-grow
            append-icon="notes"
            :disabled="!awardee"
          />

          <div>
            <d-file-input
              v-model="formData.files"
              multiple
              :label="'Attach files'"
              hide-details="auto"
            />
          </div>
        </v-card-text>

        <v-card-actions class="c-pb-5 c-pr-10">
          <v-spacer />
          <v-btn class="grey--text" text @click="close()">
            Close
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            outlined
            :disabled="isSubmitDisabled || isLoading"
            :loading="isLoading"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    </v-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';
  import { BlockchainService } from '@deip/blockchain-service';
  import { GrantsService } from '@deip/grants-service';
  import DFileInput from '@/components/Deipify/DInput/DFileInput';

  const blockchainService = BlockchainService.getInstance();
  const grantsService = GrantsService.getInstance();

  const PAYMENT_NUMBER_MIN_LENGTH = 3;
  const PAYMENT_NUMBER_MAX_LENGTH = 15;

  export default {
    name: 'RequestAwardPaymentDialog',
    components: {
      DFileInput
    },
    props: {
      meta: { required: true, default: undefined, type: Object }
    },
    data() {
      return {
        formData: {
          description: undefined,
          paymentAmount: undefined,
          paymentDate: undefined,
          paymentNumber: undefined,
          files: []
        },

        isLoading: false,
        rules: {
          greaterThanNow: (val) => Date.parse(val) > Date.now() || 'Date should be greater than now',
          withinAwardPeriod: (val) => {
            if (this.awardee) {
              return (Date.parse(val) >= Date.parse(this.awardee.from) && Date.parse(val) <= Date.parse(this.awardee.to))
                || `Payment Date should fall within the range between of ${moment(new Date(this.awardee.from)).format('MM/YY')} to ${moment(new Date(this.awardee.to)).format('MM/YY')}`;
            }
            return false;
          },
          withinAwardAvailableAmount: (val) => {
            if (this.awardee) {
              return this.awardee.remainingAmount >= val || `Amount should be less or equal to award available amount: $ ${this.awardee.remainingAmount}`;
            }
            return false;
          },
          isDigit: (val) => (val && val.match(/^\d+$/) === null ? 'Incorrect amount format' : !!val),
          required: (val) => !!val || this.$t('defaultNaming.fieldRules.required'),
          payentNumber: (v) => {
            if (!v) return 'Required';
            if (v.length < PAYMENT_NUMBER_MIN_LENGTH) {
              return `Payment number length should be greater/equal than ${PAYMENT_NUMBER_MIN_LENGTH}`;
            } if (v.length > PAYMENT_NUMBER_MAX_LENGTH) {
              return `Payment number length should be less/equal than ${PAYMENT_NUMBER_MAX_LENGTH}`;
            }
            return /^[0-9]*$/.test(v) || 'Numbers are only allowed';
          }
        },
        
      };
    },

    computed: {

      ...mapGetters({
        user: 'auth/user',
        awardee: 'agencyGrantProgramAwardDetails/awardee',
        foa: 'agencyGrantProgramAwardDetails/foa'
      }),

      isSubmitDisabled() {
        return !this.awardee || !this.formData.paymentAmount || !this.formData.paymentDate || !this.formData.description;
      },

      amountHint() {
        return this.$options.filters.currency(
          blockchainService.fromAssetsToFloat(this.awardee.total_amount) - blockchainService.fromAssetsToFloat(this.awardee.total_expenses)
        );
      }
    },

    watch: {
      'meta.isOpen': function (newVal, oldVal) {
        if (newVal) {
          if (this.$refs.paymentNumber) {
            this.$refs.paymentNumber.reset();
          }
          if (this.$refs.paymentAmount) {
            this.$refs.paymentAmount.reset();
          }
          if (this.$refs.description) {
            this.$refs.description.reset();
          }
          this.formData.paymentDate = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm');
        }
      }
    },

    methods: {

      close() {
        this.isLoading = false;
        this.meta.isOpen = false;
      },

      allowedPaymentDates(val) {
        // return this.awardee ? (
        //   Date.parse(val) >= Date.parse(this.awardee.from) &&
        //   Date.parse(val) <= Date.parse(this.awardee.to) &&
        //   Date.parse(val) > Date.now()
        // ) : false;
        return true;
      },

      setPaymentDate(value) {
        this.formData.paymentDate = value;
      },


      onSubmit() {
        const granAssetSymbol = blockchainService.getAssetSymbol(this.foa.amount);
        const grantAssetPrecision = blockchainService.getAssetPrecision(this.foa.amount);

        const formData = new FormData();
        
        formData.append('researchExternalId', this.awardee.research_external_id);
        formData.append('paymentNumber', this.formData.paymentNumber);
        formData.append('awardNumber', this.awardee.award_number);
        formData.append('subawardNumber', this.awardee.subaward_number);
        formData.append('requester', this.user.username);
        formData.append('amount', this.toAssetUnits(this.formData.paymentAmount, grantAssetPrecision, granAssetSymbol));
        formData.append('description', this.formData.description);
        for (let i = 0; i < this.formData.files.length; i++) {
          formData.append(`file-${i + 1}`, this.formData.files[i]);
        }

        this.isLoading = true;
        this.sendRequest(formData)
          .finally(() => {
            this.isLoading = false;
            this.close();
          });
      },

      sendRequest(form) {
        return grantsService.createAwardWithdrawalRequest({ privKey: this.user.privKey, username: this.user.username }, form)
          .then(() => {
            const reload = new Promise((resolve, reject) => {
              this.$store.dispatch('agencyGrantProgramAwardDetails/loadAwardDetails', {
                notify: resolve,
                awardNumber: this.awardee.award_number,
                subawardNumber: this.awardee.subaward_number
              });
            });
            return Promise.all([reload]);
          })
          .then(() => {
            this.$notifier.showSuccess('Payment request has been created successfully!');
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('An error occurred while sending the payment request, please try again later.');
          });
      }
    }
  };
</script>

<style lang="less" scoped>

    #attachments-dropzone {
        margin-left: -1px;
        margin-right: -1px;
    }

    .dialog.dialog--active {
        overflow: visible;
    }

</style>
