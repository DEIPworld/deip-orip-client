<template>
  <d-layout-full-screen>
    <d-form @submit="onSubmit">
      <d-stack>
        <v-text-field
          v-model="formData.name"
          outlined
          label="Title"
          :rules="[rules.required, rules.titleLength]"
          hint="Name of your team"
        />

        <v-textarea
          v-model="formData.description"
          name="Description"
          label="Description"
          outlined
          auto-grow
          :rules="[rules.required, rules.descriptionLength]"
        />


      </d-stack>
    </d-form>
  </d-layout-full-screen>
</template>

<script>
  import { ResearchGroupService } from '@deip/research-group-service';

  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import DForm from '@/components/Deipify/DForm/DForm';
  import DStack from '@/components/Deipify/DStack/DStack';
  import { maxDescriptionLength, maxTitleLength } from '@/variables';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'GroupEdit',
    components: { DStack, DForm, DLayoutFullScreen },
    data() {
      return {
        formProcessing: false,

        formData: {
          name: '',
          description: '',
          members: []
        },

        rules: {
          required: (value) => !!value || 'This field is required',
          titleLength: (value) => value.length <= maxTitleLength || `Title max length is ${maxTitleLength} symbols`,
          descriptionLength: (value) => value.length <= maxDescriptionLength || `Description max length is ${maxDescriptionLength} symbols`
        }
      };
    },
    methods: {
      createGroup() {
        const creator = this.$currentUser.username;
        const memo = this.$currentUser.pubKey;
        const auth = {
          account_auths: [[creator, 1]],
          key_auths: [],
          weight_threshold: 1
        };

        return researchGroupService.createResearchGroup(
          this.$currentUser.privKey,
          {
            fee: this.toAssetUnits(0),
            creator,
            accountOwnerAuth: auth,
            accountActiveAuth: auth,
            accountMemoPubKey: memo,
            accountJsonMetadata: undefined,
            accountExtensions: []
          },
          {
            researchGroupName: this.formData.name,
            researchGroupDescription: this.formData.description,
            researchGroupThresholdOverrides: []
          }
        )
          .then((res) => {
            this.$store.dispatch('auth/loadGroups'); // reload user groups
            this.$notifier.showSuccess(this.$t('notifier.teamCreatedSuccess', { team: this.formData.name }));

            return res;
          })
          .catch((err) => {
            console.error(err);
            this.isLoading = false;
            this.$notifier.showError('An error occurred while creating Project Group, please try again later');
          });
      },

      sendInvites() {

      },

      onSubmit(valid) {
        if (valid) {
          this.createGroup()
            .then(() => {

            });
        }
      }
    }
  };
</script>
