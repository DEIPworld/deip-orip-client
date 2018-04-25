<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Please Select Start and end day of the token sale</div>
            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto period-max-width c-pt-4">
                    <div class="col-12">
                        <v-menu
                            ref="menu1"
                            lazy
                            :close-on-content-click="false"
                            v-model="menu1"
                            transition="scale-transition"
                            offset-y
                            full-width
                            :nudge-right="40"
                            :return-value.sync="date1"
                            min-width="290px"
                        >
                            <v-text-field
                                slot="activator"
                                label="Start date"
                                v-model="date1"
                                prepend-icon="event"
                                readonly
                            ></v-text-field>

                            <v-date-picker v-model="date1" @input="$refs.menu1.save(date1)"></v-date-picker>
                        </v-menu>
                    </div>

                    <div class="col-12">
                        <v-menu
                            ref="menu2"
                            lazy
                            :close-on-content-click="false"
                            v-model="menu2"
                            transition="scale-transition"
                            offset-y
                            full-width
                            :nudge-right="40"
                            :return-value.sync="date2"
                            min-width="290px"
                        >
                            <v-text-field
                                slot="activator"
                                label="End date"
                                v-model="date2"
                                prepend-icon="event"
                                readonly
                            ></v-text-field>

                            <v-date-picker v-model="date2" @input="$refs.menu2.save(date2)"></v-date-picker>
                        </v-menu>
                    </div>

                </div>

            </div>
        </div>
        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            <v-btn color="primary" @click.native="nextStep()">Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TokenSalePeriod",
        data() { 
            return {
                date1: null,
                date2: null,
                menu1: false,
                menu2: false
            } 
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            }
        }
    };
</script>

<style lang="less" scoped>
    .period-max-width {
        max-width: 300px;
    }
</style>
