<template>
  <v-dialog
    v-model="isOpen"
    persistent
    transition="scale-transition"
    max-width="600px"
  >
    <v-card class="pa-6">
      <v-card-title>
        <div class="headline">
          Transfer from Group balance
        </div>
        <div class="right-top-angle">
          <v-btn icon class="pa-0 ma-0" @click="close()">
            <v-icon color="black">
              close
            </v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="isFormValid"
          class="pb-6"
          @submit.prevent
        >
          <v-text-field
            ref="toUsername"
            v-model="form.to"
            label="To"
            :rules="[
              rules.required,
              rules.isExist
            ]"
            :loading="isUsernameChecking"
            @input="usernameChanged"
          />

          <v-text-field
            v-model="form.amount"
            label="Amount"
            :rules="[
              rules.required,
              rules.amount
            ]"
            :suffix="'$'"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-row>
          <v-col class="py-2" cols="12">
            <v-btn
              color="primary"
              block
              :loading="isSending"
              :disabled="!form.amount || deipTokenBalance < form.amount || isSending"
              @click="sendTokens()"
            >
              {{ group.is_dao ? 'Create proposal' : 'Send' }}
            </v-btn>
          </v-col>
          <v-col class="py-2" cols="12">
            <v-btn
              color="primary"
              block
              text
              :disabled="isSending"
              @click="close()"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import _ from 'lodash';
  import deipRpc from '@deip/rpc-client';
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
        group: 'researchGroup/group'
      }),
      deipTokenBalance() {
        return this.fromAssetsToFloat(this.group.balances[this.$env.ASSET_UNIT]);
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
          required: (value) => !!value || 'This field is required',
          isExist: (value) => this.isUsernameExist !== false || 'No user with such name',
          amount: (value) => {
            const formatValidationResult = this.deipTokenValidator(value);

            if (formatValidationResult !== true) {
              return formatValidationResult;
            } if (parseFloat(value) > this.deipTokenBalance) {
              return 'Amount is greater than group balance';
            }

            return true;
          }
        },

        isUsernameExist: undefined,
        isUsernameChecking: false,
        isSending: false
      };
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

            deipRpc.api.getAccountsAsync([this.form.to])
              .then((res) => {
                this.isUsernameExist = !_.isEmpty(res);
              })
              .catch((error) => {
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
            funds: this.toAssetUnits(this.form.amount)
          })
            .then((data) => {
              this.$notifier.showSuccess('Proposal was successfully created')

              this.clearForm();
              this.$store.dispatch('researchGroup/loadResearchGroupProposals', { groupId: this.group.id });

              setTimeout(() => this.close(), 1500);
            })
            .catch((err) => {
              this.$notifier.showError('Proposal was failed')
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
