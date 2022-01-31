<template>
  <full-screen-view :title="$t('userDetailRouting.employmentDialog.title')">
    <v-form ref="form" v-model="isFormValid">
      <d-form-block :title="$t('userDetailRouting.employmentDialog.companyBlock.title')">
        <v-col cols="5">
          <v-text-field
            v-model="formData.company"
            outlined
            :label="$t('userDetailRouting.employmentDialog.companyBlock.companyField')"
            :rules="[rules.required]"
          />
        </v-col>
      </d-form-block>

      <d-form-block :title="$t('userDetailRouting.employmentDialog.locationBlock.title')">
        <v-col cols="5">
          <v-text-field
            v-model="formData.location.city"
            outlined
            :label="$t('userDetailRouting.employmentDialog.locationBlock.cityField')"
            :rules="[rules.required]"
          />
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="formData.location.country"
            outlined
            :label="$t('userDetailRouting.employmentDialog.locationBlock.countryField')"
            :rules="[rules.required]"
          />
        </v-col>
      </d-form-block>

      <d-form-block :title="$t('userDetailRouting.employmentDialog.periodBlock.title')">
        <v-col cols="5">
          <v-menu
            v-model="dateFromMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                ref="dateFromInput"
                v-model="formData.period.from"
                outlined
                :label="$t('userDetailRouting.employmentDialog.periodBlock.fromField')"
                append-icon="event"
                :rules="[
                  rules.required,
                  rules.startDateValidation
                ]"
                readonly
                v-on="on"
              />
            </template>
            <v-date-picker v-model="formData.period.from" type="month" @input="dateFromMenu = false" />
          </v-menu>
        </v-col>
        <v-col cols="5">
          <v-menu
            v-model="dateToMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
            :disabled="formData.isActive"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                ref="dateToInput"
                v-model="formData.period.to"
                outlined
                :label="$t('userDetailRouting.employmentDialog.periodBlock.toField')"
                append-icon="event"
                :disabled="formData.isActive"
                :rules="[
                  rules.requiredDateTo,
                  rules.endDateValidation
                ]"
                readonly
                v-on="on"
              />
            </template>

            <v-date-picker v-model="formData.period.to" type="month" @input="dateToMenu = false" />
          </v-menu>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            v-model="formData.isActive"
            class="ma-0 pa-0"
            :label="$t('userDetailRouting.employmentDialog.periodBlock.isPresentField')"
            hide-details
            style="max-width: 125px"
          />
        </v-col>
      </d-form-block>

      <d-form-block :title="$t('userDetailRouting.employmentDialog.positionBlock.title')">
        <v-col cols="5">
          <v-text-field
            v-model="formData.position"
            outlined
            :label="$t('userDetailRouting.employmentDialog.positionBlock.positionField')"
            :rules="[rules.required]"
          />
        </v-col>
      </d-form-block>

      <d-form-block :title="$t('userDetailRouting.employmentDialog.descriptionBlock.title')">
        <v-col cols="12">
          <v-textarea
            v-model="formData.description"
            outlined
            :rows="6"
            auto-grow
            :label="$t('userDetailRouting.employmentDialog.descriptionBlock.descriptionField')"
          />
        </v-col>
      </d-form-block>

      <div class="text-right">
        <slot name="buttons">
          <v-btn
            class="ma-0"
            color="primary"
            :disabled="isProcessing"
            text
            @click.native="$router.back()"
          >
            {{ $t('userDetailRouting.employmentDialog.cancel') }}
          </v-btn>
          <v-btn
            class="ma-0"
            color="primary"
            :disabled="isProcessing"
            :loading="isProcessing"
            @click="save()"
          >
            {{ $t('userDetailRouting.employmentDialog.submitBtn') }}
          </v-btn>
        </slot>
      </div>
    </v-form>
  </full-screen-view>
</template>

