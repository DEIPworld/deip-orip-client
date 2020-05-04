<template>
  <div class="fill-height pa-12 xs12">
    <div class="headline half-bold">
      <router-link
        class="a"
        :to="{
          name: 'ResearchGroupDetails',
          params: { research_group_permlink: encodeURIComponent(group.permlink) }
        }"
      >
        {{ group.name }}
      </router-link>
      <span class="grey--text px-2">Group Wallet</span>
    </div>

    <div class="legacy-row-nowrap c-pt-8">
      <div class="legacy-col-grow c-pr-8">
        <v-card>
          <div class="info-card-list">
            <div class="list-line">
              <div class="list-header-cell legacy-col-grow">
                Asset
              </div>
              <div class="list-header-cell width-10 text-align-center">
                Amount
              </div>

              <div class="list-header-cell token-actions">
                <span class="c-pr-8">Actions</span>
              </div>
            </div>

            <v-divider />

            <div
              class="list-line"
              :class="{ 'primary lighten-5': sendingType === sendingTypes.deipToken }"
            >
              <div class="legacy-col-grow list-body-cell display-flex align-center">
                <!-- TODO: make service component which can manage our all SVG items -->
                <div style="height: 40px; width: 40px;">
                  <img width="100%" height="100%" src="/assets/img/currency/deip.png">
                  <!-- <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="20" fill="black"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.91431 0H6.15204V1.9375H7.271V0H9.50873V2.01611C10.6616 2.15356 11.725 2.47119 12.6993 2.96875C14.0454 3.64844 15.0944 4.61328 15.8462 5.86328C16.6067 7.10547 16.9913 8.5 17 10.0469V10.832C17 12.3945 16.6285 13.7969 15.8855 15.0391C15.1512 16.2734 14.111 17.2422 12.7648 17.9453C11.767 18.4641 10.6817 18.7915 9.50873 18.9275V21H7.271V19H6.15204V21H3.91431V19H0V1.9375H3.91431V0ZM4 5.11328V15.8359H8.2019C9.52185 15.8359 10.5358 15.418 11.2439 14.582C11.9519 13.7383 12.306 12.4883 12.306 10.832V10.0938C12.306 8.44531 11.9519 7.20312 11.2439 6.36719C10.5358 5.53125 9.50439 5.11328 8.14948 5.11328H4Z" transform="translate(13 9)" fill="#F0F1F4"/>
                  </svg> -->
                </div>

                <span class="subtitle-1 c-pl-4 c-pr-2" />
              </div>

              <div class="width-10 list-body-cell text-align-center">
                <div class="half-bold headline">
                  {{ defaultAssetBalance }}
                </div>
              </div>

              <div class="list-body-cell token-actions">
                <v-btn
                  class="ma-0"
                  :disabled="!defaultAssetBalance"
                  text
                  color="primary"
                  @click="sendingType = sendingTypes.deipToken"
                >
                  Send
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>

        <div class="title c-pt-8">
          Research Tokens
        </div>

        <v-card class="c-mt-6">
          <div class="info-card-list">
            <div class="reserarch-table-header c-ph-3">
              <div class="list-header-cell legacy-col-grow">
                Title
              </div>
              <!-- <div class="list-header-cell width-7 text-align-center">
                  Market price<br>
                  (DEIP Tokens)
              </div> -->
              <div class="list-header-cell width-5 text-align-center">
                Amount
              </div>
            </div>

            <v-divider />

            <div v-if="researches.length">
              <template v-for="(research, i) in researches">
                <div class="list-line" :key="`${i}-research`">
                  <div class="legacy-col-grow list-body-cell">
                    <div class="subtitle-1">
                      {{ research.title }}
                    </div>
                    <!-- <div class="grey--text caption">alice · bob</div> -->
                  </div>

                  <!-- <div class="width-7 list-body-cell text-align-center half-bold">10</div> -->

                  <div class="width-5 list-body-cell text-align-center half-bold">
                    {{ convertToPercent(research.owned_tokens) }}%
                  </div>
                </div>

                <v-divider />
              </template>
            </div>

            <div v-else class="list-line height-7">
              <div class="c-m-auto grey--text">
                Research Token list is empty
              </div>
            </div>
          </div>
        </v-card>
      </div>

      <div class="tokens-send-panel">
        <transition mode="out-in">
          <rg-deip-token-send-form
            v-if="sendingType === sendingTypes.deipToken"
            :deip-token-balance="defaultAssetBalance"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { mapGetters } from 'vuex';
  import RGDeipTokenSendForm from './components/RGDeipTokenSendForm.vue';
  import deipRpc from '@deip/rpc-client';
  import { AppConfigService } from '@deip/app-config-service';

  const appConfigService = AppConfigService.getInstance();

  export default {
    name: 'ResearchGroupWallet',
    components: {
      'rg-deip-token-send-form': RGDeipTokenSendForm
    },

    data() {
      return {
        sendingType: undefined,
        selectedResearchId: undefined,
        sendingTypes: {
          deipToken: 'deipToken'
        }
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        group: 'rgWallet/group',
        researches: 'rgWallet/researches'
      }),

      defaultAssetBalance() {
        const env = appConfigService.get('env');
        let amount = this.group.balances[env.ASSET_UNIT];
        return amount;;
      }
    },

    created() {
    },

    methods: {}
  };
</script>

<style lang="less" scoped>
  @import './../../styles/colors.less';

  .tokens-send-panel {
    width: 300px;
  }

  .token-actions {
    width: 230px;
    text-align: right;
  }

  .reserarch-table-header {
    display: flex;
    align-items: center;
    height: 70px;
  }

  .v-enter-active, .v-leave-active {
    transition: opacity .1s;
  }

  .v-enter, .v-leave-to {
    opacity: 0;
  }

  .info-card-list {
    .list-line {
      display: flex;
      padding-top: 24px;
      padding-bottom: 24px;
      padding-left: 12px;
      padding-right: 12px;
    }

    .list-header-cell {
      padding-right: 12px;
      padding-left: 12px;
      color: @grey;
    }

    .list-body-cell {
      padding-right: 12px;
      padding-left: 12px;
      align-self: center;
    }
  }
</style>
