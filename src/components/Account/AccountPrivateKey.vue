<template>
  <layout-section>
    <content-block
      :max-width="800"
      title="Download private key"
      centered
    >
      <v-form
        ref="confirmPasswordForm"
        v-model="isConfirmPasswordFormValid"
        @submit.prevent
      >
        <v-text-field
          v-model="masterPassword"
          :rules="[rules.required, rules.masterPassword]"
          label="Password / Private Key"
          outlined
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
        >
          Download Private Key (PDF)
        </v-btn>
      </v-form>
    </content-block>
  </layout-section>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import { saveKeysPdf } from '@/utils/saveKeysPdf';
  import ContentBlock from '@/components/layout/components/ContentBlock';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'AccountPrivateKey',
    components: { LayoutSection, ContentBlock },
    data() {
      return {
        isConfirmPasswordFormValid: false,
        masterPassword: '',
        isHiddenPassword: true,

        rules: {
          required: (value) => !!value || 'This field is required',
          masterPassword: (value) => {
            if (!value) return false;

            if (value.length < this.MASTER_PASSWORD_MIN_LENGTH) {
              return 'Master password is at least 10 symbols';
            } if (value.length > this.MASTER_PASSWORD_MAX_LENGTH) {
              return 'Master password max length is 100 symbols';
            }

            return true;
          }
        }
      };
    },

    computed: {
      ...mapGetters({
        currentUser: 'auth/user'
      })
    },

    methods: {
      downloadPrivateKey() {
        const { username } = this.currentUser;
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
          this.$notifier.showError('Password is invalid')
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
