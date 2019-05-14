<template>
    <div class="full-height">
        <div>
            <div class="step-title">Select min and max amounts</div>
            <div class="overflow-y-auto full-height">

                <div class="c-mh-auto caps-max-width c-pt-4">
                    <v-form v-model="isFormValid" ref="form">
                        <v-text-field 
                            label="Min"
                            v-model="tokenSaleInfo.softCap"
                            :rules="[required, deipTokenValidator, softCapSmaller]"
                            suffix="DEIP"
                        ></v-text-field>

                        <v-text-field
                            label="Max"
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
            >{{!isPersonalGroup ? 'Create Proposal' : 'Finish'}}</v-btn>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "TokenSaleCaps",

        props: {
            tokenSaleInfo: { type: Object, required: true },
            research: { type: Object },
            isLoading: { type: Boolean, required: true }
        },

        computed: {
            ...mapGetters({
                userPersonalGroup: 'auth/userPersonalGroup'
            }),
            
            isPersonalGroup() {
                return this.research && this.userPersonalGroup
                    ? this.research.research_group_id === this.userPersonalGroup.id 
                    : false;
            }
        },

        data() { 
            return {
                isFormValid: false,

                required: value => !!value || 'This field is required',
                
                softCapSmaller: () => {
                    const isHardCapValid = this.deipTokenValidator(this.tokenSaleInfo.hardCap) === true;
                    const isSoftCapValid = this.deipTokenValidator(this.tokenSaleInfo.softCap) === true;

                    return !isHardCapValid
                        || isSoftCapValid 
                            && isHardCapValid
                            && parseFloat(this.tokenSaleInfo.hardCap) > parseFloat(this.tokenSaleInfo.softCap)
                        || 'Min amount should be smaller than max amount';
                },
                
                hardCapGreater: () => {
                    const isSoftCapValid = this.deipTokenValidator(this.tokenSaleInfo.softCap) === true;
                    const isHardCapValid = this.deipTokenValidator(this.tokenSaleInfo.hardCap) === true;

                    return !isSoftCapValid
                        || isSoftCapValid
                            && isHardCapValid
                            && parseFloat(this.tokenSaleInfo.hardCap) > parseFloat(this.tokenSaleInfo.softCap)
                        || 'Max amount should be greater than min amount';
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
