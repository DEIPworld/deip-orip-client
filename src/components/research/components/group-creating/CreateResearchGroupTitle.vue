<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Add group title</div>
            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto group-title-max-width">
                    <div class="col-12">
                        <v-form v-model="isFormValid" ref="form">
                            <div class="">
                                <v-text-field 
                                    v-model="groupInfo.title" 
                                    name="title"
                                    label="Title" 
                                    hint="Name of your group" 
                                    :rules="titleRules"
                                ></v-text-field>
                            </div>
                            <div class="">
                                <v-text-field class="permlink-input" 
                                    prefix="deip.world/"
                                    name="permlink"
                                    label="Permlink"
                                    hint="People can find your group by this url"
                                    v-model="groupInfo.permlink"
                                    @input="permlinkChanged"
                                    :loading="isPermlinkChecking"
                                    :rules="permlinkRules"
                                ></v-text-field>
                            </div>
                        </v-form>
                    </div>
                </div>

            </div>
        </div>
        <div class="row justify-center align-center">
            <v-btn color="primary" 
                @click.native="nextStep()" 
                :disabled="!isFormValid || isPermlinkVerifyed !== true"
            >Next</v-btn>
        </div>
    </div>
</template>

<script>
    import deipRpc from '@deip/deip-rpc';
    import _ from 'lodash';

    export default {
        name: "CreateResearchGroupTitle",
        props: {
            groupInfo: { required: true }
        },
        data() { 
            return {
                isFormValid: true,
                isPermlinkChecking: false,
                isPermlinkVerifyed: undefined,

                titleRules: [ v => !!v || 'Name is required' ],
                permlinkRules: [
                    v => !!v || 'Permlink is required',
                    v => {
                        return !!v && this.isPermlinkVerifyed !== false || 'Permlink should be unique in system'
                    }
                ]
            } 
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            permlinkChanged: _.debounce(
                function() {
                    this.isPermlinkVerifyed = undefined;

                    if (this.groupInfo.permlink !== '') {
                        this.isPermlinkChecking = true;

                        deipRpc.api.checkResearchGroupExistenceByPermlinkAsync(this.groupInfo.permlink)
                            .then(res => { this.isPermlinkVerifyed = !res; })
                            .catch(error => { this.isPermlinkVerifyed = false; })
                            .finally(() => {
                                this.isPermlinkChecking = false;
                                let permlinkInput = _.find(this.$refs.form.inputs, input => input.$attrs.name === 'permlink');
                                permlinkInput.validate();
                            });
                    }
                }, 
                600
            )
        }
    };
</script>

<style lang="less">
    @import '../../../../styles/colors.less';

    .group-title-max-width {
        max-width: 700px;
    }

    .permlink-input {
        .input-group--text-field__prefix {
            background: @grey-lighten-2;
            border-radius: 2px 2px 0 0;
            padding: 0 8px;
        }
        // standart vuetify prefixes of big length are buged, so this is workaround
        &.input-group--prefix:not(.input-group--focused):not(.input-group--dirty) label {
            left: 105px;
            // width: 50%;
        }
    }
</style>
