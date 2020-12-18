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
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import { AccessService } from '@deip/access-service';
  import { UserService } from '@deip/user-service';

  import ContentBlock from '@/components/layout/components/ContentBlock';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  const accessService = AccessService.getInstance();
  const userService = UserService.getInstance();

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
        const { username } = this.$currentUser;

        let oldPrivateKey;
        if (
          deipRpc.auth.isWif(this.oldPassword)
          && deipRpc.auth.wifToPublic(this.oldPassword) === this.$currentUser.pubKey
        ) { // if old private key is entered
          oldPrivateKey = this.oldPassword;
        } else { // if old password is entered or old password is in private key format
          oldPrivateKey = deipRpc.auth.toWif(
            username,
            this.oldPassword,
            'owner'
          );
          const oldPublicKey = deipRpc.auth.wifToPublic(oldPrivateKey);
          if (this.$currentUser.pubKey !== oldPublicKey) {
            this.$notifier.showError('Old password is invalid');
            return;
          }
        }

        const {
          owner: newPrivateKey,
          ownerPubkey: newPublicKey
        } = deipRpc.auth.getPrivateKeys(
          username,
          this.newPassword,
          ['owner']
        );
        const ownerAuth = {
          weight_threshold: 1,
          account_auths: [],
          key_auths: [[newPublicKey, 1]]
        };

        this.isPasswordChanging = true;
        userService.updateUserAccount(oldPrivateKey, {
          account: username,
          accountOwnerAuth: ownerAuth,
          accountActiveAuth: ownerAuth,
          accountMemoPubKey: undefined,
          accountJsonMetadata: undefined,
          accountExtensions: []
        }).then(() => {
          this.$notifier.showSuccess('Master Password successfully changed!');
          this.$refs.changePasswordForm.reset();

          accessService.setOwnerWif(newPrivateKey);
          return this.$store.dispatch('auth/loadUser');
        }).catch((err) => {
          this.$notifier.showError('Oops! Something went wrong. Please try again later');
          console.error(err.message);
        }).finally(() => {
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
