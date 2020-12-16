<template>
  <d-layout-full-screen title="Create fundraising">
    <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
      <v-form :disabled="loading" @submit.prevent="handleSubmit(createFundraising)">
        <d-stack gap="32">
          <d-block
            title="Determine the number of security token units"
            compact
          >
            <v-row>
              <v-col cols="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Units"
                  :rules="{
                    required: true,
                    minMaxValue: {
                      min: MIN_TOKEN_UNITS_TO_SELL,
                      max: issuedTokens.amount
                    }
                  }"
                >
                  <v-text-field
                    v-model="formData.amount"
                    v-mask="'#####'"
                    outlined
                    persistent-hint
                    :error-messages="errors"
                    :suffix="issuedTokens.assetId"
                    :hint="amountHint(formData.amount)"
                  >
                    <template #message="{ message }">
                      <div class="text-caption" v-html="message" />
                    </template>
                  </v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
          </d-block>

          <d-block
            title="Select start and end dates of project fundraise"
            compact
          >
            <v-row>
              <v-col cols="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Start date"
                  vid="startDate"
                  rules="required|dateSmaller:@endDate"
                >
                  <d-date-time-input
                    v-model="formData.startDate"
                    :error-messages="errors"
                    label="Start date"
                    only-future
                  />
                </validation-provider>
              </v-col>
              <v-col cols="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="End date"
                  vid="endDate"
                  rules="required|dateGreater:@startDate"
                >
                  <d-date-time-input
                    v-model="formData.endDate"
                    :error-messages="errors"
                    label="End date"
                    only-future
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </d-block>

          <d-block
            title="Select min and max amounts"
            compact
          >
            <v-row>
              <v-col cols="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Min"
                  vid="softCup"
                  rules="assetSmaller:@hardCup"
                >
                  <d-asset-input
                    v-model="formData.softCap"
                    required
                    :error-messages="errors"
                    label="Min"
                    @change="equalizeAsset"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Max"
                  vid="hardCup"
                  rules="assetGreater:@softCup"
                >
                  <d-asset-input
                    v-model="formData.hardCap"
                    label="Max"
                    :error-messages="errors"
                    required
                    disable-assets
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </d-block>

          <v-divider />

          <div class="d-flex align-center">
            <v-spacer />
            <d-stack horizontal gap="8">
              <v-btn
                type="button"
                text
                color="primary"
                :disabled="loading"
                @click="$router.back()"
              >
                Cancel
              </v-btn>

              <v-btn
                type="submit"
                color="primary"
                class="ml-2"
                :loading="loading"
                :disabled="invalid || loading"
              >
                Start
              </v-btn>
            </d-stack>
          </div>
        </d-stack>
      </v-form>
    </validation-observer>
  </d-layout-full-screen>
</template>

<script>
  import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import { mapGetters } from 'vuex';
  import { hasValue } from '@/utils/helpers';
  import { assetsChore } from '@/mixins/chores';
  import DDateTimeInput from '@/components/Deipify/DInput/DDateTimeInput';
  import moment from 'moment';
  import DAssetInput from '@/components/Deipify/DInput/DAssetInput';

  const MIN_TOKEN_UNITS_TO_SELL = 100;

  extend('dateSmaller', {
    params: ['target'],
    validate(value, { target }) {
      if (!target) return true;

      return new Date(value) < new Date(target);
    },

    message: '{_field_} should be smaller than {target}'
  });

  extend('dateGreater', {
    params: ['target'],
    validate(value, { target }) {
      if (!target) return true;

      return new Date(value) > new Date(target);
    },
    message: '{_field_} should be greater than {target}'
  });

  extend('assetSmaller', {
    params: ['target'],
    validate(value, { target }) {
      if (!(target && target.amount) || !(value && value.amount)) return true;
      return parseFloat(value.amount) < parseFloat(target.amount);
    },

    message: '{_field_} should be smaller than {target}'
  });

  extend('assetGreater', {
    params: ['target'],
    validate(value, { target }) {
      if (!(target && target.amount) || !(value && value.amount)) return true;

      return parseFloat(value.amount) > parseFloat(target.amount);
    },
    message: '{_field_} should be greater than {target}'
  });

  export default {
    name: 'FundraisingCreate',
    components: {
      DAssetInput,
      DDateTimeInput,
      DBlock,
      DStack,

      DLayoutFullScreen
    },

    mixins: [
      assetsChore
    ],

    data() {
      const rounded = Math.round(moment()
        .minute() / 5) * 5;
      const startDate = moment()
        .minute(rounded)
        .add(10, 'minutes')
        .format('YYYY-MM-DDTHH:mm');

      return {
        MIN_TOKEN_UNITS_TO_SELL,

        formData: {
          amount: undefined,
          startDate,
          endDate: undefined,
          softCap: {},
          hardCap: {}
        },

        loading: false,
        availableTokens: null
      };
    },

    computed: {
      ...mapGetters({
        project: 'Project/projectDetails'
      }),

      issuedTokens() {
        if (hasValue(this.project.securityTokens)) {
          return this.$$fromAssetUnits(this.project.securityTokens[0]);
        }

        return null;
      }
    },

    created() {
      this.availableTokens = this.issuedTokens.amount;

      this.$store.dispatch('Assets/getTeamBalance', [
        this.project.researchGroup.external_id,
        this.issuedTokens.assetId
      ]).then((res) => {
        this.availableTokens = this.$$fromAssetUnits(res.amount);
      });
    },

    methods: {
      redirect() {
        this.$router.push({
          name: 'project.details',
          params: this.$route.params
        });
      },

      formatDate(val) {
        return new Date(val).toISOString()
          .split('.')[0];
      },

      createFundraising() {
        this.loading = true;
        const isProposal = !this.project.researchGroup.is_personal;
        const securityTokensOnSale = [
          this.$$toAssetUnits({
            ...this.issuedTokens,
            ...{ amount: this.formData.amount }
          }, false)
        ];

        const data = [
          {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.account.name
          },
          isProposal,
          {
            researchGroup: this.project.researchGroup.external_id,
            researchExternalId: this.project.externalId,
            startTime: this.formatDate(this.formData.startDate),
            endTime: this.formatDate(this.formData.endDate),
            securityTokensOnSale,
            softCap: this.$$toAssetUnits(this.formData.softCap, false),
            hardCap: this.$$toAssetUnits(this.formData.hardCap, false),
            extensions: []
          }
        ];

        this.$store.dispatch('Fundraising/create', data)
          .then(() => {
            this.$notifier.showSuccess('Fundraise has been created successfully!');
            this.redirect();
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('An error occurred while creating asset, please try again later');
          })
          .finally(() => {
            this.loading = false;
          });
      },

      amountHint(val) {
        if (!val) return '';

        const messages = [
          `${this.toPercent(val)} of ${this.$$toAssetUnits(this.issuedTokens)} issued tokens`
        ];
        if (this.issuedTokens.amount > this.availableTokens.amount) {
          messages.push(
            `${this.toPercent(val, this.availableTokens)} of ${this.$$toAssetUnits(this.availableTokens)} team's tokens`
          );
        }

        return messages.join('<br>');
      },

      toPercent(val, from) {
        if (!val) return '';
        const target = from || this.issuedTokens;
        const pc = (val / target.amount) * 100;

        return `${Math.round(pc * 100) / 100}%`;
      },

      equalizeAsset() {
        this.formData.hardCap = {
          ...this.formData.hardCap,
          assetId: this.formData.softCap.assetId
        };
      }
    }
  };
</script>
