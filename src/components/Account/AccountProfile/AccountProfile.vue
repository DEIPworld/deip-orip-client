<template>
  <d-layout-full-screen :title="$t('account.profile.title')">
    <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
      <v-form :disabled="isLoading" @submit.prevent="handleSubmit(onSubmit)">
        <account-form-renderer
          v-model="formModel"
          :schema="layoutSchema"
        />
        <v-divider class="mt-8 mb-6" />
        <div class="d-flex justify-end align-center">
          <d-stack horizontal :gap="8">
            <v-btn
              text
              color="primary"
              :disabled="isLoading"
              @click="$router.back()"
            >
              Cancel
            </v-btn>

            <v-btn
              type="submit"
              color="primary"
              :disabled="isDisabled || invalid"
              :loading="isLoading"
            >
              {{ $t('account.profile.form.submitBtn') }}
            </v-btn>
          </d-stack>
        </div>
      </v-form>
    </validation-observer>
  </d-layout-full-screen>
</template>

<script>
  import { ValidationObserver } from 'vee-validate';
  import { UserService } from '@deip/user-service';

  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import DStack from '@/components/Deipify/DStack/DStack';

  import AccountFormRenderer from '@/components/Account/AccountProfile/renderer';

  import { changeable } from '@/mixins/changeable';

  import {
    camelizeObjectKeys,
    compactAttributes,
    extendAttrModules,
    extractFilesFromAttributes,
    isArray, replaceFileWithName, hasValue, expandAttributes
  } from '@/utils/helpers';

  import { attributesChore } from '@/mixins/chores/attributesChore';

  import { debounce } from 'vuetify/lib/util/helpers';

  import { mapGetters } from 'vuex';
  import { ATTR_TYPES } from '@/variables';

  const userService = UserService.getInstance();

  export default {
    name: 'AccountProfile',

    components: {
      ValidationObserver,

      DStack,
      DLayoutFullScreen,

      AccountFormRenderer
    },

    mixins: [changeable, attributesChore],

    data() {
      return {
        lazyFormModel: {
          attributes: {}
        },
        isLoading: false,
        disabled: false
      };
    },

    computed: {
      formModel: {
        get() {
          return this.lazyFormModel;
        },

        set(val) {
          this.lazyFormModel = val;
        }
      },

      layoutSchema() {
        const schema = this.$tenantSettings.layouts.accountProfile.layout;
        return extendAttrModules(
          schema
        );
      },

      isDisabled() {
        return this.isLoading
          || this.disabled
          || !this.$$isChanged(this.formModel);
      }
    },

    created() {
      this.formModel = {
        ...this.formModel,
        ..._.cloneDeep(this.$currentUser.profile),
        attributes: {
          ...expandAttributes(this.$currentUser.profile.attributes)
        }
      };
      this.$$storeCache(this.formModel);
    },

    methods: {
      onSubmit() {
        this.isLoading = true;

        const formData = new FormData();

        const attachedFiles = extractFilesFromAttributes(this.formModel.attributes)

        const update = {
          ...this.$currentUser.profile,
          ...this.formModel,
          attributes: compactAttributes(
            replaceFileWithName(this.formModel.attributes),
            'attributeId'
          )
        };

        formData.append('profile', JSON.stringify(update));

        for (const file of attachedFiles) {
          formData.append(...file);
        }

        userService.updateUserProfile(this.$currentUser.username, formData)
          .then((res) => {
            this.$store.dispatch('auth/loadUser');

            this.$notifier.showSuccess('Personal info has been saved successfully!');
          })
          .then(() => this.$router.push('/account'))
          .catch((err) => {
            this.$notifier.showError('An error occurred while saving, please try again later');
            console.error(err);
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    }
  };
</script>
