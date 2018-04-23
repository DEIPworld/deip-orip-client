<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Research group share</div>
            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto group-share-max-width">
                    <div class="col-12">
                        <div class="subheading c-pv-4">Distribute shares of this group which will...</div>

                        <div class="row-nowrap justify-between align-center c-pt-4" v-for="i in 3" :key="i">
                            <div>
                                <v-avatar size="40px">
                                    <img src="http://deip.world/static/ybokach.acb12e7e.png" alt="User">
                                </v-avatar>
                                <router-link to="/userDetails" class="a c-pl-3">Yura Bokach</router-link>
                            </div>
                            <div>
                                <v-text-field class="width-4 pa-0 rtl" value="33" suffix="%" hide-details></v-text-field>
                            </div>
                        </div>
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
        name: "CreateResearchGroupShare",
        data() { 
            return {} 
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

<style lang="less">
    .group-share-max-width {
        max-width: 600px;
    }

    .rtl.input-group input {
        text-align: center;
    }
</style>
