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
        return extendAttrModules(this.$portalSettings.layouts.teamCreateForm.layout);
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
              privKey: this.$currentUser.privKey
            },
            formData,
            members: members.filter((m) => m !== this.$currentUser.username),
            attributes
          })
          .then(({ data: res }) => {
            this.loading = false;
            this.$store.dispatch('Teams/getUserTeams', this.$currentUser.username);
            this.$notifier.showSuccess(this.$t('createTeam.successCreate', { name }));
            const { entityId: teamId } = res;

            return Promise.all([
              teamService.getTeam(teamId)
            ]);
          })
          .then(([{ data: team }]) => {
            this.$router.push({
              name: 'team.details',
              params: {
                teamId: team._id
              }
            });
          })
          .catch((err) => {
            console.error(err);
            this.loading = false;
            this.$notifier.showError(this.$t('createTeam.errCreate'));
          });
      }
    }
  };
</script>
