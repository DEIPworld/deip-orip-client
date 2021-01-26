<template>
  <div>
    <v-dialog
      v-model="meta.isOpen"
      persistent
      transition="scale-transition"
      max-width="700px"
    >
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
            v-model="awardee"
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
            v-model="paymentNumber"
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
            v-model="paymentAmount"
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
            :datetime="paymentDate"
            :rules="[
              rules.greaterThanNow,
              rules.withinAwardPeriod
            ]"
            :disabled="!awardee"
            @input="setPaymentDate"
          />

          <v-textarea
            ref="description"
            v-model="description"
            class="c-mt-2"
            label="Payment purpose"
            rows="2"
            outlined
            auto-grow
            append-icon="notes"
            :disabled="!awardee"
          />

          <div>
            <div v-if="dropzoneOptions">
              <vue-dropzone
                id="attachments-dropzone"
                ref="paymentAttachments"
                :options="dropzoneOptions"
                @vdropzone-success-multiple="vdropzoneSuccessMultiple"
                @vdropzone-sending-multiple="vdropzoneSendingMultiple"
                @vdropzone-error-multiple="vdropzoneErrorMultiple"
              />
            </div>
            <div v-else>
              <div id="attachments-dropzone" class="vue-dropzone dropzone non-clickable">
                <div class="dz-default dz-message">
                  <span>Drop files here to upload</span>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="c-pb-5 c-pr-10">
          <v-spacer />
          <v-btn class="grey--text" text @click="close()">
            Close
          </v-btn>
          <v-btn
            color="primary"
            outlined
            :disabled="isSubmitDisabled || isLoading"
            :loading="isLoading"
            @click="requestPayment()"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';
  import vueDropzone from 'vue2-dropzone';
  import { BlockchainService } from '@deip/blockchain-service';
  import { AccessService } from '@deip/access-service';
  import { GrantsService } from '@deip/grants-service';

  const blockchainService = BlockchainService.getInstance();
  const accessService = AccessService.getInstance();
  const grantsService = GrantsService.getInstance();

  const PAYMENT_NUMBER_MIN_LENGTH = 3;
  const PAYMENT_NUMBER_MAX_LENGTH = 15;

  export default {
    name: 'RequestAwardPaymentDialog',
    components: {
      vueDropzone
    },
    props: {
      meta: { required: true, default: undefined, type: Object }
    },
    data() {
      return {
        paymentAmount: undefined,
        paymentDate: undefined,
        paymentNumber: undefined,
        description: undefined,
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

        dropzoneOptions: {
          url: `${window.env.DEIP_SERVER_URL}/api/award-withdrawal-requests/upload-attachments`,
          paramName: 'award-withdrawal-request-attachment',
          timeout: 0,
          maxFiles: 10,
          parallelUploads: 10, // important to keep the same as maxFiles due to server session
          uploadMultiple: true,
          thumbnailWidth: 150,
          autoProcessQueue: false,
          addRemoveLinks: true
        }
      };
    },

    computed: {

      ...mapGetters({
        user: 'auth/user',
        awardee: 'agencyGrantProgramAwardDetails/awardee',
        foa: 'agencyGrantProgramAwardDetails/foa'
      }),

      isSubmitDisabled() {
        return !this.awardee || !this.paymentAmount || !this.paymentDate || !this.description;
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
          this.paymentDate = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm');
        }
      }
    },

    created() {
    },
    methods: {

      close() {
        this.isLoading = false;
        this.meta.isOpen = false;
        if (this.$refs.paymentAttachments) {
          this.$refs.paymentAttachments.removeAllFiles();
        }
      },

      allowedPaymentDates(val) {
        // return this.awardee ? (
        //   Date.parse(val) >= Date.parse(this.awardee.from) &&
        //   Date.parse(val) <= Date.parse(this.awardee.to) &&
        //   Date.parse(val) > Date.now()
        // ) : false;
        return true;
      },

      requestPayment() {
        this.isLoading = true;
        const queuedFiles = this.$refs.paymentAttachments.getQueuedFiles();
        if (queuedFiles.length) {
          this.$refs.paymentAttachments.processQueue();
        } else {
          this.sendRequest('');
        }
      },

      setPaymentDate(value) {
        this.paymentDate = value;
      },

      vdropzoneSendingMultiple(file, xhr, formData) {
        const accessToken = accessService.getAccessToken();
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        xhr.setRequestHeader('Upload-Session', `${(new Date()).getTime()}-${accessToken.split('.')[2]}`);
        xhr.setRequestHeader('Research-Id', this.awardee.research_id.toString());
        xhr.setRequestHeader('Payment-Number', this.paymentNumber);
        xhr.setRequestHeader('Award-Number', this.awardee.award_number);
        xhr.setRequestHeader('Subaward-Number', this.awardee.subaward_number);
      },

      vdropzoneSuccessMultiple(files, res) {
        const attachmentsRef = res;
        if (!attachmentsRef.hash) {
          throw new Error('File upload has failed');
        }
        this.sendRequest(attachmentsRef.hash);
      },

      vdropzoneErrorMultiple(files, message, xhr) {
        this.$notifier.showError('Sorry, the file storage server is temporarily unavailable, please try again later');
        this.close();
      },

      sendRequest(hash) {
        const granAssetSymbol = blockchainService.getAssetSymbol(this.foa.amount);
        const grantAssetPrecision = blockchainService.getAssetPrecision(this.foa.amount);

        grantsService.createAwardWithdrawalRequest(this.user.privKey, {
          paymentNumber: this.paymentNumber,
          awardNumber: this.awardee.award_number,
          subawardNumber: this.awardee.isSubawardee ? this.awardee.subaward_number : undefined,
          requester: this.user.username,
          amount: this.toAssetUnits(this.paymentAmount, grantAssetPrecision, granAssetSymbol),
          description: this.description,
          attachment: hash,
          extensions: []
        })
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
            this.$notifier.showSuccess('An error occurred while sending the payment request, please try again later.');
          })
          .finally(() => {
            this.isLoading = false;
            this.close();
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
