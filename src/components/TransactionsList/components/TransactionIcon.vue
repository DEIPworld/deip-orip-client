<template>
  <div class="d-flex mt-4">
    <v-icon size="20" left color="black">
      {{ transactionTypes[transactionType].icon }}
    </v-icon>{{ transactionTypes[transactionType].text }}
  </div>
</template>

<script>
  import { LOC_PROPOSAL_TYPES } from '@/variables';

  export default {
    name: 'TransactionIcon',
    props: {
      transactionType: {
        type: [String, Number],
        required: true,
        default: ''
      }
    },
    data() {
      return {
        transactionTypes: {
          [LOC_PROPOSAL_TYPES.CREATE_RESEARCH]: {
            icon: 'add_box',
            text: this.$t('transactionsList.transactionTypes.createProject')
          },
          [LOC_PROPOSAL_TYPES.UPDATE_RESEARCH]: {
            icon: 'update',
            text: this.$t('transactionsList.transactionTypes.projectUpdate')
          },
          [LOC_PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL]: {
            icon: 'note_add',
            text: this.$t('transactionsList.transactionTypes.contentUpload')
          },
          [LOC_PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE]: {
            icon: 'payments',
            text: this.$t('transactionsList.transactionTypes.fundraising')
          },
          [LOC_PROPOSAL_TYPES.UPDATE_RESEARCH_GROUP]: {
            icon: 'groups',
            text: this.$t('transactionsList.transactionTypes.teamUpdate')
          },
          [LOC_PROPOSAL_TYPES.INVITE_MEMBER]: {
            icon: 'person_add',
            text: this.$t('transactionsList.transactionTypes.inviteMember')
          },
          [LOC_PROPOSAL_TYPES.EXCLUDE_MEMBER]: {
            icon: 'person_remove',
            text: this.$t('transactionsList.transactionTypes.removeMember')
          },
          [LOC_PROPOSAL_TYPES.TRANSFER_ASSET]: {
            icon: 'mdi-arrow-right-circle',
            text: this.$t('transactionsList.transactionTypes.transfer')
          },
          [LOC_PROPOSAL_TYPES.EXPRESS_LICENSE_REQUEST]: {
            icon: 'work',
            text: this.$t('transactionsList.transactionTypes.licensing')
          },
          [LOC_PROPOSAL_TYPES.ASSET_EXCHANGE_REQUEST]: {
            icon: 'swap_horizontal_circle',
            text: this.$t('transactionsList.transactionTypes.exchange')
          },
          [LOC_PROPOSAL_TYPES.RESEARCH_NDA]: {
            icon: 'work',
            text: this.$t('transactionsList.transactionTypes.projectNda')
          }
        }
      };
    }
  }
</script>
