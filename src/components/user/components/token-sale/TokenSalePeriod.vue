<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Please Select Start and end day of the token sale</div>
            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto period-max-width c-pt-4">
                    <div class="col-12">
                        <v-menu v-model="startDateMenu"
                            ref="startDateMenu"
                            lazy
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            full-width
                            :nudge-right="40"
                            min-width="290px"
                        >
                            <v-text-field
                                slot="activator"
                                label="Start date"
                                prepend-icon="event"
                                readonly
                                :value="startDate"
                            ></v-text-field>
                            <v-date-picker v-model="startDate" 
                                @input="$refs.startDateMenu.save(); setDate('startDate', startDate)"
                                :allowed-dates="allowedStartDates"
                            ></v-date-picker>
                        </v-menu>
                    </div>

                    <div class="col-12">
                        <v-menu
                            ref="endDateMenu"
                            lazy
                            :close-on-content-click="false"
                            v-model="endDateMenu"
                            transition="scale-transition"
                            offset-y
                            full-width
                            :nudge-right="40"
                            :return-value.sync="endDate"
                            min-width="290px"
                            :disabled="!startDate"
                        >
                            <v-text-field
                                slot="activator"
                                label="End date"
                                v-model="endDate"
                                prepend-icon="event"
                                :disabled="!startDate"
                                readonly
                            ></v-text-field>
                            <v-date-picker v-model="endDate" 
                                @input="$refs.endDateMenu.save(endDate); setDate('endDate', endDate)"
                                :allowed-dates="allowedEndDates"
                            ></v-date-picker>
                        </v-menu>
                    </div>

                </div>

            </div>
        </div>
        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            <v-btn color="primary" 
                @click.native="nextStep()" 
                :disabled="!this.tokenSaleInfo.startDate || !this.tokenSaleInfo.endDate"
            >Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TokenSalePeriod",
        props: {
            tokenSaleInfo: { type: Object, required: true }
        },
        data() { 
            return {
                startDate: undefined,
                endDate: undefined,
                startDateMenu: false,
                endDateMenu: false
            } 
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            },
            setDate(dateField, value) {
                this.tokenSaleInfo[dateField] = new Date(value);
            },
            allowedStartDates(val) {
                const date = Date.parse(val);

                return this.tokenSaleInfo.endDate 
                    ? date > Date.now() && date < this.tokenSaleInfo.endDate.getTime()
                    : date > Date.now();
            },
            allowedEndDates(val) {
                return Date.parse(val) > this.tokenSaleInfo.startDate.getTime()
            }
        }
    };
</script>

<style lang="less" scoped>
    .period-max-width {
        max-width: 300px;
    }
</style>
