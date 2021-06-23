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
  import { extendAttrModules, expandAttributes, parseFormData } from '@/utils/helpers';
  import TeamForm from '@/features/Teams/components/Form/TeamForm';
  import { mapGetters } from 'vuex';
  import { TeamService } from '@deip/team-service';

  const teamService = TeamService.getInstance();

  export default {
    name: 'TeamCreate',
    components: { TeamForm },
    data() {
      return {
        loading: false
      }
    },
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

        const { onchainData: { name }, offchainMeta: { attributes } } = parseFormData(formData);

        const isProposal = !this.team.isPersonal;
        teamService.updateTeam(
          this.$currentUser,
          {
            updater: this.$currentUser.username,
            teamId: this.team.externalId,
            accountOwnerAuth: undefined,
            accountActiveAuth: undefined,
            memoKey: undefined,
            attributes,
            formData
          },
          { isProposal }
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
