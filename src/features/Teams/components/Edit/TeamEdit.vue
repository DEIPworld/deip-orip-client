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
  import { mapGetters } from 'vuex';
  import { TeamService } from '@deip/team-service';
  import { extendAttrModules, expandAttributes, parseFormData } from '@/utils/helpers';
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

        const { onchainData: { name }, offchainMeta: { attributes }, ...filesMap } = parseFormData(formData);
        const filesData = {};

        for (const attrId in filesMap) {
          if (Object.prototype.hasOwnProperty.call(filesMap, attrId)) {
            filesData[attrId] = {
              attributeId: attrId,
              [attrId]: filesMap[attrId]
            };
          }
        }

        const isProposal = !this.team.isPersonal;
        teamService.updateTeam(
          {
            entityId: this.team.externalId,
            initiator: {
              username: this.$currentUser.username,
              privKey: this.$currentUser.privKey
            },
            proposalInfo: { isProposal },
            ownerAuth: undefined,
            attributes,
            ...filesData
          }
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
          }
          // hash: proposal ? '#proposals' : ''
        });
      }
    }
  };
</script>
