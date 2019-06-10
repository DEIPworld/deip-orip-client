
<template>
  <div>
    <v-dialog v-model="meta.isOpen" persistent transition="scale-transition" max-width="700px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="close()">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Request a Payment</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text class="c-pt-5 c-pr-10 c-pl-10">
    <!--  <v-select
            ref="paymentAward"
            v-model="award"
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
            label="Amount"
            ref="paymentAmount"
            v-model="paymentAmount"
            :rules="[
              rules.required, 
              rules.isDigit,
              rules.withinAwardAvailableAmount
            ]"
            persistent-hint
            mask="##############"
            append-icon="local_atm"
            :disabled="!award"
          ></v-text-field>

          <datetime-picker
            :allowed-dates="allowedPaymentDates"
            date-placeholder="Payment Date"
            :date-hint="award ? `Award period: ${moment(new Date(award.from)).format('MM/YY')} - ${moment(new Date(award.to)).format('MM/YY')}` : ''"
            :date-persistent-hint="true"
            :dateOnly="true"
            @input="(val) => {
              paymentDate = new Date(val); 
            }"
            :rules="[
              rules.greaterThanNow,
              rules.withinAwardPeriod
            ]"
            :disabled="!award"
          ></datetime-picker>

          <v-textarea
            class="c-mt-2"
            label="Payment purpose"
            rows="2"
            ref="description"
            v-model="description"
            auto-grow
            append-icon="notes"
            :disabled="!award"
          ></v-textarea>
          
          <div>
            <div v-if="dropzoneOptions">
              <vue-dropzone ref="paymentAttachments" id="attachments-dropzone" 
                :options="dropzoneOptions" 
                @vdropzone-success-multiple="vdropzoneSuccessMultiple"
                @vdropzone-error="vdropzoneError">
              </vue-dropzone>
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
          <v-spacer></v-spacer>
          <v-btn class="grey--text" @click="close()" flat>Close</v-btn>
          <v-btn color="primary" 
            @click="requestPayment()" outline 
            :disabled="isSubmitDisabled || isLoading" 
            :loading="isLoading">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>
</template>


<script>
    import deipRpc from '@deip/deip-rpc-client';
    import { getAccessToken } from './../../../utils/auth'
    import { mapGetters } from 'vuex';
    import moment from 'moment';
    import vueDropzone from 'vue2-dropzone';

    export default {
        props: {
          meta: { required: true, default: undefined, type: Object }
        },
        components: {
          vueDropzone
        },
        name: "RequestAwardPaymentDialog",
        data() { 
          return {
            paymentAmount: undefined,
            paymentDate: undefined,
            description: undefined,
            isLoading: false,
            rules: {
              greaterThanNow: val => Date.parse(val) > Date.now() || 'Date should be greater than now',
              withinAwardPeriod: val => {
                if (this.award) {
                  return (Date.parse(val) >= Date.parse(this.award.from) && Date.parse(val) <= Date.parse(this.award.to)) ||
                    `Payment Date should fall within the range between of ${moment(new Date(this.award.from)).format("MM/YY")} to ${moment(new Date(this.award.to)).format("MM/YY")}`
                }
                return false;
              },
              withinAwardAvailableAmount: val => {
                if (this.award) {
                  return this.award.remainingAmount >= val || `Amount should be less or equal to award available amount: $ ${this.award.remainingAmount}`;
                }
                return false;                
              },
              isDigit: val => val && val.match(/^\d+$/) === null ? 'Incorrect amount format' : !!val,
              required: val => !!val || 'This field is required',
              
            }
          }
        },
        computed: {
          ...mapGetters({
            user: 'auth/user',
            award: 'award_details/award'
          }),
          isSubmitDisabled() {
            return !this.award || !this.paymentAmount || !this.paymentDate || !this.description;
          },
          dropzoneOptions() {
            return this.award && this.timestamp ? {
              url: `${window.env.DEIP_SERVER_URL}/payment-requests/upload-files`,
              paramName: "application-content",
              headers: {
                "Agency": window.env.TENANT,
                "Research-Id": this.award.relation.research_id.toString(),
                "Foa-Id": this.award.contract.foa.id.toString(),
                "Award-Id": this.award.relation.id.toString(),
                "Authorization": 'Bearer ' + getAccessToken(),
                "Upload-Session": `${this.timestamp}-${getAccessToken().split('.')[2]}`
              },
              timeout: 0,
              maxFiles: 10,
              parallelUploads: 10,
              uploadMultiple: true,
              thumbnailWidth: 150,
              autoProcessQueue: false,
              addRemoveLinks: true
            } : null;
          },

          amountHint() {
            return this.award.isSubaward 
              ? this.$options.filters.currency(this.award.remainingPiAmount) // rename this field
              : this.$options.filters.currency(this.award.remainingPiAmount);
          }
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
            // return this.award ? (
            //   Date.parse(val) >= Date.parse(this.award.from) && 
            //   Date.parse(val) <= Date.parse(this.award.to) && 
            //   Date.parse(val) > Date.now()
            // ) : false;
            return true;
          },

          requestPayment() {
            this.isLoading = true;
            let queuedFiles = this.$refs.paymentAttachments.getQueuedFiles();
            if (queuedFiles.length) {
              this.$refs.paymentAttachments.processQueue();
            } else {
              this.sendRequest("");
            }
          },

          vdropzoneSuccessMultiple(files, res) {
            const attachmentsRef = res;
            if (!attachmentsRef.hash) {
                throw new Error("File upload has failed")
            }
            this.sendRequest(attachmentsRef.hash)
          },

          vdropzoneError(file, message, xhr) {
            this.$store.dispatch('layout/setError', {
                message: "Sorry, the file storage server is temporarily unavailable, please try again later"
            });
            this.close();
          },
          
          sendRequest(hash) {
            deipRpc.broadcast.createFundingWithdrawalRequestAsync(
              this.user.privKey,
              this.award.relation.id,
              this.award.relation.research_group_id,
              this.award.relation.research_id,
              this.user.account.organisation_id,
              this.user.username,
              1, // purpose
              this.paymentAmount,
              "NGT",
              this.description,
              hash
            )
            .then(() => {
              let reload = new Promise((resolve, reject) => {
                this.$store.dispatch('award_details/loadAward', { notify: resolve, contractId: this.award.contract.id, awardId: this.award.id });
              });
              return Promise.all([reload]);
            })
            .then(() => {
              this.$store.dispatch('layout/setSuccess', {
                message: `Payment request has been created successfully!`
              });
            })
            .catch((err) => {
              console.log(err);
              this.$store.dispatch('layout/setError', {
                  message: `An error occurred while sending the payment request, please try again later.`
              });
            })
            .finally(() => {
              this.isLoading = false;
              this.close();
            });
          }
        },

        watch: {
          "meta.isOpen"(newVal, oldVal) {
            if (newVal) {
              this.timestamp = (new Date()).getTime();
              this.$refs.paymentAmount.reset();
              this.$refs.description.reset();
              this.paymentDate = undefined;
            } 
          }
        },

        created() {
          this.timestamp = (new Date()).getTime();
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

