<template>
  <v-card>
    <div class="primary lighten-5 c-p-4">
      <div class="uppercase text-align-center half-bold">
        Send research tokens
      </div>
    </div>

    <div class="c-p-4">
      <v-form ref="form" v-model="isFormValid" @submit.prevent>
        <v-select
          :items="researches"
          :value="researchId"
          item-text="title"
          item-value="id"
          label="Research"
          @input="changeResearch"
        />

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
          suffix="%"
          :rules="[
            rules.required,
            rules.amount
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
    name: 'ResearchTokenSendForm',
    props: {
      researches: { required: true, type: Array },
      researchId: { required: true, type: Number },
      researchToken: { required: true, type: Object }
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
          isExist: (value) => (value !== this.user.username
            ? this.isUsernameExist !== false || 'No user with such name'
            : 'You can\'t send tokens to this user'),
          amount: (value) => {
            if (value.match(this.PERCENT_QUANTITY_REGEX) === null) {
              return 'Incorrect format';
            }

            const number = parseFloat(value);

            if (number === 0) {
              return 'Amount should be greater than zero';
            } if (number > this.convertToPercent(this.researchToken.amount)) {
              return 'Amount is greater than research token balance';
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
      changeResearch(id) {
        if (_.isNumber(id)) {
          this.$emit('researchChanged', id);
        }
      },
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
        this.form.amount = '';
      },
      sendTokens() {
        if (this.$refs.form.validate()) {
          this.isSending = true;

          deipRpc.broadcast.transferResearchTokensAsync(
            this.user.privKey,
            this.researchId,
            this.user.username,
            this.form.to,
            this.toDeipPercent(this.form.amount)
          ).then((data) => {
            this.$emit('researchTokensTransfered');
            this.clearForm();

            this.$store.dispatch('layout/setSuccess', {
              message: 'Amount of research tokens was successfully sent'
            });

            return data;
          }).catch((err) => {
            this.$store.dispatch('layout/setError', {
              message: 'Transaction was failed'
            });
            console.error(err);
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
