<template>
  <team-form
    :title="$t('adminRouting.projects.create')"
    :loading="loading"
    :layout-schema="layoutSchema"
    @submit="createTeam"
  />
</template>

<script>
  import { parseFormData, extendAttrModules } from '@/utils/helpers';
  import TeamForm from '@/features/Teams/components/Form/TeamForm';
  import { ResearchGroupService } from '@deip/research-group-service';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'TeamCreate',
    components: { TeamForm },
    computed: {
      layoutSchema() {
        return extendAttrModules(
          this.$tenantSettings.layouts.teamCreateForm.layout
        );
      }
    },
    methods: {
      createTeam(formData) {
        this.loading = true;

        const { onchainData: { name } } = parseFormData(formData);

        const auth = {
          account_auths: [[this.$currentUser.username, 1]],
          key_auths: [],
          weight_threshold: 1
        };

        researchGroupService.createResearchGroup(
          this.$currentUser.privKey,
          {
            fee: this.toAssetUnits(0),
            creator: this.$currentUser.username,
            accountOwnerAuth: auth,
            accountActiveAuth: auth,
            accountMemoPubKey: this.$currentUser.account.memo_key,
            accountJsonMetadata: undefined,
            accountExtensions: []
          },
          formData
        )
          .then((res) => {
            // this.formProcessing = false;
            // this.$store.dispatch('auth/loadGroups'); // reload user groups
            // this.$notifier.showSuccess(this.$t('createResearchGroup.successCreate', { name }));
            const { 'external_id': researchGroupExternalId } = res;
            // const invitesPromises = invitees.map((username) => researchGroupService.createResearchGroupInvite(
            //   { privKey: this.$currentUser.privKey, username: this.$currentUser.username },
            //   {
            //     researchGroup: researchGroupExternalId,
            //     member: username,
            //     rewardShare: '0.00 %',
            //     researches: [],
            //     extensions: []
            //   },
            //   {
            //     notes: this.$t('createResearchGroup.note', { name }),
            //   }
            // ));

            return Promise.all([
              // Promise.all(invitesPromises),
              researchGroupService.getResearchGroup(researchGroupExternalId),
              // this.$store.dispatch('auth/loadGroups')
            ]);
          })
          .then(([researchGroup]) => {
            this.$router.push({
              name: 'team.details',
              params: {
                teamId: researchGroup.external_id
              }
            });
          })
          .catch((err) => {
            console.error(err);
            this.isLoading = false;
            this.$notifier.showError(this.$t('createResearchGroup.errCreate'));
          });
      }
    }
  };
</script>
