<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Add group title</div>
            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto group-title-max-width">
                    <div class="col-12">
                        <div class="">
                            <v-text-field label="Title" hint="Disclaimer"></v-text-field>
                        </div>
                        <div class="">
                            <v-text-field class="permlink-input" 
                                prefix="deip.world/"
                                label="Permlink"
                                hint="Disclaimer"
                            ></v-text-field>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="row justify-center align-center">
            <v-btn color="primary" @click.native="nextStep()">Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CreateResearchGroupTitle",
        data() { 
            return {} 
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            }
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
