<template>
  <div class="">
    <v-row no-gutters>
      <v-col>
        <v-menu
          v-model="dateMenu"
          class="width-6"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          :nudge-top="20"
          min-width="0px"
        >
          <template v-slot:activator="{on}">
            <v-text-field
              ref="datePicker"
              v-model="date"
              filled
              :label="label"
              :rules="[() => !time || !datetime || ($refs.errorMsg && $refs.errorMsg.valid) || '']"
              readonly
              v-on="on"
            />
          </template>

          <v-date-picker
            v-model="date"
            no-title
            :allowed-dates="checkAllowedDate"
            @input="dateMenu = false; apply();"
          />
        </v-menu>

      </v-col>
      <v-col offset="1">
        <v-menu
          bottom
          left
          offset-y
          :nudge-top="20"
        >
          <template v-slot:activator="{on}">
            <v-text-field
              ref="timePicker"
              v-model="time"
              filled
              :rules="[() => !date || !datetime || ($refs.errorMsg && $refs.errorMsg.valid) || '']"
              label="Time"
              append-icon="event"
              readonly
              v-on="on"
            />
          </template>

          <div class="time-points-list">
            <v-list>
              <v-list-item
                v-for="(timePoint, i) in timePoints5minStep"
                v-show="checkAllowedTime(date, timePoint)"
                :key="i"
                @click="time = timePoint; apply();"
              >
                <v-list-item-title>{{ timePoint }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </v-menu>
      </v-col>
    </v-row>

    <v-text-field
      ref="errorMsg"
      v-model="datetime"
      class="datetime-picker-error-hack"
      :rules="rules"
    />
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'DatetimePicker',

    props: {
      label: { type: String, default: '' },
      rules: { required: false, type: Array, default: () => [] },
      availableFromNow: { required: false, type: Boolean, default: false },

      datetime: {
        required: true,
        validator(value) {
          return value === undefined || typeof value === 'string';
        }
      }
    },

    data() {
      return {
        date: undefined,
        time: undefined,
        dateMenu: false,
        timePoints15minStep: [
          '00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45',
          '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45',
          '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45',
          '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45',
          '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45',
          '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45',
          '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45',
          '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45',
          '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45',
          '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45',
          '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45',
          '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45'
        ],
        timePoints5minStep: [
          '00:00', '00:05', '00:10', '00:15', '00:20', '00:25', '00:30', '00:35', '00:40', '00:45', '00:50', '00:55',
          '01:00', '01:05', '01:10', '01:15', '01:20', '01:25', '01:30', '01:35', '01:40', '01:45', '01:50', '01:55',
          '02:00', '02:05', '02:10', '02:15', '02:20', '02:25', '02:30', '02:35', '02:40', '02:45', '02:50', '02:55',
          '03:00', '03:05', '03:10', '03:15', '03:20', '03:25', '03:30', '03:35', '03:40', '03:45', '03:50', '03:55',
          '04:00', '04:05', '04:10', '04:15', '04:20', '04:25', '04:30', '04:35', '04:40', '04:45', '04:50', '04:55',
          '05:00', '05:05', '05:10', '05:15', '05:20', '05:25', '05:30', '05:35', '05:40', '05:45', '05:50', '05:55',
          '06:00', '06:05', '06:10', '06:15', '06:20', '06:25', '06:30', '06:35', '06:40', '06:45', '06:50', '06:55',
          '07:00', '07:05', '07:10', '07:15', '07:20', '07:25', '07:30', '07:35', '07:40', '07:45', '07:50', '07:55',
          '08:00', '08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35', '08:40', '08:45', '08:50', '08:55',
          '09:00', '09:05', '09:10', '09:15', '09:20', '09:25', '09:30', '09:35', '09:40', '09:45', '09:50', '09:55',
          '10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30', '10:35', '10:40', '10:45', '10:50', '10:55',
          '11:00', '11:05', '11:10', '11:15', '11:20', '11:25', '11:30', '11:35', '11:40', '11:45', '11:50', '11:55',
          '12:00', '12:05', '12:10', '12:15', '12:20', '12:25', '12:30', '12:35', '12:40', '12:45', '12:50', '12:55',
          '13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55',
          '14:00', '14:05', '14:10', '14:15', '14:20', '14:25', '14:30', '14:35', '14:40', '14:45', '14:50', '14:55',
          '15:00', '15:05', '15:10', '15:15', '15:20', '15:25', '15:30', '15:35', '15:40', '15:45', '15:50', '15:55',
          '16:00', '16:05', '16:10', '16:15', '16:20', '16:25', '16:30', '16:35', '16:40', '16:45', '16:50', '16:55',
          '17:00', '17:05', '17:10', '17:15', '17:20', '17:25', '17:30', '17:35', '17:40', '17:45', '17:50', '17:55',
          '18:00', '18:05', '18:10', '18:15', '18:20', '18:25', '18:30', '18:35', '18:40', '18:45', '18:50', '18:55',
          '19:00', '19:05', '19:10', '19:15', '19:20', '19:25', '19:30', '19:35', '19:40', '19:45', '19:50', '19:55',
          '20:00', '20:05', '20:10', '20:15', '20:20', '20:25', '20:30', '20:35', '20:40', '20:45', '20:50', '20:55',
          '21:00', '21:05', '21:10', '21:15', '21:20', '21:25', '21:30', '21:35', '21:40', '21:45', '21:50', '21:55',
          '22:00', '22:05', '22:10', '22:15', '22:20', '22:25', '22:30', '22:35', '22:40', '22:45', '22:50', '22:55',
          '23:00', '23:05', '23:10', '23:15', '23:20', '23:25', '23:30', '23:35', '23:40', '23:45', '23:50', '23:55'
        ]
      };
    },

    watch: {
      datetime(newValue) {
        this.setValues();

        setTimeout(() => {
          this.$refs.datePicker.validate();
          this.$refs.timePicker.validate();
        }, 1);
      }
    },

    created() {
      this.setValues();
    },

    methods: {
      apply() {
        if (this.date && this.time) {
          this.$emit('input', `${this.date} ${this.time}`);
        }
      },

      setValues() {
        if (this.datetime) {
          this.date = this.datetime.split(' ')[0];
          this.time = this.datetime.split(' ')[1];
        } else {
          this.date = undefined;
          this.time = undefined;
        }
      },

      checkAllowedDate(date) {
        if (!this.availableFromNow) {
          return true;
        }

        return moment().subtract(1, 'day').valueOf() < Date.parse(date);
      },

      checkAllowedTime(date, time) {
        if (!date) {
          return true;
        }

        return moment().valueOf() < Date.parse(`${date} ${time}`);
      }
    }
  };
</script>

<style lang="less">
    .time-points-list {
        max-height: 250px;
    }

    .datetime-picker-error-hack.v-text-field {
        padding: 0px;
        // position: absolute;
        top: 48px;
        width: 100%;
        margin-top: 0px;

        & > .v-input__control > .v-input__slot {
            display: none;
        }
    }
</style>
