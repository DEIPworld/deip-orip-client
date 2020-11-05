<template>
  <v-card>
    <div class="primary lighten-5 c-p-4">
      <div class="uppercase text-align-center half-bold">
        Send group assets
      </div>
    </div>

    <div class="c-p-4">
      <v-form ref="form" v-model="isFormValid" @submit.prevent>
        <v-text-field
          ref="toUsername"
          v-model="form.to"
          outlined
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
          outlined
          :rules="[
            rules.required,
            rules.amount
          ]"
          suffix="$"
        />

        <v-textarea
          v-model="form.memo"
          label="Memo - optional"
          rows="1"
          auto-grow
          outlined
          counter="2000"
          no-resize
          :rules="[
            rules.memo
          ]"
        />

        <v-btn
          block
          color="primary"
          :loading="isSending"
          :disabled="isSending"
          type="submit"
          @click="sendTokens()"
        >
          Send
        </v-btn>
      </v-form>
    </div>
  </v-card>
</template>

<script>
  import _ from 'lodash';
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';

  export default {
    name: 'DeipTokenSendForm',

    props: {
      deipTokenBalance: { required: true, type: Number }
    },

    data() {
      return {
        form: {
          to: '',
          memo: '',
          amount: ''
        },

        isFormValid: false,

        rules: {
          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required'),
          isExist: (value) => (value !== this.user.username
            ? this.isUsernameExist !== false || 'No user with such name'
            : 'You can\'t send tokens to this user'),
          memo: (value) => !value || !!value && value.length <= 2000 || 'String should be shorter',
          amount: (value) => {
            const formatValidationResult = this.deipTokenValidator(value);

            if (formatValidationResult !== true) {
              return formatValidationResult;
            } if (parseFloat(value) > this.deipTokenBalance) {
              return 'Amount is greater than your DEIP Token balance';
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
      usernameChanged: _.debounce(
        function () {
          this.isUsernameExist = undefined;

          if (this.form.to !== '' && this.form.to !== this.user.username) {
            this.isUsernameChecking = true;

            deipRpc.api.getAccountsAsync([this.form.to])
              .then((res) => { this.isUsernameExist = !_.isEmpty(res); })
              .catch((error) => { this.isUsernameExist = false; })
              .finally(() => {
                this.isUsernameChecking = false;
                this.$refs.toUsername.validate();
              });
          }
        },
        600
      ),
      clearForm() {
        this.$refs.form.reset();

        this.form.to = '';
        this.form.memo = '';
        this.form.amount = '';
      },
      sendTokens() {
        if (this.$refs.form.validate()) {
          this.isSending = true;

          assetsService.transferAsset(
            { privKey: this.user.privKey, username: this.user.username }, 
            {
              from: this.user.username,
              to: this.form.to,
              amount: this.toAssetUnits(this.form.amount),
              memo: this.form.memo,
              extensions: []
            }
          ).then((data) => {
            this.$emit('deipTokensTransfered');
            this.clearForm();

            this.$notifier.showSuccess('Amount of DEIP tokens was sent');

            return data;
          }).catch((err) => {
            this.$notifier.showError('Transaction was failed');
          }).finally(() => {
            this.isSending = false;
          });
        }
      }
    },

    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    }
  };
</script>

<style lang="less" scoped>
</style>
