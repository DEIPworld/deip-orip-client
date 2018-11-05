<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Select soft cap and hard cap amounts</div>
            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto caps-max-width c-pt-4">
                    <v-form v-model="isFormValid" ref="form">
                        <v-text-field 
                            label="Soft cap"
                            v-model="tokenSaleInfo.softCap"
                            :rules="[required, deipTokenValidator]"
                            suffix="DEIP"
                        ></v-text-field>

                        <v-text-field
                            label="Hard cap"
                            :rules="[required, deipTokenValidator, hardCapGreater]"
                            v-model="tokenSaleInfo.hardCap"
                            suffix="DEIP"
                        ></v-text-field>
                    </v-form>
                </div>

            </div>
        </div>

        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>

            <v-btn color="primary" @click.native="finish()" 
                :loading="isLoading" 
                :disabled="!isFormValid || isLoading"
            >Finish</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TokenSaleCaps",
        props: {
            tokenSaleInfo: { type: Object, required: true },
            isLoading: {type: Boolean, required: true }
        },
        data() { 
            return {
                isFormValid: false,

                required: value => !!value || 'This field is required',
                hardCapGreater: () => {
                    return this.deipTokenValidator(this.tokenSaleInfo.hardCap) === true 
                        && this.deipTokenValidator(this.tokenSaleInfo.softCap) === true
                        && parseFloat(this.tokenSaleInfo.hardCap) > parseFloat(this.tokenSaleInfo.softCap)
                        || 'Soft cap should be greater than soft cap or be equal';
                }
            } 
        },
        methods: {
            finish() {
                this.$emit('finish');
            },
            prevStep() {
                this.$emit('decStep');
            }
        }
    };
</script>

<style lang="less" scoped>
    .caps-max-width {
        max-width: 500px;
    }
</style>
