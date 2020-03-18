<template>
  <v-container fluid fill-height pa-0 ma-0>
    <v-card tile flat class="full-height full-width">
      <v-layout row wrap class="pkd-page py-4">
        <v-flex xs12 class="glass-container py-4">
          <p class="pkd-page__header py-2">Download private key</p>
        </v-flex>
        <v-flex xs8 class="glass-container py-4">
          <v-form
            v-model="isConfirmPasswordFormValid"
            ref="confirmPasswordForm"
            @submit.prevent
          >
            <v-text-field
              v-model="masterPassword"
              :rules="[rules.required, rules.masterPassword]"
              label="Password / Private Key"
              solo
              :append-icon="isHiddenPassword ? 'visibility_off' : 'visibility'"
              :type="isHiddenPassword ? 'password' : 'text'"
              @click:append="isHiddenPassword = !isHiddenPassword"
            />
            <v-btn
              type="submit"
              block
              color="primary"
              :disabled="!isConfirmPasswordFormValid"
              @click="downloadPrivateKey()"
            >Download Private Key (PDF)
            </v-btn>
          </v-form>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import { saveKeysPdf } from '@/utils/saveKeysPdf';

  export default {
    name: 'PrivateKeyDownload',

    data() {
      return {
        isConfirmPasswordFormValid: false,
        masterPassword: '',
        isHiddenPassword: true,

        rules: {
          required: value => !!value || 'This field is required',
          masterPassword: (value) => {
            if (!value) return false;

            if (value.length < this.MASTER_PASSWORD_MIN_LENGTH) {
              return 'Master password is at least 10 symbols';
            } else if (value.length > this.MASTER_PASSWORD_MAX_LENGTH) {
              return 'Master password max length is 100 symbols';
            }

            return true;
          },
        },
      };
    },

    computed: {
      ...mapGetters({
        currentUser: 'auth/user',
      }),
    },

    methods: {
      downloadPrivateKey() {
        const username = this.currentUser.username;
        let ownerPrivateKey;
        if (deipRpc.auth.isWif(this.masterPassword)) {
          ownerPrivateKey = this.masterPassword;
        } else {
          ownerPrivateKey = deipRpc.auth.toWif(
            username,
            this.masterPassword,
            'owner'
          );
        }

        const ownerPublicKey = deipRpc.auth.wifToPublic(ownerPrivateKey);
        if (this.currentUser.pubKey !== ownerPublicKey) {
          this.$store.dispatch('layout/setError', {
            message: `Password is invalid`
          });
          return;
        }

        saveKeysPdf(username, { ownerPrivateKey, ownerPublicKey });
      }
    }
  };
</script>

<style lang="less" scoped>
  .pkd-page {
    font-family: Muli;
    font-style: normal;
    color: #000000;

    &__header {
      font-weight: 900;
      font-size: 36px;
      line-height: 45px;
      letter-spacing: 0.25px;
    }
  }
</style>
