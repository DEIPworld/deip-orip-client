<template>
  <base-page-layout>
    <content-block
      :max-width="800"
      title="Change password"
    >
      <v-form
        ref="changePasswordForm"
        v-model="isMasterPasswordFormValid"
        @submit.prevent
      >
        <v-text-field
          v-model="oldPassword"
          :rules="[rules.required]"
          label="Old password / Private Key"
          solo
          :disabled="isPasswordChanging"
          :append-icon="isHiddenOldPassword ? 'visibility_off' : 'visibility'"
          :type="isHiddenOldPassword ? 'password' : 'text'"
          @click:append="isHiddenOldPassword = !isHiddenOldPassword"
        />
        <v-text-field
          v-model="newPassword"
          :rules="[rules.required, rules.masterPassword]"
          label="New password"
          solo
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
          label="Re-Enter New password"
          solo
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
          Change Password
        </v-btn>
      </v-form>
    </content-block>
  </base-page-layout>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import { AccessService } from '@deip/access-service';
  import { UserService } from '@deip/user-service';

  import ContentBlock from '@/components/layout/components/ContentBlock';

  const accessService = AccessService.getInstance();
  const userService = UserService.getInstance();

  export default {
    name: 'ChangePassword',
    components: { ContentBlock },
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
          required: (value) => !!value || 'This field is required',
          masterPassword: (value) => {
            if (!value) return false;

            if (value.length < this.MASTER_PASSWORD_MIN_LENGTH) {
              return 'Master password should be at least 10 symbols';
            } if (value.length > this.MASTER_PASSWORD_MAX_LENGTH) {
              return 'Master password max length is 100 symbols';
            }

            return true;
          },
          reEnterMasterPassword: (value) => value === this.newPassword || 'Password doesn\'t match'
        }
      };
    },

    computed: {
      ...mapGetters({
        currentUser: 'auth/user'
      })
    },

    methods: {
      updateMasterPassword() {
        const { username } = this.currentUser;

        let oldPrivateKey;
        if (
          deipRpc.auth.isWif(this.oldPassword)
          && deipRpc.auth.wifToPublic(this.oldPassword) === this.currentUser.pubKey
        ) { // if old private key is entered
          oldPrivateKey = this.oldPassword;
        } else { // if old password is entered or old password is in private key format
          oldPrivateKey = deipRpc.auth.toWif(
            username,
            this.oldPassword,
            'owner'
          );
          const oldPublicKey = deipRpc.auth.wifToPublic(oldPrivateKey);
          if (this.currentUser.pubKey !== oldPublicKey) {
            this.$store.dispatch('layout/setError', {
              message: 'Old password is invalid'
            });
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
        userService.updateUserAccountViaOffchain(oldPrivateKey, {
            account: username,
            accountOwnerAuth: ownerAuth,
            accountActiveAuth: ownerAuth,
            accountPostingAuth: ownerAuth,
            accountMemoPubKey: undefined,
            accountJsonMetadata: undefined,
            accountExtensions: []
          }
        ).then(() => {
          this.$store.dispatch('layout/setSuccess', {
            message: 'Master Password successfully changed!'
          });
          this.$refs.changePasswordForm.reset();

          accessService.setOwnerWif(newPrivateKey);
          return this.$store.dispatch('auth/loadUser');
        }).catch((err) => {
          this.$store.dispatch('layout/setError', {
            message: 'Oops! Something went wrong. Please try again later'
          });
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
