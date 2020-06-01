<template>
  <full-screen-view title="Create research group">
    <create-research-group-form
      v-model="formData"
      :disabled="formProcessing"
      :loading="formProcessing"
      @submit="finish"
    />
  </full-screen-view>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { ResearchGroupService } from '@deip/research-group-service';

  import { CreateResearchGroupMixin } from '@/components/research-group-create/CreateResearchGroupMixin';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';
  import CreateResearchGroupForm from './components/CreateResearchGroupForm';

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
          .filter((m) => m.account.name != this.user.username)
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

        researchGroupService
          .createResearchGroupViaOffchain(
            this.user.privKey,
            {
              fee: this.toAssetUnits(100),
              creator,
              accountOwnerAuth: auth,
              accountActiveAuth: auth,
              accountPostingAuth: auth,
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
            this.$store.dispatch('layout/setSuccess', {
              message: `"${this.formData.name}" research group has been created successfully !`
            });

            const invitesPromises = invitees.map((invitee) =>
              researchGroupService.createResearchGroupInviteViaOffchain(
                this.user.privKey,
                {
                  researchGroup: res.rm._id,
                  member: invitee.account,
                  rewardShare: `0.00 %`,
                  researches: undefined, // all researches
                  extensions: []
                },
                {
                  notes: `${this.formData.name} invites you to join them`,
                  approver: this.user.username
                }
              )
            );

            return Promise.all([
              Promise.all(invitesPromises),
              deipRpc.api.getResearchGroupAsync(res.rm._id)
            ]);
          })
          .then(([invites, researchGroup]) => {
            if (!this.backRouterToken) {
              this.$router.push({
                name: 'ResearchGroupDetails',
                params: {
                  research_group_permlink: encodeURIComponent(
                    researchGroup.permlink
                  )
                }
              });
            } else {
              if (this.backRouterToken.name === 'CreateResearch') {
                this.backRouterToken.query.groupPermlink = researchGroup.permlink;
              }
              this.$router.push(this.backRouterToken);
            }
          })
          .catch((err) => {
            console.error(err);
            this.formProcessing = false;
            this.$store.dispatch('layout/setError', {
              message:
                'An error occurred while creating Research Group, please try again later'
            });
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
