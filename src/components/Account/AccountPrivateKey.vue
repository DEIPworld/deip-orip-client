<template>
  <layout-section>
    <content-block
      :max-width="800"
      :title="$t('account.privateKey.title')"
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
          :label="$t('account.privateKey.passwordField')"
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
          {{ $t('account.privateKey.downloadBtn') }}
        </v-btn>
      </v-form>
    </content-block>
  </layout-section>
</template>

<script>
  import { saveKeysPdf } from '@/utils/saveKeysPdf';
  import ContentBlock from '@/components/layout/components/ContentBlock';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import { AuthService } from '@deip/auth-service';

  const authService = AuthService.getInstance();


  export default {
    name: 'AccountPrivateKey',
    components: { LayoutSection, ContentBlock },
    data() {
      return {
        isConfirmPasswordFormValid: false,
        masterPassword: '',
        isHiddenPassword: true,

        rules: {
          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required'),
          masterPassword: (value) => {
            if (!value) return false;

            if (value.length < this.MASTER_PASSWORD_MIN_LENGTH) {
              return 'Master password is at least 10 symbols';
            } if (value.length > this.MASTER_PASSWORD_MAX_LENGTH) {
              return this.$t('defaultNaming.fieldRules.masterPasswordMaxLength');
            }

            return true;
          }
        }
      };
    },

    methods: {
      downloadPrivateKey() {
        const { username, pubKey } = this.$currentUser;
        let ownerPrivKey;
        let ownerPubKey;

        return authService.generateSeedAccount(username, this.masterPassword)
          .then((seedAccount) => {
            ownerPubKey = seedAccount.getPubKey();
            ownerPrivKey = seedAccount.getPrivKey();
            if (pubKey !== ownerPubKey) {
              this.$notifier.showError('Password is invalid');
              return;
            }
            saveKeysPdf(username, { ownerPrivKey, ownerPubKey });
          });
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
