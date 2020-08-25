<template>
  <div>
    <v-data-table
      :headers="pendingMembersHeaders"
      :items="items"
      disable-sort
      :hide-default-footer="items.length < 50"
      :items-per-page="50"
    >
      <template #item.researcher="{item}">
        <member-list-title :member="item" :desc-max-lines="1" class="py-4" />
      </template>
      <template #item.expertiseStats.eci="{item}">
        <span class="text-caption font-weight-medium">
          {{ item.expertiseStats.eci | commaNumber }}
        </span>
      </template>
      <template #item.expertiseStats.percentile_rank="{item}">
        <span class="text-caption font-weight-medium">
          {{ item.expertiseStats.percentile_rank }}
        </span>
      </template>
      <template #item.expertiseStats.growth_rate="{item}">
        <span class="text-caption" :class="$options.filters.numDirClass(item.expertiseStats.growth_rate)">
          {{ item.expertiseStats.growth_rate | numDir }}
        </span>
      </template>
      <template #item.expertise="{item}">
        <span v-for="(discipline, i) in item.expertise" :key="i" class="text-caption text--secondary">{{ discipline.discipline_name }}{{ i + 1 < item.expertise.length ? ' · ' : '' }}</span>
      </template>
      <template #item.created="{item}">
        <span class="text-body-2">
          {{ item.created | dateFormat('D MMM YYYY') }}
        </span>
      </template>
      <template #item.location="{item}">
        <span class="text-body-2">
          {{ item | userLocation }}
        </span>
      </template>
      <template v-if="isGroupMembersActionsColumnAvailable" #item.actions="{item}">
        <v-btn
          v-if="isExcludingMemberAvailable(item.account.name)"
          icon
          small
          @click="showConfirmAction(item)"
        >
          <v-icon>clear</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-divider v-if="items.length < 50" />
    <d-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :confirm-button-title="actionDialog.actionLabel"
      :loading="actionDialog.loading"
      @click:confirm="actionDialog.action()"
    >
      {{ actionDialog.description }}
    </d-dialog>
  </div>
</template>

<script>
  import MemberListTitle from '@/components/MemberList/MemberListItem/MemberListItemPartials/MemberListTitle';
  import DDialog from '@/components/Deipify/DDialog/DDialog';
  import { mapGetters } from 'vuex';
  import { ResearchGroupService } from '@deip/research-group-service';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'MemberListTable',
    components: { MemberListTitle, DDialog },
    props: {
      items: {
        type: Array,
        default: () => ([])
      },
      group: {
        type: Object,
        default: undefined
      }
    },
    data() {
      return {
        actionDialog: {
          isOpen: false,
          title: null,
          description: null,
          actionLabel: null,
          loading: false,
          action: () => false
        },
        pendingMembersHeaders: [
          {
            text: 'Researcher',
            value: 'researcher'
          },
          {
            text: 'Total ECI',
            value: 'expertiseStats.eci',
            align: 'end'
          },
          {
            text: 'Percentile rank',
            value: 'expertiseStats.percentile_rank',
            align: 'end'
          },
          {
            text: 'Growth rate',
            value: 'expertiseStats.growth_rate',
            align: 'end'
          },
          {
            text: 'Expertise',
            value: 'expertise',
            align: 'start'
          },
          {
            text: 'Member since',
            value: 'created',
            align: 'start'
          },
          {
            text: 'Location',
            value: 'location',
            align: 'start'
          },
          {
            text: '',
            value: 'actions'
          }
        ]
      };
    },
    computed: {
      ...mapGetters({
        userPersonalGroup: 'auth/userPersonalGroup',
        user: 'auth/user'
      }),
      isResearchGroupMember() {
        return this.$store.getters['auth/userIsResearchGroupMember'](this.group.id);
      },
      isPersonalGroup() {
        return this.group.id == this.userPersonalGroup.id;
      },
      isGroupMembersActionsColumnAvailable() {
        return this.group && !this.isPersonalGroup && this.isResearchGroupMember && (this.group.is_dao || (!this.group.is_dao && this.user.username == this.group.creator));
      }
    },
    methods: {
      dropoutMember(member) {
        this.actionDialog.loading = true;
        researchGroupService.leftResearchGroupViaOffchain(this.user.privKey, {
          member: member.rgt.owner,
          researchGroup: this.group.external_id,
          isExclusion: true,
          extensions: []
        }, {
          notes: '',
          approver: null
        })
          .then(() => {
            this.$notifier.showSuccess('Dropout Proposal has been created successfully!');
            this.$store.dispatch('researchGroup/loadResearchGroupProposals', { account: this.group.external_id });
          })
          .catch((err) => {
            this.$notifier.showError('An error occurred while creating proposal, please try again later');
            console.error(err);
          })
          .finally(() => {
            this.actionDialog.loading = false;
            this.actionDialog.isOpen = false;
            this.$vuetify.goTo('#proposals');
          });
      },
      isExcludingMemberAvailable(username) {
        return this.isGroupMembersActionsColumnAvailable && this.user.username != username;
      },
      showConfirmAction(member) {
        this.actionDialog = {
          isOpen: true,
          title: 'You’re about to exclude',
          description: `${member.profile.firstName} ${member.profile.lastName} from ${this.group.name} Research Group`,
          actionLabel: 'Confirm',
          loading: false,
          action: () => this.dropoutMember(member)
        };
      }
    }
  };
</script>
