<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Please select Soft Cap and Hard Cap amount</div>
            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto caps-max-width c-pt-4">
                    <v-form v-model="isFormValid" ref="form">
                        <div class="pos-relative">
                            <v-text-field 
                                label="Soft cap"
                                v-model="tokenSaleInfo.softCap"
                                :rules="[numeric]"
                            ></v-text-field>

                            <v-tooltip bottom class="cap-help">
                                <v-icon class="clickable" slot="activator">help</v-icon>
                                <span>
                                    The soft cap is the capital amount <br>
                                    gathered at which the crowdsale event <br>
                                    will be considered successful
                                </span>
                            </v-tooltip>
                        </div>
                        <div class="pos-relative">
                            <v-text-field
                                label="Hard cap"
                                :rules="[numeric, softCapGreater]"
                                v-model="tokenSaleInfo.hardCap"
                            ></v-text-field>

                            <v-tooltip bottom class="cap-help">
                                <v-icon class="clickable" slot="activator">help</v-icon>
                                <span>
                                    The hard cap of an ICO means the maximum <br>
                                    amount of capital that it aims to gather
                                </span>
                            </v-tooltip>
                        </div>
                    </v-form>
                </div>

            </div>
        </div>
        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            <v-btn color="primary" @click.native="finish()" :disabled="!isFormValid">Finish</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TokenSaleCaps",
        props: {
            tokenSaleInfo: { type: Object, required: true }
        },
        data() { 
            return {
                isFormValid: false,

                numeric: value => {
                    return this.isNumber(value) || 'Numbers are only allowed'
                },
                softCapGreater: () => {
                    return this.isNumber(this.tokenSaleInfo.hardCap) && this.isNumber(this.tokenSaleInfo.softCap)
                        && parseInt(this.tokenSaleInfo.hardCap) >= parseInt(this.tokenSaleInfo.softCap)
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
            },
            isNumber(value) {
                return value && value.match(/^[0-9]*$/) !== null;
            }
        }
    };
</script>

<style lang="less" scoped>
    .caps-max-width {
        max-width: 500px;
    }

    .cap-help {
        position: absolute;
        top: 21px;
        right: 6px;
    }
</style>
