<template>
    <div>
        <div class="row">
            <v-menu class="width-6"
                lazy
                :close-on-content-click="false"
                v-model="dateMenu"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-top="20"
                min-width="0px"
            >
                <v-text-field
                    slot="activator"
                    :label="label"
                    placeholder="Date"
                    v-model="date"
                    readonly
                ></v-text-field>

                <v-date-picker
                    no-title
                    v-model="date" 
                    @input="dateMenu = false; apply();"
                ></v-date-picker>
            </v-menu>

            <v-menu class="col-grow" bottom left offset-y :nudge-top="20">
                <v-text-field
                    slot="activator"
                    placeholder="Time"
                    v-model="time"
                    append-icon="event"
                    readonly
                ></v-text-field>

                <div class="time-points-list">
                    <v-list>
                        <v-list-tile @click="time = timePoint; apply();"
                            v-for="(timePoint, i) in timePoints" :key="i"
                        >
                            <v-list-tile-title>{{ timePoint }}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </div>
            </v-menu>
        </div>
    </div>
</template>

<script>
    export default {
        name:'DatetimePicker',
        props: {
            datetime: { 
                required: true,
                validator(value) {
                    return value === undefined || typeof value === 'string';
                }
            },
            label: { type: String, default: '' }
        },
        data() {
            return {
                date: undefined,
                time: undefined,
                dateMenu: false,

                timePoints: [
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
                    '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45',
                ]
            }
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
            }
        },
        created(){
            this.setValues();
        }
    }
</script>

<style lang="less" scoped>
    .time-points-list {
        max-height: 250px;
    }
</style>
