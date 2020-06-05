<template>
  <full-screen-view title="Education">
    <v-form ref="form" v-model="isFormValid">
      <d-form-block title="Educational institution">
        <v-col cols="12">
          <v-text-field
            v-model="formData.educationalInstitution"
            filled
            label="Educational institution"
            :rules="[ rules.required ]"
          />
        </v-col>
      </d-form-block>
      <d-form-block title="Dates attended">
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
                readonly
                :rules="[
                  rules.required,
                  rules.startDateValidation
                ]"
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
            class="ma-0 pa-0 pb-4"
            label="In progress"
            hide-details
            style="max-width: 140px"
          />
        </v-col>
      </d-form-block>
      <d-form-block title="Degree obtained">
        <v-col cols="12">
          <v-text-field
            v-model="formData.degree"
            filled
            label="Degree obtained"
            :rules="[ rules.required ]"
          />
        </v-col>
      </d-form-block>
      <d-form-block title="Area of study">
        <v-col cols="12">
          <v-text-field
            v-model="formData.area"
            filled
            label="Area of study"
            :rules="[ rules.required ]"
          />
        </v-col>
      </d-form-block>
      <d-form-block title="Description (optional)">
        <v-col cols="12">
          <v-textarea
            v-model="formData.description"
            filled
            :rows="2"
            auto-grow
            filled
            label="Description"
          />
        </v-col>
      </d-form-block>

      <div class="text-right">
        <slot name="buttons">
          <v-btn
            class="ma-0"
            color="primary"
            text
            :disabled="isProcessing"
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
  import { mapGetters } from 'vuex';
  import { UserService } from '@deip/user-service';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';

  const userService = UserService.getInstance();

  export default {
    name: 'UserEditEducationDialog',
    components: {
      FullScreenView,
      DFormBlock
    },
    data() {
      return {
        formData: {
          educationalInstitution: undefined,
          period: {
            from: undefined,
            to: undefined
          },
          degree: undefined,
          area: undefined,
          description: undefined,
          isActive: undefined
        },
        isProcessing: false,
        dateFromMenu: false,
        dateToMenu: false,

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
      // disabled() {
      //   return !this.isFormValid;
      // }
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
        const userEducation = this.$store.getters['auth/user'].profile.education[this.$route.query.index];
        this.formData = {
          educationalInstitution: userEducation.educationalInstitution,
          period: {
            from: moment(userEducation.period.from).format('YYYY-MM'),
            to: moment(userEducation.period.to).format('YYYY-MM')
          },
          degree: userEducation.degree,
          area: userEducation.area,
          description: userEducation.description,
          isActive: userEducation.isActive
        };
      }
    },
    methods: {
      save() {
        if (!this.$refs.form.validate()) return;
        
        this.isProcessing = true;
        const update = {};
        if (!this.$route.query.index) { // new education
          const educationList = this.currentUser.profile.education.map((e) => e)
            .concat([this.formData]);
          Object.assign(update, this.currentUser.profile, { education: educationList });
        } else { // edited education
          const educationList = this.currentUser.profile.education.reduce(
            (accum, current, i) => {
              if (i == this.$route.query.index) {
                return accum.concat(this.formData);
              }
              return accum.concat(current);
            }, []
          );
          Object.assign(update, this.currentUser.profile, { education: educationList });
        }
        userService.updateUserProfile(this.currentUser.username, update)
          .then((res) => {
            this.$store.dispatch('auth/loadProfile', { username: this.currentUser.username });
            this.$notifier.showSuccess(`"${this.formData.educationalInstitution}" Institute has been saved successfully!"`)
          }, (err) => {
            this.$notifier.showError(`An error occurred while saving "${this.formData.educationalInstitution}" details, please try again later`)
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
