<template>
  <d-layout-full-screen
    title="Issue tokens"
  >
    <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
      <v-form v-if="$ready" :disabled="loading || projectTokenized" @submit.prevent="handleSubmit(createAsset)">
        <d-stack gap="32">
          <d-block title="Project token details" title-margin="16">
            <div class="text-body-2">
              Project: {{ project.title }}
            </div>

            <v-row>
              <v-col cols="8">
                <validation-provider
                  ref="validator"
                  v-slot="{ errors }"
                  name="Number of tokens"
                  rules="required"
                >
                  <v-text-field
                    v-model.number="formModel.maxSupply"
                    label="Total number of tokens to issue"
                    outlined
                    hide-details="auto"
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="4">
                <validation-provider
                  ref="validator1"
                  v-slot="{ errors }"
                  name="Ticker"
                  :rules="{ asset: { assets: existingAssets } }"
                >
                  <v-text-field
                    v-model="formModel.symbol"
                    v-mask="assetMask"
                    label="Ticker (abbreviation)"
                    outlined
                    hide-details="auto"
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <div class="text-body-2">
              Note: 2,000 to 20,000 tokens are usualy issued per project.
            </div>
          </d-block>

          <d-block title="Shareholders" title-margin="16">
            <div class="text-body-2">
              Note: Only tokens that belong to a group can be used for fundraising.
            </div>
            <!--        <pre>{{ project }}</pre>-->
            <d-timeline>
              <d-timeline-item :dot-top="16">
                <v-row class="align-center">
                  <v-col cols="6">
                    <user-selector
                      :users="teamTokens.account"
                      :value="teamTokens.account"
                      label="Shareholder"
                      outlined
                      hide-details="auto"
                      disabled
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      label="Tokens"
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
                <v-row class="align-center">
                  <v-col cols="6">
                    <user-selector
                      v-model="item.account"
                      label="Shareholder"
                      outlined
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="item.amount"
                      label="Tokens"
                      outlined
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col class="text-body-2">
                    {{ toPercent(item.amount) }}
                  </v-col>
                  <v-col cols="auto">
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
                  v-slot="{ errors, validate }"
                  name="Confirmation"
                  :rules="{required: {allowFalse: false}}"
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
                  I agree to the Terms and Conditions listed below
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
                  I understand that issued tokens will be distributed among shareholders,
                  effectively transferring ownership over the property related to the project.
                  Holding a share does not grant access to participate on decisions related to the project.
                  It’s not possible to undo this action.
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
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                :disabled="invalid"
                :loading="loading"
                @click="createAsset()"
              >
                Submit
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
  import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
  // import createNumberMask from 'text-mask-addons/dist/createNumberMask';

  const shareholderModel = () => ({
    account: null,
    amount: null
  });

  extend('asset', {
    params: ['assets'],
    computesRequired: true,

    validate(value, { assets }) {
      const res = {
        required: true,
        valid: true
      };

      if (['', null, undefined, ...assets.map((a) => a.toLowerCase())].includes(value)) {
        res.valid = false;
      }

      return res;
    },

    message(name, data) {
      // eslint-disable-next-line no-underscore-dangle
      if (data.assets.map((a) => a.toLowerCase()).includes(data._value_)) {
        return 'This ticker (abbreviation) is taken. Try another';
      }

      // eslint-disable-next-line no-underscore-dangle
      return `${data._field_} can't be empty`;
    }
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
      DLayoutFullScreen,

      ValidationObserver,
      ValidationProvider
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
            },
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
        const tokensSpend = this.formModel.holders.map((s) => s.amount)
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
          this.formModel.holders = [...new Set(this.internalValue)];
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

      createAsset() {
        this.loading = true;

        const data = [
          {
            privKey: this.$currentUser.privKey,
            username: this.$currentUserName
          },
          {
            researchExternalId: this.project.externalId,
            researchGroup: this.project.researchGroup.external_id,
            symbol: this.formModel.symbol,
            precision: 2,
            description: '',
            maxSupply: parseInt(this.formModel.maxSupply + '0'.repeat(2)),
            holders: [
              this.teamTokens,
              ...this.formModel.holders
            ].map((holder) => ({
              account: holder.account,
              amount: this.$$toAssetUnits({
                amount: holder.amount,
                assetId: this.formModel.symbol,
                precision: 2
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
