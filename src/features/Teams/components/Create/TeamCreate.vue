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
      layoutSchema() {
        return extendAttrModules(
          this.$tenantSettings.layouts.teamCreateForm.layout
        );
      }
    },
    methods: {
      createTeam(formData) {
        this.loading = true;

        const { onchainData: { name }, offchainMeta: { attributes } } = parseFormData(formData);

        teamService.createTeam(
          this.$currentUser.privKey,
          {
            creator: this.$currentUser.username,
            memoKey: this.$currentUser.account.memo_key,
            formData,
            attributes
          }
        )
          .then((res) => {
            this.loading = false;
            this.$store.dispatch('Teams/getUserTeams', this.$currentUser.username)
            this.$notifier.showSuccess(this.$t('createResearchGroup.successCreate', { name }));
            const { model: { entityId: teamId } } = res;
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
              teamService.getTeam(teamId),
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
            this.loading = false;
            this.$notifier.showError(this.$t('createResearchGroup.errCreate'));
          });
      }
    }
  };
</script>
