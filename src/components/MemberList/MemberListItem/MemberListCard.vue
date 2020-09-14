<template>
  <v-card
    class="d-flex flex-column"
    outlined
  >
    <v-card-text class="py-4 pr-12 text--primary d-flex" style="height: 88px">
      <div class="d-flex my-auto">
        <member-list-title :member="member" />
      </div>
    </v-card-text>

    <v-divider />

    <v-card-text class="text--primary spacer py-4 d-flex flex-column" style="min-height:150px">
      <member-list-item-stat-info :member="member" />

      <v-spacer />

      <v-clamp
        autoresize
        :max-lines="2"
        class="caption"
      >
        {{ disciplineNames }}
      </v-clamp>
    </v-card-text>

    <v-divider />

    <v-card-text class="py-4 text-caption">
      <div class="mb-2">
        <v-icon size="18">
          today
        </v-icon>
        {{ member.created | dateFormat('D MMM YYYY') }}
      </div>
      <div>
        <v-icon size="18">
          location_on
        </v-icon>
        {{ member | userLocation }}
      </div>
    </v-card-text>
    <v-btn
      v-if="isExcludingMemberAvailable(member.account.name)"
      icon
      small
      absolute
      right
      top
      @click="showConfirmAction(member)"
    >
      <v-icon>close</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
  import { abstractMemberItem } from '@/components/MemberList/MemberListItem/abstractMemberItem';
  import MemberListItemStatInfo from '@/components/MemberList/MemberListItem/MemberListItemPartials/MemberListItemStatInfo';
  import { mapGetters } from 'vuex';

  export default {
    name: 'MemberListCard',

    components: {
      MemberListItemStatInfo
    },

    mixins: [abstractMemberItem],

    props: {
      group: {
        type: Object,
        default: undefined
      }
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
      disciplineNames() {
        return this.member.expertise.map(({ discipline_name }) => discipline_name).join(' · ');
      },
      isGroupMembersActionsColumnAvailable() {
        return this.group && !this.isPersonalGroup && this.isResearchGroupMember && (this.group.is_dao || (!this.group.is_dao && this.user.username == this.group.creator));
      }
    },
    methods: {
      showConfirmAction(member) {
        this.$emit('showConfirmAction', member);
      },
      isExcludingMemberAvailable(username) {
        return this.isGroupMembersActionsColumnAvailable && this.user.username != username;
      }
    }
  };
</script>

<style scoped>

</style>
