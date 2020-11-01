<template>
  <v-row v-if="item.action === PROPOSAL_TYPES.CREATE_RESEARCH" no-gutters>
    <v-col cols="6">
      <div class="grey--text">
        {{ item.creator }}
      </div>
      <div class="pt-2">
        {{ $t('researchGroupDetails.proposalExpand.reviewers') }}
        <span class="font-weight-bold">{{ item.payload.review_share }}</span>
      </div>
    </v-col>
    <v-col class="grey--text" cols="6" style="max-height: 70px">
      <v-row>
        <!-- <span v-for="(label, i) in getDisciplineNames()" :key="i" class="pr-1">{{ label }}</span> -->
      </v-row>
    </v-col>
  </v-row>

  <v-row v-else-if="item.action === PROPOSAL_TYPES.INVITE_MEMBER" no-gutters>
    <v-col cols="2">
      <platform-avatar
        :user="item.extension.invitee"
        :size="20"
        link-to-profile
        link-to-profile-class="px-1"
      />
    </v-col>
    <v-col
      class="text-left grey--text break-word white-space-pre-line"
      cols="10"
    >
      {{ $t('researchGroupDetails.proposalExpand.invToGroup') }}
    </v-col>
  </v-row>

  <v-row v-else-if="item.action === PROPOSAL_TYPES.EXCLUDE_MEMBER" no-gutters>
    <v-col cols="2">
      <platform-avatar
        :user="item.extension.member"
        :size="20"
        link-to-profile
        link-to-profile-class="px-1"
      />
    </v-col>
    <v-col
      class="text-left grey--text break-word white-space-pre-line"
      cols="10"
    >
      {{ $t('researchGroupDetails.proposalExpand.leftGroup') }}
    </v-col>
  </v-row>

  <v-row v-else-if="item.action === PROPOSAL_TYPES.TRANSFER" no-gutters>
    <v-col cols="6">
      <div>
        {{ $t('researchGroupDetails.proposalExpand.user') }}
        <router-link
          :to="{
            name: 'UserDetails',
            params: { account_name: item.data.recipient }
          }"
          class="a"
        >
          {{ item.extension.recipient | fullname }}
        </router-link>
      </div>
      <div>
        {{ $t('researchGroupDetails.proposalExpand.amount') }}
        <span class="font-weight-bold">{{ item.data.funds }}</span>
      </div>
    </v-col>
  </v-row>

  <v-row v-else-if="item.action === PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE" no-gutters>
    <v-col class="display-flex justify" cols="4">
      <span class="font-weight-bold">
        {{ $t('researchGroupDetails.proposalExpand.project') }}
      </span>
      <router-link
        :to="{
          name: 'research.details',
          params: {
            researchExternalId: item.extension.research.external_id
          }
        }"
        class="a px-2"
      >
        {{ item.extension.research.title }}
      </router-link>
    </v-col>
    <v-col class="display-flex justify" cols="8">
      <div class="mr-4">
        <div>
          {{ $t('researchGroupDetails.proposalExpand.min') }}
          <span class="px-4 font-weight-bold float-right">{{ item.payload.soft_cap }}</span>
        </div>
        <div>
          {{ $t('researchGroupDetails.proposalExpand.max') }}
          <span class="px-4 font-weight-bold float-right">{{ item.payload.hard_cap }}</span>
        </div>
      </div>
      <div class="">
        <div>
          {{ $t('researchGroupDetails.proposalExpand.start') }}
          <span class="px-4 font-weight-bold float-right">
            {{ item.payload.start_time | dateFormat('HH:mm DD MMM YYYY', true) }}
          </span>
        </div>
        <div>
          {{ $t('researchGroupDetails.proposalExpand.end') }}
          <span class="px-4 font-weight-bold float-right">
            {{ item.payload.end_time | dateFormat('HH:mm DD MMM YYYY', true) }}
          </span>
        </div>
      </div>
    </v-col>
  </v-row>

  <v-row
    v-else-if="item.action === PROPOSAL_TYPES.UPDATE_RESEARCH_GROUP"
    no-gutters
  >
    <v-col cols="6">
      <div>
        {{ $t('researchGroupDetails.proposalExpand.type') }}
        <span class="font-weight-bold">
          {{ $t('researchGroupDetails.proposalExpand.updateGrMeta') }}
        </span>
      </div>
    </v-col>
  </v-row>

  <v-row v-else-if="item.action === PROPOSAL_TYPES.UPDATE_RESEARCH" no-gutters>
    <v-col cols="6">
      <div>
        {{ $t('researchGroupDetails.proposalExpand.type') }}
        <span class="font-weight-bold">
          {{ $t('researchGroupDetails.proposalExpand.updatePrMeta') }}
        </span>
      </div>
    </v-col>
  </v-row>

  <v-row v-else-if="item.action === PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL" no-gutters>
    <v-col cols="8">
      <div>
        <span class="font-weight-bold">
          {{ $t('researchGroupDetails.proposalExpand.authors') }}
        </span>
        <span class="grey--text">
          {{ item.payload.authors.join(' · ') }}
        </span>
      </div>
      <div>
        <span class="font-weight-bold">{{ getContentTypeStrById(item.payload.type) }}:</span>
        <router-link
          :to="{
            name: 'ResearchContentDetails',
            params: {
              research_group_permlink: encodeURIComponent(item.extension.research.research_group.permlink),
              research_permlink: encodeURIComponent(item.extension.research.permlink),
              content_permlink: encodeURIComponent('!draft')
            },
            query: {
              ref: item.payload.external_id
            }
          }"
          class="a px-2"
          target="_blank"
        >
          {{ item.payload.title }}
        </router-link>

        <span class="font-weight-bold">
          {{ $t('researchGroupDetails.proposalExpand.project') }}
        </span>
        <router-link
          :to="{
            name: 'research.details',
            params: {
              researchExternalId: item.extension.research.external_id
            }
          }"
          class="a px-2"
        >
          {{ item.extension.research.title }}
        </router-link>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import { abstractResearchGroupDetailsProposalsItem } from '@/components/research-group-details/components/ResearchGroupDetailsProposalsItemPartials/abstractResearchGroupDetailsProposalsItem';

  export default {
    name: 'ResearchGroupDetailsProposalsItemExpand',

    mixins: [abstractResearchGroupDetailsProposalsItem]
  };
</script>
