<template>
  <layout-section>
    <content-block
      :max-width="800"
      :title="$t('account.password.title')"
      centered
    >
      <v-form
        ref="changePasswordForm"
        v-model="isMasterPasswordFormValid"
        @submit.prevent
      >
        <v-text-field
          v-model="oldPassword"
          :rules="[rules.required]"
          :label="$t('account.password.oldPasswordField')"
          outlined
          :disabled="isPasswordChanging"
          :append-icon="isHiddenOldPassword ? 'visibility_off' : 'visibility'"
          :type="isHiddenOldPassword ? 'password' : 'text'"
          @click:append="isHiddenOldPassword = !isHiddenOldPassword"
        />
        <v-text-field
          v-model="newPassword"
          :rules="[rules.required, rules.masterPassword]"
          :label="$t('account.password.newPasswordField')"
          outlined
          :disabled="isPasswordChanging"
          :append-icon="isHiddenNewPassword ? 'visibility_off' : 'visibility'"
          :type="isHiddenNewPassword ? 'password' : 'text'"
          @click:append="isHiddenNewPassword = !isHiddenNewPassword"
          @input="$refs.reEnterNewPassword.validate()"
        />
        <v-text-field
          ref="reEnterNewPassword"
          v-model="reEnterNewPassword"
          :rules="[rules.required, rules.reEnterMasterPassword]"
          :label="$t('account.password.reEnterPasswordField')"
          outlined
          :disabled="isPasswordChanging"
          :append-icon="isHiddenReEnterNewPassword ? 'visibility_off' : 'visibility'"
          :type="isHiddenReEnterNewPassword ? 'password' : 'text'"
          @click:append="isHiddenReEnterNewPassword = !isHiddenReEnterNewPassword"
        />
        <v-btn
          type="submit"
          block
          color="primary"
          :disabled="!isMasterPasswordFormValid || isPasswordChanging"
          :loading="isPasswordChanging"
          @click="updateMasterPassword()"
        >
          {{ $t('account.password.submitBtn') }}
        </v-btn>
      </v-form>
    </content-block>
  </layout-section>
</template>

<script>
  import { AccessService } from '@deip/access-service';
  import { UserService } from '@deip/user-service';
  import { AuthService } from '@deip/auth-service';
  import ContentBlock from '@/components/layout/components/ContentBlock';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  const accessService = AccessService.getInstance();
  const userService = UserService.getInstance();
  const authService = AuthService.getInstance();

  export default {
    name: 'AccountPassword',
    components: { LayoutSection, ContentBlock },
    data() {
      return {
        oldPassword: '',
        isHiddenOldPassword: true,
        newPassword: '',
        isHiddenNewPassword: true,
        reEnterNewPassword: '',
        isHiddenReEnterNewPassword: true,
        isMasterPasswordFormValid: false,
        isPasswordChanging: false,

        rules: {
          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required'),
          masterPassword: (value) => {
            if (!value) return false;

            if (value.length < this.MASTER_PASSWORD_MIN_LENGTH) {
              return this.$t('defaultNaming.fieldRules.masterPasswordMinLength');
            } if (value.length > this.MASTER_PASSWORD_MAX_LENGTH) {
              return this.$t('defaultNaming.fieldRules.masterPasswordMaxLength');
            }

            return true;
          },
          reEnterMasterPassword: (value) => value === this.newPassword || this.$t('defaultNaming.fieldRules.reEnterMasterPassword')
        }
      };
    },

    methods: {

      updateMasterPassword() {
        const { username, pubKey } = this.$currentUser;
        this.isPasswordChanging = true;

        let oldPublicKey;
        let oldPrivateKey;

        let newPublicKey;
        let newPrivateKey;

        return authService.generateSeedAccount(username, this.oldPassword)
          .then((oldSeedAccount) => {
            oldPublicKey = oldSeedAccount.getPubKey();
            oldPrivateKey = oldSeedAccount.getPrivKey();

            if (pubKey !== oldPublicKey) 
              throw new Error('Old password is invalid');

            return authService.generateSeedAccount(username, this.newPassword);
          })
          .then((newSeedAccount) => {
            newPublicKey = newSeedAccount.getPubKey();
            newPrivateKey = newSeedAccount.getPrivKey();

            const ownerAuth = {
              weight_threshold: 1,
              account_auths: [],
              key_auths: [[newPublicKey, 1]]
            };

            return userService.updateUser({
              initiator: {
                privKey: oldPrivateKey,
                username
              },
              ...this.$currentUser.profile,
              accountOwnerAuth: ownerAuth,
              memoKey: undefined
            })
          })
          .then(() => {
            this.$notifier.showSuccess(this.$t('account.password.succChanged'));
            this.$refs.changePasswordForm.reset();

            accessService.setOwnerKeysPair(newPrivateKey, newPublicKey);
            return this.$store.dispatch('Users/get', username, { root: true });
          })
          .catch((err) => {
            this.$notifier.showError(this.$t('account.password.errChaged'));
            console.error(err.message);
          })
          .finally(() => {
            this.isPasswordChanging = false;
          });
      }
    }
  };
</script>

<style lang="less" scoped>
  .cp-page {
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
