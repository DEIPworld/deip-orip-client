<template>
  <v-dialog
    v-model="meta.isShown"
    persistent
    transition="scale-transition"
    max-width="600px"
  >
    <v-card class="pa-6">
      <v-card-title>
        <div class="headline">
          Employment
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
            Company
          </div>
          <v-text-field
            v-model="company"
            label="Company"
            :rules="[rules.required]"
          />

          <div class="subtitle-1 font-weight-bold">
            Location
          </div>
          <v-row no-gutters>
            <v-col cols="6" class="pr-4">
              <v-text-field
                v-model="city"
                label="City"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="6" class="pl-4">
              <v-text-field
                v-model="country"
                label="Country"
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>

          <div class="subtitle-1 font-weight-bold">
            Period
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
                    :rules="[
                      rules.required,
                      rules.startDateValidation
                    ]"
                    readonly
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
            class="ma-0 pa-0"
            label="Is present"
            hide-details
            style="max-width: 125px"
          />

          <div class="subtitle-1 font-weight-bold pt-4">
            Position
          </div>
          <v-text-field
            v-model="position"
            label="Position"
            :rules="[rules.required]"
          />

          <div class="subtitle-1 font-weight-bold">
            Description
            <span class="caption grey--text">(optional)</span>
          </div>
          <v-textarea
            v-model="description"
            :rows="2"
            auto-grow
            label="Description"
          />

          <div class="display-flex flex-column">
            <div class="py-2">
              <v-btn
                class="ma-0"
                color="primary"
                block
                :disabled="disabled"
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
    name: 'UserEditEmploymentDialog',
    props: {
      meta: { type: Object, required: true }
    },
    data() {
      return {
        company: undefined,
        city: undefined,
        country: undefined,
        dateFrom: undefined,
        dateFromMenu: false,
        dateTo: undefined,
        dateToMenu: false,
        position: undefined,
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
      'meta.item': function (employment) {
        this.company = employment != null ? employment.company : undefined;
        this.city = employment != null && employment.location ? employment.location.city : undefined;
        this.country = employment != null && employment.location ? employment.location.country : undefined;
        this.dateFrom = employment != null ? moment(employment.period.from).format('YYYY-MM') : undefined;
        this.dateFromMenu = false;
        this.dateTo = employment != null ? moment(employment.period.to).format('YYYY-MM') : undefined;
        this.dateToMenu = false;
        this.position = employment != null ? employment.position : undefined;
        this.description = employment != null ? employment.description : undefined;
        this.isActive = employment != null ? employment.isActive : false;
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
        this.$emit('saveEmployment', {
          item: {
            company: this.company,
            location: {
              city: this.city,
              country: this.country
            },
            period: {
              from: this.dateFrom,
              to: this.dateTo
            },
            position: this.position,
            description: this.description,
            isActive: this.isActive
          },
          index: this.meta.index
        });

        this.company = undefined;
        this.city = undefined;
        this.country = undefined;
        this.dateFrom = undefined;
        this.dateFromMenu = false;
        this.dateTo = undefined;
        this.dateToMenu = false;
        this.position = undefined;
        this.description = undefined;
        this.isActive = false;
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
