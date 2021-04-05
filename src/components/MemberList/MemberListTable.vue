<template>
  <div>
    <v-data-table
      :headers="membersHeaders"
      :items="items"
      disable-sort
      :hide-default-footer="items.length < 50"
      :items-per-page="50"
    >
      <template #item.researcher="{item}">
        <member-list-title :member="item" :desc-max-lines="1" class="py-4" />
      </template>
      <template v-if="$hasModule(DEIP_MODULE.APP_ECI)" #item.expertiseStats.eci="{item}">
        <span class="text-caption font-weight-medium">
          {{ item.expertiseStats.eci | commaNumber }}
        </span>
      </template>
      <template v-if="$hasModule(DEIP_MODULE.APP_ECI)" #item.expertiseStats.percentile_rank="{item}">
        <span class="text-caption font-weight-medium">
          {{ item.expertiseStats.percentile_rank }}
        </span>
      </template>
      <template v-if="$hasModule(DEIP_MODULE.APP_ECI)" #item.expertiseStats.growth_rate="{item}">
        <span class="text-caption" :class="$options.filters.numDirClass(item.expertiseStats.growth_rate)">
          {{ item.expertiseStats.growth_rate | numDir }}
        </span>
      </template>
      <template v-if="$hasModule(DEIP_MODULE.APP_ECI)" #item.expertise="{item}">
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
        <!-- <v-btn
          v-if="isExcludingMemberAvailable(item.account.name)"
          icon
          small
          @click="showConfirmAction(item)"
        >
          <v-icon>clear</v-icon>
        </v-btn> -->
      </template>
    </v-data-table>
    <v-divider v-if="items.length < 50" />
    <vex-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :button-true-text="actionDialog.actionLabel"
      :loading="actionDialog.loading"
      @click:confirm="actionDialog.action()"
    >
      {{ actionDialog.description }}
    </vex-dialog>
  </div>
</template>

<script>
  import MemberListTitle from '@/components/MemberList/MemberListItem/MemberListItemPartials/MemberListTitle';
  import { mapGetters } from 'vuex';
  import { dropoutMember } from '@/components/MemberList/MemberListItem/dropoutMember';

  export default {
    name: 'MemberListTable',
    components: { MemberListTitle },
    mixins: [dropoutMember],
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
      };
    },
    computed: {
      ...mapGetters({
        userPersonalGroup: 'auth/userPersonalGroup'
      }),
      membersHeaders() {
        const columns = [{
          text: this.$t('memberList.member'),
          value: 'researcher'
        }];

        if (this.$hasModule(this.DEIP_MODULE.APP_ECI)) {
          columns.push(...[
            {
              text: this.$t('memberList.eci'),
              value: 'expertiseStats.eci',
              align: 'end'
            },
            {
              text: this.$t('memberList.percentile'),
              value: 'expertiseStats.percentile_rank',
              align: 'end'
            },
            {
              text: this.$t('memberList.growthRate'),
              value: 'expertiseStats.growth_rate',
              align: 'end'
            },
            {
              text: this.$t('memberList.expertise'),
              value: 'expertise',
              align: 'start'
            }
          ]);
        }

        columns.push(...[
          {
            text: this.$t('memberList.memberSince'),
            value: 'created',
            align: 'start'
          },
          {
            text: this.$t('memberList.location'),
            value: 'location',
            align: 'start'
          },
          {
            text: '',
            value: 'actions'
          }
        ]);

        return columns;
      },
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
      isExcludingMemberAvailable(username) {
        return this.isGroupMembersActionsColumnAvailable && this.user.username != username;
      }
    }
  };
</script>
