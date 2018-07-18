<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Please select start and end day of the token sale</div>

            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto period-max-width c-pt-4">
                    <div class="col-12">
                        <datetime-picker
                            label="Start date"
                            :datetime="startDate"
                            @input="setStartDate"
                        ></datetime-picker>
                    </div>

                    <div class="col-12">
                        <datetime-picker
                            label="End date"
                            :datetime="endDate"
                            @input="setEndDate"
                        ></datetime-picker>
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
                endDate: undefined
            } 
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            },
            allowedStartDates(val) {
                const date = Date.parse(val);

                return this.tokenSaleInfo.endDate 
                    ? date > Date.now() && date < this.tokenSaleInfo.endDate.getTime()
                    : date > Date.now();
            },
            allowedEndDates(val) {
                return Date.parse(val) > this.tokenSaleInfo.startDate.getTime()
            },
            
            setStartDate(value) {
                this.startDate = value;
                this.tokenSaleInfo.startDate = new Date(value);
            },
            setEndDate(value) {
                this.endDate = value;
                this.tokenSaleInfo.endDate = new Date(value);
            },
        }
    };
</script>

<style lang="less" scoped>
    .period-max-width {
        max-width: 300px;
    }
</style>
