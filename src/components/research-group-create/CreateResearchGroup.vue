<template>
  <full-screen-view :title="$t('createResearchGroup.title')">
    <create-research-group-form
      v-model="formData"
      :disabled="formProcessing"
      :loading="formProcessing"
      @submit="finish"
    />
  </full-screen-view>
</template>

<script>
  import { ResearchGroupService } from '@deip/research-group-service';
  import { TeamService } from '@deip/team-service';
  import { CreateResearchGroupMixin } from '@/components/research-group-create/CreateResearchGroupMixin';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';
  import CreateResearchGroupForm from './components/CreateResearchGroupForm';

  const teamService = TeamService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'CreateResearchGroup',
    components: { FullScreenView, CreateResearchGroupForm },
    mixins: [CreateResearchGroupMixin],

    methods: {
      finish(success) {
        if (!success) return;

        this.formProcessing = true;

        const invitees = this.formData.members
          .filter((m) => m.account.name !== this.user.username)
          .map((m) => ({
            account: m.account.name,
            rgt: m.stake * this.DEIP_1_PERCENT,
            notes: ''
          }));

        const creator = this.user.username;
        const memo = this.user.account.memo_key;
        const auth = {
          account_auths: [[creator, 1]],
          key_auths: [],
          weight_threshold: 1
        };

        researchGroupService.createResearchGroup(
          this.user.privKey,
          {
            fee: this.toAssetUnits(0),
            creator: creator,
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
            this.formProcessing = false;
            this.$store.dispatch('auth/loadGroups'); // reload user groups
            this.$notifier.showSuccess(this.$t('createResearchGroup.successCreate', { name: this.formData.name }));
            const { 'external_id': researchGroupExternalId } = res;
            const invitesPromises = invitees.map((invitee) => researchGroupService.createResearchGroupInvite(
              { privKey: this.user.privKey, username: this.user.username },
              {
                researchGroup: researchGroupExternalId,
                member: invitee.account,
                rewardShare: '0.00 %',
                researches: [],
                extensions: []
              },
              {
                notes: this.$t('createResearchGroup.note', { name: this.formData.name }),
              }
            ));

            return Promise.all([
              Promise.all(invitesPromises),
              teamService.getTeam(researchGroupExternalId),
              this.$store.dispatch('auth/loadGroups')
            ]);
          })
          .then(([invites, researchGroup]) => {
            if (!this.backRouterToken) {
              this.$router.push({
                name: 'team.details',
                params: {
                  teamId: researchGroup.external_id
                }
              });
            } else {
              if (this.backRouterToken.name === 'project.create') {
                this.backRouterToken.query.externalId = researchGroup.external_id;
              }
              this.$router.push(this.backRouterToken);
            }
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

<style lang="less">
.flex-column {
  flex-direction: column;
}

.flex-grow-0 {
  flex-grow: 0 !important;
}

.flex-grow-1 {
  flex-grow: 1 !important;
}

.w-100 {
  width: 100%;
}

.flex-basis-0 {
  flex-basis: 0 !important;
}
</style>
