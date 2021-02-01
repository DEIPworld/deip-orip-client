<template>
  <v-row>
    <v-col class="fill-height pa-12 xs12">
      <div v-if="contentMetadata">
        <div class="legacy-row legacy-justify-between legacy-align-items-end">
          <div class="text-h4 bold">
            {{
              $t('researchContentDetails.metadata.blockNum', { blockNum: contentMetadata.blockNum })
            }}
            <span v-if="isGenesisBlock" class="text-caption grey--text">
              {{ $t('researchContentDetails.metadata.genesis') }}
            </span>
          </div>

          <!-- <qrcode value="Hello, World!" :options="{ size: 120 }"></qrcode> -->
        </div>

        <div class="c-mt-4">
          <div class="bold">
            {{ $t('researchContentDetails.metadata.blockID') }}
          </div>
          <div class="legacy-row grey-border-stripe">
            <div class="pill width-7 white--text">
              {{ $t('researchContentDetails.metadata.ripemd') }}
            </div>
            <div class="legacy-col-grow pill-value">
              {{ contentMetadata.blockId }}
            </div>
          </div>
        </div>

        <div class="c-mt-4">
          <div class="legacy-row">
            <div class="bold width-7">
              {{ $t('researchContentDetails.metadata.content') }}
            </div>
            <div class="bold c-pl-4">
              <router-link
                class="a"
                :to="`/${$route.params.teamId}/research/${$route.params.projectId}/${$route.params.contentId}`"
              >
                {{ contentMetadata.content.title }}
              </router-link>
            </div>
          </div>
          <div class="legacy-row grey-border-stripe">
            <div class="pill width-7 white--text">
              {{ $t('researchContentDetails.metadata.SHA256') }}
            </div>
            <div class="legacy-col-grow pill-value">
              {{ contentMetadata.content.content }}
            </div>
          </div>
        </div>

        <div class="c-mt-4">
          <div class="legacy-row">
            <div class="bold width-7">
              {{ $t('researchContentDetails.metadata.timestamp') }}
            </div>
            <div class="c-pl-4 c-pt-3">
              {{ new Date(contentMetadata.timestamp).toISOString() }}
            </div>
          </div>
        </div>

        <div class="c-mt-8">
          <div class="legacy-row">
            <div class="bold width-7">
              {{ $t('researchContentDetails.metadata.signee') }}
            </div>

            <div class="legacy-col-grow">
              <div>
                <div class="legacy-row">
                  <platform-avatar
                    :user="contentMetadata.witness.user"
                    :size="40"
                    link-to-profile
                    link-to-profile-class="px-1"
                  />
                </div>

                <div class="grey-border-stripe c-mt-4">
                  <div class="legacy-row-nowrap">
                    <div class="pill width-7">
                      <div class="white--text">
                        {{ $t('researchContentDetails.metadata.ecc') }}
                      </div>
                    </div>
                    <div class="legacy-col-grow pill-value">
                      <div>{{ contentMetadata.witness.signingKey }}</div>
                    </div>
                  </div>

                  <div class="legacy-row-nowrap">
                    <div class="pill width-7 display-flex">
                      <div class="grey--text text--darken-3 c-m-auto">
                        {{ $t('researchContentDetails.metadata.signature') }}
                      </div>
                    </div>
                    <div class="legacy-col-grow pill-value">
                      <div class="">
                        {{ contentMetadata.witness.signature }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isGenesisBlock && contentMetadata.voters.lenght" class="c-mt-8">
          <div class="legacy-row">
            <div class="bold width-7">
              {{ $t('researchContentDetails.metadata.approvedBy') }}
            </div>

            <div class="legacy-col-grow">
              <div v-for="(voter, idx) in contentMetadata.voters" :key="'approver-' + idx" class="c-mb-4">
                <div class="legacy-row">
                  <platform-avatar
                    :user="voter.user"
                    :size="40"
                    link-to-profile
                    link-to-profile-class="px-1"
                  />
                </div>

                <div class="grey-border-stripe c-mt-4">
                  <div class="legacy-row-nowrap">
                    <div class="pill width-7">
                      <div class="white--text">
                        {{ $t('researchContentDetails.metadata.ecc') }}
                      </div>
                    </div>
                    <div class="legacy-col-grow pill-value">
                      <div>{{ voter.user.account.owner.key_auths[0][0] }}</div>
                    </div>
                  </div>

                  <div class="legacy-row-nowrap">
                    <div class="pill width-7 display-flex">
                      <div class="grey--text text--darken-3 c-m-auto">
                        {{ $t('researchContentDetails.metadata.signature') }}
                      </div>
                    </div>
                    <div class="legacy-col-grow pill-value">
                      <div class="">
                        {{ voter.signature }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isGenesisBlock" class="c-mt-4">
          <div class="bold">
            {{ $t('researchContentDetails.metadata.transactionID') }}
          </div>
          <div class="legacy-row grey-border-stripe">
            <div class="pill width-7 white--text">
              {{ $t('researchContentDetails.metadata.ripemd') }}
            </div>
            <div class="legacy-col-grow pill-value">
              {{ contentMetadata.transaction.id }}
            </div>
          </div>
        </div>

        <div v-if="!isGenesisBlock" class="c-mt-4">
          <div class="bold">
            {{ $t('researchContentDetails.metadata.transactionHEX') }}
          </div>
          <div class="legacy-row-nowrap grey-border-stripe">
            <div class="pill width-7 white--text display-flex">
              <div class="c-m-auto">
                {{ $t('researchContentDetails.metadata.hex') }}
              </div>
            </div>
            <div class="legacy-col-grow pill-value">
              {{ contentMetadata.transaction.hex }}
            </div>
          </div>
        </div>

        <div class="c-mt-4">
          <div class="bold">
            {{ $t('researchContentDetails.metadata.chainID') }}
          </div>
          <div class="legacy-row grey-border-stripe">
            <div class="pill width-7 white--text">
              {{ $t('researchContentDetails.metadata.SHA256') }}
            </div>
            <div class="legacy-col-grow pill-value">
              {{ contentMetadata.chainId }}
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'ResearchContentMetadata',

    data() {
      return {};
    },

    computed: {
      ...mapGetters({
        contentMetadata: 'rcd/contentMetadata'
      }),

      isGenesisBlock() {
        return this.contentMetadata && this.contentMetadata.blockNum == 1;
      }
    },

    created() {
    },

    methods: {

    }
  };
</script>

<style lang="less" scoped>
  @import '../../styles/colors.less';

  .grey-border-stripe {
    border: 1px solid @grey-lighten-1;
    border-radius: 2px;
    position: relative;

    .pill {
      flex: 0 0 auto;
      background-color: @grey-lighten-1;
      padding: 4px 8px;
      text-align: center;
      vertical-align: middle;
    }

    .pill-value {
      padding: 4px 16px;
      word-break: break-word;
    }
  }
</style>
