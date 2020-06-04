<template>
  <v-dialog
    v-model="meta.isShown"
    persistent
    transition="scale-transition"
    max-width="600px"
  >
    <v-card class="pa-6" light>
      <v-card-title>
        <div class="headline">
          Education
        </div>
        <div class="right-top-angle">
          <v-btn icon class="pa-0 ma-0" @click.native="meta.isShown = false">
            <v-icon color="black">
              close
            </v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text class="black--text">
        <v-form ref="form" v-model="isFormValid">
          <div class="subtitle-1 font-weight-bold">
            Educational institution
          </div>
          <v-text-field
            v-model="educationalInstitution"
            label="Educational institution"
            :rules="[ rules.required ]"
          />

          <div class="subtitle-1 font-weight-bold">
            Dates attended
          </div>
          <v-row no-gutters>
            <v-col cols="5" class="pr-4">
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
                    v-model="dateFrom"
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
                <v-date-picker v-model="dateFrom" type="month" @input="dateFromMenu = false" />
              </v-menu>
            </v-col>

            <v-col cols="5" class="pl-4">
              <v-menu
                v-model="dateToMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
                :disabled="isActive"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    ref="dateToInput"
                    v-model="dateTo"
                    label="To"
                    append-icon="event"
                    :disabled="isActive"
                    :rules="[
                      rules.requiredDateTo,
                      rules.endDateValidation
                    ]"
                    readonly
                    v-on="on"
                  />
                </template>

                <v-date-picker v-model="dateTo" type="month" @input="dateToMenu = false" />
              </v-menu>
            </v-col>
          </v-row>

          <v-checkbox
            v-model="isActive"
            class="ma-0 pa-0 pb-4"
            label="In progress"
            hide-details
            style="max-width: 140px"
          />

          <div class="subtitle-1 font-weight-bold">
            Degree obtained
          </div>
          <v-text-field
            v-model="degree"
            label="Degree obtained"
            :rules="[ rules.required ]"
          />

          <div class="subtitle-1 font-weight-bold">
            Area of study
          </div>
          <v-text-field
            v-model="area"
            label="Area of study"
            :rules="[ rules.required ]"
          />

          <div class="subtitle-1 font-weight-bold">
            Description <span class="caption grey--text">(optional)</span>
          </div>
          <v-textarea
            v-model="description"
            :rows="2"
            auto-grow
            filled
            label="Description"
          />

          <div class="display-flex flex-column">
            <div class="py-2">
              <v-btn
                class="ma-0"
                color="primary"
                :disabled="disabled"
                block
                @click="save()"
              >
                Save
              </v-btn>
            </div>
            <div class="py-2">
              <v-btn
                class="ma-0"
                color="primary"
                block
                text
                @click.native="meta.isShown = false"
              >
                Cancel
              </v-btn>
            </div>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import _ from 'lodash';
  import moment from 'moment';

  export default {
    name: 'UserEditEducationDialog',
    props: {
      meta: { type: Object, required: true }
    },
    data() {
      return {
        educationalInstitution: undefined,
        dateFrom: undefined,
        dateFromMenu: false,
        dateTo: undefined,
        dateToMenu: false,
        degree: undefined,
        area: undefined,
        description: undefined,
        isActive: false,

        isFormValid: false,

        rules: {
          required: (value) => !!value || 'This field is required',
          requiredDateTo: (value) => this.isActive || !!value || 'This field is required',
          startDateValidation: (value) => {
            if (!value || !this.dateTo) {
              return true;
            }

            return Date.parse(value) < Date.parse(this.dateTo) ? true : 'Start date should be smaller than end date';
          },
          endDateValidation: (value) => {
            if (!value || !this.dateFrom) {
              return true;
            }

            return Date.parse(value) > Date.parse(this.dateFrom) ? true : 'End date should be greater than start date';
          }
        }
      };
    },
    computed: {
      disabled() {
        return !this.isFormValid;
      }
    },
    watch: {
      'meta.item': function (education) {
        this.educationalInstitution = education != null ? education.educationalInstitution : undefined;
        this.dateFrom = education != null ? moment(education.period.from).format('YYYY-MM') : undefined;
        this.dateFromMenu = false;
        this.dateTo = education != null ? moment(education.period.to).format('YYYY-MM') : undefined;
        this.dateToMenu = false;
        this.degree = education != null ? education.degree : undefined;
        this.area = education != null ? education.area : undefined;
        this.description = education != null ? education.description : undefined;
        this.isActive = education != null ? education.isActive : false;
      },
      isActive() {
        if (this.isActive) {
          this.dateTo = undefined;
        }

        this.$refs.dateToInput.validate();
      }
    },
    methods: {
      save() {
        this.$emit('saveEducation', {
          item: {
            educationalInstitution: this.educationalInstitution,
            period: {
              from: this.dateFrom,
              to: this.dateTo
            },
            degree: this.degree,
            area: this.area,
            description: this.description,
            isActive: this.isActive
          },
          index: this.meta.index
        });

        this.educationalInstitution = undefined;
        this.dateFrom = undefined;
        this.dateFromMenu = false;
        this.dateTo = undefined;
        this.dateToMenu = false;
        this.degree = undefined;
        this.area = undefined;
        this.description = undefined;
        this.isActive = false;
      }
    }
  };
</script>

<style lang="less" scoped>

</style>
