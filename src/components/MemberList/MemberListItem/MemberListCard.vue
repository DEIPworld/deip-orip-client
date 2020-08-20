<template>
  <v-card
    class="d-flex flex-column"
    outlined
  >
    <v-card-text class="py-4 text--primary d-flex" style="height: 88px">
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
          location_on
        </v-icon>
        {{ member.created | dateFormat('D MMM YYYY') }}
      </div>
      <div>
        <v-icon size="18">
          today
        </v-icon>
        {{ member | userLocation }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  import { abstractMemberItem } from '@/components/MemberList/MemberListItem/abstractMemberItem';
  import MemberListItemStatInfo from '@/components/MemberList/MemberListItem/MemberListItemPartials/MemberListItemStatInfo';

  export default {
    name: 'MemberListCard',

    components: {
      MemberListItemStatInfo
    },

    mixins: [abstractMemberItem],

    computed: {
      disciplineNames() {
        return this.member.expertise.map(({ discipline_name }) => discipline_name).join(' · ');
      }
    }
  };
</script>

<style scoped>

</style>
