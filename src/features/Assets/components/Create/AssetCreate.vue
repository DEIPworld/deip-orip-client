<template>
  <d-layout-full-screen
    :title="$t('assets.issueTokens')"
  >
    <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
      <v-form
        v-if="$ready"
        :disabled="loading || projectTokenized"
        @submit.prevent="handleSubmit(createAsset)"
      >
        <d-stack gap="32">
          <d-block :title="$t('assets.create.tokenDetails')" title-margin="16">
            <div class="text-body-2">
              {{ $t('assets.create.project') }}: {{ project.title }}
            </div>

            <v-row>
              <v-col cols="8">
                <validation-provider
                  v-slot="{ errors }"
                  name="Number of tokens"
                  rules="required|integer"
                >
                  <v-text-field
                    v-model.number="formModel.maxSupply"
                    :label="$t('assets.create.totalNumber')"
                    outlined
                    hide-details="auto"
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="Ticker (abbreviation)"
                  :rules="{
                    required: true,
                    minMax: { min: 5, max: 6 },
                    unique: { list: existingAssets }
                  }"
                  :custom-messages="{
                    unique: '{_field_} is taken. Try another.'
                  }"
                >
                  <v-text-field
                    v-model="formModel.symbol"
                    v-mask="assetMask"
                    :label="$t('assets.create.tickerAbbreviation')"
                    outlined
                    hide-details="auto"
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <div class="text-body-2">
              {{ $t('assets.create.issued') }}
            </div>
          </d-block>

          <d-block title="Shareholders" title-margin="16">
            <div class="text-body-2">
              {{ $t('assets.create.usedForFund') }}
            </div>
            <d-timeline>
              <d-timeline-item :dot-top="16">
                <v-row class="align-center" style="max-width: 702px;"> <!-- temp solution (need fix) -->
                  <v-col cols="6">
                    <user-selector
                      :users="teamTokens.account"
                      :value="teamTokens.account"
                      :label="$t('assets.create.shareholder')"
                      outlined
                      hide-details="auto"
                      disabled
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      :label="$t('assets.create.tokens')"
                      :value="teamTokens.amount"
                      outlined
                      hide-details="auto"
                      disabled
                    />
                  </v-col>
                  <v-col class="text-body-2">
                    {{ toPercent(teamTokens.amount) }}
                  </v-col>
                  <v-col cols="auto">
                    <v-btn icon disabled>
                      <v-icon>mdi-lock</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </d-timeline-item>
              <d-timeline-item
                v-for="(item, index) of formModel.holders"
                :key="`row-${index}`"
                :dot-top="16"
                :ctrl-height="48"
              >
                <v-row style="max-width: 702px;"> <!-- temp solution (need fix) -->
                  <v-col cols="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Shareholder"
                      rules="required"
                    >
                      <user-selector
                        v-model="item.account"
                        :label="$t('assets.create.shareholder')"
                        outlined
                        hide-details="auto"
                        :error-messages="errors"
                        :filter="shareholdersFilter(item.account)"
                      />
                    </validation-provider>
                  </v-col>
                  <v-col cols="3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Tokens"
                      rules="integer|required"
                    >
                      <v-text-field
                        v-model="item.amount"
                        :label="$t('assets.create.tokens')"
                        outlined
                        hide-details="auto"
                        :error-messages="errors"
                      />
                    </validation-provider>
                  </v-col>
                  <v-col class="text-body-2 d-flex align-center" style="height: 72px;">
                    {{ toPercent(item.amount) }}
                  </v-col>
                  <v-col cols="auto" class="mt-2 d-flex align-center" style="height: 72px;">
                    <v-btn icon @click="removeShareholder(item)">
                      <v-icon>clear</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </d-timeline-item>

              <d-timeline-add
                label="Add shareholder"
                @click="addShareholder()"
              />
            </d-timeline>
          </d-block>

          <d-block title="Legal">
            <v-row no-gutters>
              <v-col cols="auto">
                <validation-provider
                  ref="s"
                  v-slot="{ errors }"
                  name="Confirmation"
                  :rules="{ required: { allowFalse: false } }"
                >
                  <v-checkbox
                    v-model="formModel.terms"
                    :hide-details="true"
                    class="ma-0 pa-0"
                  />
                </validation-provider>
              </v-col>
              <v-col style="padding-top:2px">
                <div class="text-body-2">
                  {{ $t('assets.create.agree') }}
                </div>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="auto">
                <validation-provider
                  ref="s"
                  v-slot="{ errors, validate }"
                  name="Confirmation"
                  :rules="{required: {allowFalse: false}}"
                >
                  <v-checkbox
                    v-model="formModel.confirm"
                    :hide-details="true"
                    class="ma-0 pa-0"
                  />
                </validation-provider>
              </v-col>
              <v-col style="padding-top:2px">
                <div class="text-body-2">
                  {{ $t('assets.create.text') }}
                </div>
              </v-col>
            </v-row>
          </d-block>

          <v-divider />

          <div class="d-flex">
            <v-spacer />
            <d-stack horizontal gap="16">
              <v-btn
                color="primary"
                outlined
                :disabled="loading"
                @click="cancel()"
              >
                {{ $t('assets.create.cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                :disabled="invalid"
                :loading="loading"
                @click="createAsset()"
              >
                {{ $t('assets.create.submit') }}
              </v-btn>
            </d-stack>
          </div>
        </d-stack>
      </v-form>
    </validation-observer>
  </d-layout-full-screen>
</template>

<script>
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import { mapGetters } from 'vuex';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DTimeline from '@/components/Deipify/DTimeline/DTimeline';
  import DTimelineItem from '@/components/Deipify/DTimeline/DTimelineItem';
  import DTimelineAdd from '@/components/Deipify/DTimeline/DTimelineAdd';
  import UserSelector from '@/features/Users/components/Selector/UserSelector';
  import { assetsChore } from '@/mixins/chores';

  const shareholderModel = () => ({
    account: undefined,
    amount: undefined
  });

  export default {
    name: 'AssetCreate',
    components: {
      UserSelector,
      DTimelineAdd,
      DTimelineItem,
      DTimeline,
      DStack,
      DBlock,
      DLayoutFullScreen
    },
    mixins: [assetsChore],
    data() {
      return {
        assetMask: {
          mask: 'ZZZZZZ',
          tokens: {
            Z: {
              pattern: /[a-zA-Z]/,
              transform: (v) => v.toLocaleUpperCase()
            }
          }
        },
        formModel: {
          maxSupply: 10000,
          symbol: undefined,
          holders: [],
          terms: false,
          confirm: false
        },
        loading: false
      };
    },
    computed: {
      ...mapGetters({
        project: 'Project/projectDetails',
        assets: 'Assets/list'
      }),

      teamTokens() {
        const tokensSpend = this.formModel.holders
          .map((s) => parseFloat(s.amount))
          .filter((a) => a)
          .reduce((a, b) => a + b, 0);

        return {
          account: this.project.researchGroup.external_id,
          amount: this.formModel.maxSupply - tokensSpend
        };
      },

      existingAssets() {
        return this.assets.map((a) => a.stringSymbol);
      },

      projectTokenized() {
        return !!(this.project.securityTokens && this.project.securityTokens.length)
      }
    },

    created() {
      if (this.projectTokenized) {
        this.redirect();
      } else {
        this.$setReady();
      }
    },

    methods: {
      addShareholder() {
        this.formModel.holders = [
          ...this.formModel.holders,
          ...[shareholderModel()]
        ];
      },

      removeShareholder(item) {
        const idx = this.formModel.holders.indexOf(item);
        if (idx !== -1) {
          this.formModel.holders.splice(idx, 1);
          this.formModel.holders = [...new Set(this.formModel.holders)];
        }
      },

      shareholdersFilter(keepUser) {
        return {
          profile: {
            '!_id':this.formModel.holders.map((h) => h.account).filter((u) => u !== keepUser)
          }
        }
      },

      toPercent(amount) {
        return this.$options.filters
          .currency(
            (amount / this.formModel.maxSupply) * 100,
            {
              symbol: '%',
              symbolPosition: false
            }
          );
      },

      assetSymbolIsValid() {
        return !this.$$assetInfo(this.formModel.symbol);
      },

      redirect() {
        this.$router.push({
          name: 'project.details',
          params: {
            researchExternalId: this.project.externalId
          }
        });
      },

      cancel() {
        this.$router.push({
          name: 'project.details',
          params: {
            researchExternalId: this.project.externalId
          }
        });
      },

      createAsset() {
        this.loading = true;
        const DEFAULT_PRECISION = 0;

        const data = [
          {
            privKey: this.$currentUser.privKey,
            username: this.$currentUserName
          },
          {
            researchExternalId: this.project.externalId,
            researchGroup: this.project.researchGroup.external_id,
            symbol: this.formModel.symbol,
            precision: DEFAULT_PRECISION,
            description: '',
            maxSupply: parseInt(this.formModel.maxSupply + '0'.repeat(DEFAULT_PRECISION)),
            holders: [
              this.teamTokens,
              ...this.formModel.holders
            ].map((holder) => ({
              account: holder.account,
              amount: this.$$toAssetUnits({
                amount: holder.amount,
                assetId: this.formModel.symbol,
                precision: DEFAULT_PRECISION
              }, false)
            }))
          }
        ];

        this.$store.dispatch('Assets/createAsset', data)
          .then(() => {
            this.redirect();
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('An error occurred while creating asset, please try again later');
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>
