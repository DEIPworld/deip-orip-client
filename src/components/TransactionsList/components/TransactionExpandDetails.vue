<template>
  <div class="py-4 text--secondary text-caption">
    <div class="mb-6">
      <div v-if="LOC_PROPOSAL_TYPES.CONTRACT_AGREEMENT_PROPOSAL === transaction.type">
        <span class="font-weight-medium"> {{ $t('transactionsList.licType') }}: </span>
        {{ transaction.details.terms.name }}
      </div>
      <div>
        <span class="font-weight-medium"> Receipt: </span>
        {{ transaction.proposal.created_at | dateFormat('DD MMM YYYY, HH:mm', true) }}
      </div>
      <div>
        <span class="font-weight-medium"> Expiration: </span>
        {{ transaction.proposal.expiration_time | dateFormat('DD MMM YYYY, HH:mm', true) }}
      </div>
    </div>
    <div class="mb-6">
      <div class="mb-2 font-weight-medium">
        {{ $t('transactionsList.requiredParties') }}
      </div>
      <template v-for="(signer, i) in transaction.parties">
        <d-box-item
          v-if="!signer.isHidden"
          :key="`${i}-otherPartiesSigner`"
          class="mb-4"
          :avatar="signer.account.external_id ?
            $options.filters.researchGroupLogoSrc(signer.account.external_id, 80, 80)
            : $options.filters.accountAvatarSrc(signer.account, 80, 80)
          "
          :size="40"
          style="max-width: 400px"
        >
          <router-link
            tag="div"
            class="text-decoration-none text--primary cursor-pointer"
            :to="signer.account.account.is_research_group
              ? {
                name: 'team.details',
                params: { teamId: signer.account.external_id }
              }
              : { name: 'UserDetails', params: { account_name: signer.account.account.name } }"
          >
            <v-clamp autoresize :max-lines="1" class="text-h6">
              {{ signer.account | accountFullname }}
            </v-clamp>
          </router-link>
          <template #actionText>
            <div style="width: 93px">
              <div class="d-flex text--primary text-body-2">
                <v-icon
                  :color="statusChipData.color[signer.status]"
                  size="14"
                  class="mr-1"
                >
                  {{ statusChipData.icon[signer.status] }}
                </v-icon>
                {{ statusChipData.text[signer.status] }}
              </div>
            </div>
          </template>
        </d-box-item>
      </template>
    </div>
    <div>
      <div class="mb-2 font-weight-medium">
        {{ $t('transactionsList.signedBy') }}
      </div>
      <v-expansion-panels
        flat
        multiple
        readonly
        class="mb-n4"
        :value="transaction.expand"
      >
        <template v-for="(party, i) in transaction.parties">
          <template v-if="!party.isHidden">
            <template v-for="({ signer, txInfo }, j) in party.signers">
              <v-expansion-panel
                :key="`${i}-${j}-accounts`"
                class="pa-0 mt-0 mb-4"
              >
                <div class="d-flex" :class="{ 'mb-2': transaction.expand.length }">
                  <v-avatar
                    v-if="!signer.is_research_group && party.account.account.is_research_group"
                    class="mr-n2"
                    :size="40"
                  >
                    <v-img :src="party.account | accountAvatarSrc(80, 80)" />
                  </v-avatar>
                  <d-box-item
                    :avatar="signer | accountAvatarSrc(80, 80)"
                    :size="40"
                  >
                    <router-link
                      tag="div"
                      class="text-decoration-none cursor-pointer"
                      :to="signer.account.is_research_group
                        ? {
                          name: 'team.details',
                          params:
                            { teamId: signer.external_id}
                        }
                        : {
                          name: 'UserDetails',
                          params: { account_name: signer.account.name }
                        }"
                    >
                      <v-clamp autoresize :max-lines="1" class="text-h6">
                        {{ signer | accountFullname }}
                      </v-clamp>
                    </router-link>
                  </d-box-item>
                </div>
                <v-expansion-panel-content class="pa-0 ml-7">
                  <div class="text--secondary text-caption">
                    <div>
                      <span class="font-weight-medium">
                        {{ $t('transactionsList.transactionID') }}:
                      </span>
                      <span>{{ txInfo.trx_id || '—' }}</span>
                    </div>
                    <div>
                      <span class="font-weight-medium">
                        {{ $t('transactionsList.block') }}:
                      </span>
                      <span>{{ txInfo.block_num || '—' }}</span>
                    </div>
                    <div>
                      <span class="font-weight-medium">
                        {{ $t('transactionsList.timestamp') }}:
                      </span>
                      {{ txInfo.timestamp
                        ? $options.filters.dateFormat(
                          txInfo.timestamp, 'DD MMM YYYY, HH:mm', true
                        )
                        : '—'
                      }}
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </template>
          </template>
        </template>
      </v-expansion-panels>
    </div>
    <v-btn
      text
      color="primary"
      small
      class="text-caption font-weight-bold pa-0 mt-8"
      @click="showDetails()"
    >
      {{ !transaction.expand.length ?
        $t('transactionsList.showDetails')
        : $t('transactionsList.hideDetails')
      }}
    </v-btn>
  </div>
</template>

<script>
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import { transactionChips } from '@/components/TransactionsList/transactionsListMixins';
  import Vue from 'vue';

  export default {
    name: 'TransactionExpandDetails',
    components: {
      DBoxItem
    },
    mixins: [transactionChips],
    methods: {
      showDetails() {
        const { parties } = this.transaction;
        const signatures = Object.keys(parties).reduce((acc, key) => {
          const party = parties[key];
          return [...acc, ...party.signers];
        }, []);

        if (!this.transaction.expand.length) {
          Vue.set(this.transaction, 'expand', signatures.map((sig, i) => i));
        } else {
          Vue.set(this.transaction, 'expand', []);
        }
      }
    }
  };
</script>
