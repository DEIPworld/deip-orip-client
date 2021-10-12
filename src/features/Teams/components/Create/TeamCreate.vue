<template>
  <team-form
    :title="$t('adminRouting.projects.create')"
    :loading="loading"
    :layout-schema="layoutSchema"
    @submit="createTeam"
  />
</template>

<script>
  import { TeamService } from '@deip/team-service';
  import { parseFormData, extendAttrModules } from '@/utils/helpers';
  import TeamForm from '@/features/Teams/components/Form/TeamForm';

  const teamService = TeamService.getInstance();

  export default {
    name: 'TeamCreate',
    components: { TeamForm },
    data() {
      return {
        loading: false
      };
    },
    computed: {
      layoutSchema() {
        return extendAttrModules(this.$tenantSettings.layouts.teamCreateForm.layout);
      }
    },
    methods: {
      createTeam(formData) {
        this.loading = true;
        const {
          onchainData: { name, members },
          offchainMeta: { attributes }
        } = parseFormData(formData);
        teamService
          .createTeam({
            initiator: {
              username: this.$currentUser.username,
              privKey: this.$currentUser.privKey,
              memoKey: this.$currentUser.account.memo_key
            },
            formData,
            members: members.filter((m) => m !== this.$currentUser.username),
            attributes
          })
          .then((res) => {
            this.loading = false;
            this.$store.dispatch('Teams/getUserTeams', this.$currentUser.username);
            this.$notifier.showSuccess(this.$t('createResearchGroup.successCreate', { name }));
            const { entityId: teamId } = res;

            return Promise.all([
              teamService.getTeam(teamId)
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
