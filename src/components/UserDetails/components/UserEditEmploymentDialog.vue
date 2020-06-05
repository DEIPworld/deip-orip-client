<template>
  <full-screen-view title="Employment">
    <v-form ref="form" v-model="isFormValid">
      <d-form-block title="Company">
        <v-col cols="12">
          <v-text-field
            v-model="formData.company"
            filled
            label="Company"
            :rules="[rules.required]"
          />
        </v-col>
      </d-form-block>

      <d-form-block title="Location">
        <v-col>
          <v-text-field
            v-model="formData.location.city"
            filled
            label="City"
            :rules="[rules.required]"
          />
        </v-col>
        <v-col offset="1">
          <v-text-field
            v-model="formData.location.country"
            filled
            label="Country"
            :rules="[rules.required]"
          />
        </v-col>
      </d-form-block>

      <d-form-block title="Period">
        <v-col>
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
                filled
                label="From"
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
        <v-col offset="1">
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
                filled
                label="To"
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
            label="Is present"
            hide-details
            style="max-width: 125px"
          />
        </v-col>
      </d-form-block>

      <d-form-block title="Position">
        <v-col cols="12">
          <v-text-field
            v-model="formData.position"
            filled
            label="Position"
            :rules="[rules.required]"
          />
        </v-col>
      </d-form-block>

      <d-form-block title="Description (optional)">
        <v-col cols="12">
          <v-textarea
            v-model="formData.description"
            filled
            :rows="2"
            filled
            auto-grow
            label="Description"
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
            Cancel
          </v-btn>
          <v-btn
            class="ma-0"
            color="primary"
            :disabled="isProcessing"
            :loading="isProcessing"
            @click="save()"
          >
            Save
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
  import { mapGetters } from 'vuex';

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
          required: (value) => !!value || 'This field is required',
          requiredDateTo: (value) => this.formData.isActive || !!value || 'This field is required',
          startDateValidation: (value) => {
            if (!value || !this.formData.period.to) {
              return true;
            }

            return Date.parse(value) < Date.parse(this.formData.period.to) ? true : 'Start date should be smaller than end date';
          },
          endDateValidation: (value) => {
            if (!value || !this.formData.period.from) {
              return true;
            }

            return Date.parse(value) > Date.parse(this.formData.period.from) ? true : 'End date should be greater than start date';
          }
        }
      };
    },

    computed: {
      ...mapGetters({
        currentUser: 'auth/user'
      })
    //   disabled() {
    //     return !this.isFormValid;
    //   }
    },
    watch: {
      ['formData.isActive']() {
        if (this.formData.isActive) {
          this.formData.period.to = undefined;
        }

        this.$refs.dateToInput.validate();
      }
    },
    created() {
      if (this.$route.query.index) {
        const userEmployment = this.$store.getters['auth/user'].profile.employment[this.$route.query.index];
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

        this.isProcessing = true;
        const update = {};
        if (!this.$route.query.index) { // new education
          const employmentList = this.currentUser.profile.employment.map((e) => e)
            .concat([this.formData]);
          Object.assign(update, this.currentUser.profile, { employment: employmentList });
        } else { // edited education
          const employmentList = this.currentUser.profile.employment.reduce(
            (accum, current, i) => {
              if (i == this.$route.query.index) {
                return accum.concat(this.formData);
              }
              return accum.concat(current);
            }, []
          );
          Object.assign(update, this.currentUser.profile, { employment: employmentList });
        }

        userService.updateUserProfile(this.currentUser.username, update)
          .then((res) => {
            this.$store.dispatch('auth/loadProfile', { username: this.currentUser.username });
            this.$notifier.showSuccess(`"${this.formData.company}" employment has been saved successfully!"`)
          }, (err) => {
            this.$notifier.showError(`An error occurred while saving "${this.formData.company}" details, please try again later`)
            console.error(err);
          })
          .finally(() => {
            this.isProcessing = false;
            this.$router.back();
          });
      },
    }
  };
</script>

<style lang="less" scoped>
</style>