<script>
  import _ from 'lodash';
  import moment from 'moment';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';
  import { UserService } from '@deip/user-service';
  import { expandAttributes, compactAttributes } from '@/utils/helpers';

  const userService = UserService.getInstance();

  export default {
    name: 'UserEditEmploymentDialog',
    components: {
      FullScreenView,
      DFormBlock
    },
    data() {
      return {
        formData: {
          company: undefined,
          location: {
            city: undefined,
            country: undefined
          },
          description: undefined,
          isActive: false,
          period: {
            to: undefined,
            from: undefined
          },
          position: undefined
        },
        dateFromMenu: false,
        dateToMenu: false,
        isProcessing: false,

        isFormValid: false,

        rules: {
          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required'),
          requiredDateTo: (value) => this.formData.isActive || !!value || this.$t('defaultNaming.fieldRules.required'),
          startDateValidation: (value) => {
            if (!value || !this.formData.period.to) {
              return true;
            }

            return Date.parse(value) < Date.parse(this.formData.period.to) ? true : this.$t('defaultNaming.fieldRules.startDate');
          },
          endDateValidation: (value) => {
            if (!value || !this.formData.period.from) {
              return true;
            }

            return Date.parse(value) > Date.parse(this.formData.period.from) ? true : this.$t('defaultNaming.fieldRules.endDate');
          }
        }
      };
    },

    computed: {
      attrId() {
        return this.$route.query.attr || this.$$userAttributes.find(({ type }) => type === 'employment')._id;
      }
    },
    watch: {
      'formData.isActive': function () {
        if (this.formData.isActive) {
          this.formData.period.to = undefined;
        }

        this.$refs.dateToInput.validate();
      }
    },
    created() {
      if (this.$route.query.index) {
        const userEmployment = this.$currentUser.profile.attributes.find(
          ({ attributeId }) => attributeId === this.attrId
        ).value[this.$route.query.index];
        this.formData = {
          company: userEmployment.company,
          location: {
            city: userEmployment.location.city,
            country: userEmployment.location.country
          },
          description: userEmployment.description,
          isActive: userEmployment.isActive,
          period: {
            to: moment(userEmployment.period.to).format('YYYY-MM'),
            from: moment(userEmployment.period.from).format('YYYY-MM')
          },
          position: userEmployment.position
        };
      }
    },
    methods: {
      save() {
        if (!this.$refs.form.validate()) return;
        const userAttributes = expandAttributes(this.$currentUser.profile.attributes);

        this.isProcessing = true;
        const update = {};
        if (!this.$route.query.index) { // new employment
          userAttributes[this.attrId] = userAttributes[this.attrId]
            ? userAttributes[this.attrId] = [
              ...userAttributes[this.attrId], this.formData
            ]
            : userAttributes[this.attrId] = [this.formData];
          Object.assign(update, {
            ...this.$currentUser.profile,
            attributes: [
              ...compactAttributes(userAttributes)
            ]
          });
        } else { // edited employment
          userAttributes[this.attrId] = userAttributes[this.attrId].reduce(
            (accum, current, i) => {
              if (i == this.$route.query.index) {
                return accum.concat(this.formData);
              }
              return accum.concat(current);
            }, []
          );
          Object.assign(update, {
            ...this.$currentUser.profile,
            attributes: [
              ...compactAttributes(userAttributes)
            ]
          });
        }

        userService.updateUser({
          initiator: {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.username
          },
          ...update
        })
          .then(() => {
            this.$notifier.showSuccess(this.$t('userDetailRouting.employmentDialog.emplSaveSucc', { company: this.formData.company }));
            return this.$store.dispatch('Auth/getCurrentUser');
          }, (err) => {
            this.$notifier.showError(this.$t('userDetailRouting.employmentDialog.emplSaveFail', { company: this.formData.company }));
            console.error(err);
          })
          .finally(() => {
            this.isProcessing = false;
            this.$router.back();
          });
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
