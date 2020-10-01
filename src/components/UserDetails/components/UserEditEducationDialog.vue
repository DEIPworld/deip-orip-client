<template>
  <full-screen-view :title="$t('userDetailRouting.educationDialog.title')">
    <v-form ref="form" v-model="isFormValid">
      <d-form-block :title="$t('userDetailRouting.educationDialog.educationalBlock.title')">
        <v-col cols="5">
          <v-text-field
            v-model="formData.educationalInstitution"
            outlined
            :label="$t('userDetailRouting.educationDialog.educationalBlock.educationalField')"
            :rules="[ rules.required ]"
          />
        </v-col>
      </d-form-block>
      <d-form-block :title="$t('userDetailRouting.educationDialog.datesBlock.title')">
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
                :label="$t('userDetailRouting.educationDialog.datesBlock.fromField')"
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
                :label="$t('userDetailRouting.educationDialog.datesBlock.toField')"
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
            :label="$t('userDetailRouting.educationDialog.datesBlock.inProgressField')"
            hide-details
            style="max-width: 140px"
          />
        </v-col>
      </d-form-block>
      <d-form-block :title="$t('userDetailRouting.educationDialog.obtainedBlock.title')">
        <v-col cols="5">
          <v-text-field
            v-model="formData.degree"
            outlined
            :label="$t('userDetailRouting.educationDialog.obtainedBlock.obtainedField')"
            :rules="[ rules.required ]"
          />
        </v-col>
      </d-form-block>
      <d-form-block :title="$t('userDetailRouting.educationDialog.studyBlock.title')">
        <v-col cols="5">
          <v-text-field
            v-model="formData.area"
            outlined
            :label="$t('userDetailRouting.educationDialog.studyBlock.studyField')"
            :rules="[ rules.required ]"
          />
        </v-col>
      </d-form-block>
      <d-form-block :title="$t('userDetailRouting.educationDialog.descriptionBlock.title')">
        <v-col cols="12">
          <v-textarea
            v-model="formData.description"
            outlined
            :rows="6"
            auto-grow
            :label="$t('userDetailRouting.educationDialog.descriptionBlock.descriptionField')"
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
            {{ $t('userDetailRouting.educationDialog.cancel') }}
          </v-btn>
          <v-btn
            class="ma-0"
            color="primary"
            :disabled="isProcessing"
            :loading="isProcessing"
            @click="save()"
          >
            {{ $t('userDetailRouting.educationDialog.submitBtn') }}
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
      ...mapGetters({
        currentUser: 'auth/user'
      })
      // disabled() {
      //   return !this.isFormValid;
      // }
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
            this.$notifier.showSuccess(`"${this.formData.educationalInstitution}" Institute has been saved successfully!"`);
          }, (err) => {
            this.$notifier.showError(`An error occurred while saving "${this.formData.educationalInstitution}" details, please try again later`);
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
