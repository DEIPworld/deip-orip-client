<template>
    <v-menu
        ref="menu"
        lazy
        :close-on-content-click="false"
        v-model="menu"
        transition="scale-transition"
        offset-y
        full-width
        :nudge-right="40"
        min-width="0px"
    >
        <v-text-field
            slot="activator"
            :label="label"
            v-model="actualDatetime"
            prepend-icon="event"
            readonly
        ></v-text-field>

        <div class="column" style="height: 477px;">
            <v-tabs color="primary" slot="extension" v-model="tab" grow dark>
                <!-- <v-tabs-slider color="black"></v-tabs-slider> -->

                <v-tab key="dateTab" disabled>
                    <v-icon>event</v-icon>
                </v-tab>

                <v-tab key="timeTab" disabled>
                    <v-icon>access_time</v-icon>
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab" class="">
                <v-tab-item key="dateTab">
                    <v-date-picker class="datetime-date-picker" 
                        v-model="date" 
                        @input="tab = '1'"
                    ></v-date-picker>
                </v-tab-item>

                <v-tab-item key="timeTab">
                    <v-time-picker class="datetime-time-picker"
                        ref="timePicker"
                        v-model="time"
                        scrollable
                        format="24hr"
                        actions
                    ></v-time-picker>
                </v-tab-item>
            </v-tabs-items>

            <v-btn class="ma-0" color="primary" @click="apply()">Ok</v-btn>
        </div>
    </v-menu>
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
                menu: false,
                tab: undefined
            }
        },
        watch: {
            menu(val) {
                if (val) {
                    if (this.$refs.timePicker) {
                        this.$refs.timePicker.selectingHour = true;
                    }

                    this.tab="0";
                    this.setValues();
                }
            }
        },
        computed: {
            actualDatetime() {
                return this.datetime ? this.datetime : '';
            }
        },
        methods: {
            apply() {
                if (this.date && this.time) {
                    this.$emit('input', `${this.date} ${this.time}`);
                    this.$refs.menu.save();
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

<style lang="less">
    .datetime-date-picker .picker__title {
        height: 102px;
    }

    .datetime-date-picker .picker__body {
        height: 290px;
    }

    .picker.datetime-date-picker,
    .picker.datetime-time-picker {
        border-radius: 0px 0px 2px 2px;
    }
</style>
