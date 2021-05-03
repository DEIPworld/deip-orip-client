<template>
  <team-form
    :team="teamExtended"
    :title="$t('adminRouting.projects.create')"
    :loading="loading"
    :layout-schema="layoutSchema"
    @submit="editTeam"
  />
</template>

<script>
  import { extendAttrModules, expandAttributes } from '@/utils/helpers';
  import TeamForm from '@/features/Teams/components/Form/TeamForm';
  import { mapGetters } from 'vuex';
  import { ResearchGroupService } from '@deip/research-group-service';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'TeamCreate',
    components: { TeamForm },
    computed: {
      ...mapGetters({
        team: 'Team/teamDetails'
      }),
      layoutSchema() {
        return extendAttrModules(
          this.$tenantSettings.layouts.teamEditForm.layout
        );
      },
      teamExtended() {
        return {
          ...this.team,
          ...{
            researchGroupRef: {
              ...this.team.researchGroupRef,
              ...{ attributes: expandAttributes(this.team.researchGroupRef.attributes) }
            }
          }
        };
      }
    },
    methods: {
      editTeam(formData) {
        this.loading = true;

        const isProposal = !this.team.isPersonal;
        researchGroupService.updateResearchGroupAccount(
          { privKey: this.$currentUser.privKey, username: this.$currentUser.username },
          isProposal,
          {
            researchGroupExternalId: this.team.externalId,
            accountOwnerAuth: undefined,
            accountActiveAuth: undefined,
            accountActiveAuthOverrides: undefined,
            accountMemoPubKey: undefined,
            accountJsonMetadata: undefined,
            accountExtensions: []
          },
          formData
        )
          .then(() => {
            this.$notifier.showSuccess(this.$t('researchGroupSettings.dataForm.successProposal'));
            this.cancel(isProposal);
          })
          .catch((err) => {
            console.error(err);

            this.$notifier.showError(this.$t('researchGroupSettings.dataForm.errProposal'));
          })
          .finally(() => {
            this.loading = false;
            this.cancel();
          });
      },
      cancel(proposal = false) {
        this.$router.push({
          name: 'team.details',
          params: {
            teamId: this.team.externalId
          },
          // hash: proposal ? '#proposals' : ''
        });
      }
    }
  };
</script>
