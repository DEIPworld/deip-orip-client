<template>
  <v-dialog v-model="isOpen" persistent transition="scale-transition" max-width="600px">
    <v-card class="pa-4">

      <v-card-title>
        <v-layout row align-center align-baseline>
          <v-flex grow class="headline">
            Transfer from Group balance
          </v-flex>
          <v-flex shrink align-self-center right-top-angle>
            <v-btn @click="close()" icon class="pa-0 ma-0">
              <v-icon color="black">close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-card-text>
        <v-form class="pb-4" ref="form" v-model="isFormValid" @submit.prevent>
          <v-text-field label="To"
                        ref="toUsername"
                        v-model="form.to"
                        :rules="[
                            rules.required,
                            rules.isExist
                        ]"
                        @input="usernameChanged"
                        :loading="isUsernameChecking"
          ></v-text-field>

          <v-text-field label="Amount"
                        v-model="form.amount"
                        :rules="[
                            rules.required,
                            rules.amount
                        ]"
                        :suffix="'$'"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-layout row wrap>
          <v-flex xs12 py-2>
            <v-btn
              color="primary"
              block
              @click="sendTokens()"
              :loading="isSending"
              :disabled="!form.amount || deipTokenBalance < form.amount || isSending">
              {{ !group.is_personal ? 'Create proposal' : 'Send' }}
            </v-btn>
          </v-flex>
          <v-flex xs12 py-2>
            <v-btn
              color="primary"
              block
              flat
              :disabled="isSending"
              @click="close()"
            >Cancel
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import _ from 'lodash';
  import deipRpc from '@deip/deip-oa-rpc-client';
  import { mapGetters } from 'vuex';

  import { ResearchGroupService } from '@deip/research-group-service';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'TransferGroupDeipTokensDialog',

    props: {
      isOpen: { required: true, type: Boolean }
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        group: 'researchGroup/group',
      }),
      deipTokenBalance() {
        return this.fromAssetsToFloat(this.group.balance);
      }
    },

    data() {
      return {
        form: {
          to: '',
          amount: ''
        },

        isFormValid: false,

        rules: {
          required: value => !!value || 'This field is required',
          isExist: value => {
            return this.isUsernameExist !== false || 'No user with such name';
          },
          amount: value => {
            let formatValidationResult = this.deipTokenValidator(value);

            if (formatValidationResult !== true) {
              return formatValidationResult;
            } else if (parseFloat(value) > this.deipTokenBalance) {
              return 'Amount is greater than group balance';
            }

            return true;
          }
        },

        isUsernameExist: undefined,
        isUsernameChecking: false,
        isSending: false
      }
    },

    methods: {
      close() {
        this.$emit('onClose');
      },

      usernameChanged: _.debounce(
        function () {
          this.isUsernameExist = undefined;

          if (this.form.to !== '' && this.form.to !== this.user.username) {
            this.isUsernameChecking = true;

            deipRpc.api.getAccountsAsync([ this.form.to ])
              .then(res => {
                this.isUsernameExist = !_.isEmpty(res);
              })
              .catch(error => {
                this.isUsernameExist = false;
              })
              .finally(() => {
                this.isUsernameChecking = false;
                this.$refs.toUsername.validate();
              });
          }
        },
        600
      ),

      sendTokens() {
        if (this.$refs.form.validate()) {
          this.isSending = true;

          researchGroupService.createSendFundsProposal({
            groupId: this.group.id,
            recipient: this.form.to,
            funds: this.toAssetUnits(this.form.amount),
          })
            .then(data => {
              this.$store.dispatch('layout/setSuccess', {
                message: 'Proposal was successfully created'
              });

              this.clearForm();
              this.$store.dispatch('researchGroup/loadResearchGroupProposals', { groupId: this.group.id });

              setTimeout(() => this.close(), 1500);
            })
            .catch(err => {
              this.$store.dispatch('layout/setError', {
                message: 'Proposal was failed'
              });
            })
            .finally(() => {
              this.isSending = false;
            });
        }
      },

      clearForm() {
        this.$refs.form.reset();

        this.form.to = '';
        this.form.amount = '';
      }
    },

    watch: {
      isOpen(newVal, oldVal) {
        if (newVal) {
          this.clearForm();
        }
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
