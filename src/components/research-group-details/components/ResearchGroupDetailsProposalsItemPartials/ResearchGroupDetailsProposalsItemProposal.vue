<template>
  <div v-if="item.action === PROPOSAL_TYPES.CREATE_RESEARCH" class="display-flex">
    <v-icon small class="mx-2">
      note_add
    </v-icon>
    <div class="a">
      {{ item.payload.title }}
    </div>
  </div>
  <div v-else-if="item.action === PROPOSAL_TYPES.INVITE_MEMBER" class="display-flex">
    <v-icon small class="mx-2">
      person_add
    </v-icon>
    <div class="text-body-2">
      <router-link
        class="a"
        :to="{ name: 'UserDetails', params: { account_name: item.extension.invitee.account.name } }"
      >
        {{ item.extension.invitee | fullname }}
      </router-link>
    </div>
  </div>
  <div v-else-if="item.action === PROPOSAL_TYPES.EXCLUDE_MEMBER" class="display-flex">
    <v-icon small class="mx-2">
      person_remove
    </v-icon>
    <div class="text-body-2">
      <router-link
        class="a"
        :to="{ name: 'UserDetails', params: { account_name: item.extension.member.account.name } }"
      >
        {{ item.extension.member | fullname }}
      </router-link>
    </div>
  </div>
  <div v-else-if="item.action === PROPOSAL_TYPES.TRANSFER" class="display-flex">
    <v-icon small class="mx-2">
      money_off
    </v-icon>
    <div class="a">
      Transfer tokens
    </div>
  </div>
  <div
    v-else-if="item.action === PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE"
    class="display-flex"
  >
    <v-icon small class="mx-2">
      attach_money
    </v-icon>
    <div class="text-body-2">
      {{ item.payload.share }} fundraise
    </div>
  </div>

  <div
    v-else-if="item.action === PROPOSAL_TYPES.UPDATE_RESEARCH_GROUP"
    class="display-flex"
  >
    <v-icon small class="mx-2">
      settings
    </v-icon>
    <div class="text-body-2">
      Update group meta
    </div>
  </div>
  <div
    v-else-if="item.action === PROPOSAL_TYPES.UPDATE_RESEARCH"
    class="display-flex"
  >
    <v-icon small class="mx-2">
      model_training
    </v-icon>
    <div class="text-body-2">
      Update research meta
    </div>
  </div>
  <div
    v-else-if="item.action === PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL"
    class="display-flex"
  >
    <v-icon small class="mx-2">
      post_add
    </v-icon>
    <router-link
      class="a"
      :to="{
        name: 'ResearchDetails',
        params: {
          research_group_permlink: encodeURIComponent(item.extension.research.research_group.permlink),
          research_permlink: encodeURIComponent(item.extension.research.permlink)
        }
      }"
    >
      {{ item.payload.title }}
    </router-link>
  </div>
</template>

<script>
  import { abstractResearchGroupDetailsProposalsItem } from '@/components/research-group-details/components/ResearchGroupDetailsProposalsItemPartials/abstractResearchGroupDetailsProposalsItem';

  export default {
    name: 'ResearchGroupDetailsProposalsItemProposal',

    mixins: [abstractResearchGroupDetailsProposalsItem]
  }
</script>