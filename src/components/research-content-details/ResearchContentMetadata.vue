<template>
    <v-container fluid fill-height class="pa-0 column-page">
        <div class="content-column">
            <div class="filling" style="width: 900px">

                <div class="row justify-between align-items-end">
                    <div class="display-1 bold">Block #3588132</div>
                    <qrcode value="Hello, World!" :options="{ size: 120 }"></qrcode>
                </div>

                <div class="c-mt-4">
                    <div class="bold">Block ID</div>
                    <div class="row grey-border-stripe">
                        <div class="pill width-7 white--text">SHA256</div>
                        <div class="col-grow pill-value">01769bec491405adc5132be6a48caebd71c46553</div>
                    </div>
                </div>

                <div class="c-mt-4">
                    <div class="row">
                        <div class="bold width-7">Research</div>
                        <div class="bold deip-blue-color c-pl-4">Feasibility of strong consistency in horizontally scalable distributed systems</div>
                    </div>
                    <div class="row grey-border-stripe">
                        <div class="pill width-7 white--text">SHA256</div>
                        <div class="col-grow pill-value">b9995768a5c23f697fe4588de49dfd9c2a142574bcd7e5dd55777e1805df83e2</div>
                    </div>
                </div>

                <div class="c-mt-4">
                    <div class="row">
                        <div class="bold width-7">Content</div>
                        <div class="bold deip-blue-color c-pl-4">Sharding capabilities of append-only storage (event store)</div>
                    </div>
                    <div class="row grey-border-stripe">
                        <div class="pill width-7 white--text">SHA256</div>
                        <div class="col-grow pill-value">01769bec491405adc5132be6a48caebd71c46553</div>
                    </div>
                </div>
                
                <div class="c-mt-4">
                    <div class="row">
                        <div class="bold width-7">Date & Time</div>
                        <div class="c-pl-4">Fri Jul 27 2018 12:11:32  UTC</div>
                    </div>
                </div>

                <div class="c-mt-6">
                    <div class="row">
                        <div class="bold width-7">Signee</div>

                        <div class="c-pl-4 col-grow">
                            <div>
                                <div class="row">
                                    <v-avatar size="40px">
                                        <v-gravatar :email="'abc' + '@deip.world'" />
                                    </v-avatar>

                                    <div class="c-ml-4">
                                        <div class="a">Artyom Ruseckiy</div>
                                        <div class="caption grey--text">ArtRus</div>
                                    </div>
                                </div>

                                <div class="row grey-border-stripe c-mt-4">
                                    <div class="pill width-7">
                                        <div class="white--text">SHA256</div>
                                        <div class="grey--text">Signanure</div>
                                    </div>
                                    <div class="col-grow pill-value">
                                        <div>01769bec491405adc5132be6a48caebd71c46553</div>
                                        <div>b9995768a5c23f697fe4588de49dfd9c2a142574bcd7e5dd55777e1805df83e2</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="c-mt-6">
                    <div class="row">
                        <div class="bold width-7">Approved by</div>

                        <div class="c-pl-4 col-grow">
                            <div>
                                <div class="row">
                                    <v-avatar size="40px">
                                        <v-gravatar :email="'abc' + '@deip.world'" />
                                    </v-avatar>

                                    <div class="c-ml-4">
                                        <div class="a">Artyom Ruseckiy</div>
                                        <div class="caption grey--text">ArtRus</div>
                                    </div>
                                </div>

                                <div class="row grey-border-stripe c-mt-4">
                                    <div class="pill width-7">
                                        <div class="white--text">SHA256</div>
                                        <div class="grey--text">Signanure</div>
                                    </div>
                                    <div class="col-grow pill-value">
                                        <div>01769bec491405adc5132be6a48caebd71c46553</div>
                                        <div>b9995768a5c23f697fe4588de49dfd9c2a142574bcd7e5dd55777e1805df83e2</div>
                                    </div>
                                </div>
                            </div>

                            <div class="c-mt-6">
                                <div class="row">
                                    <v-avatar size="40px">
                                        <v-gravatar :email="'abc' + '@deip.world'" />
                                    </v-avatar>

                                    <div class="c-ml-4">
                                        <div class="a">Artyom Ruseckiy</div>
                                        <div class="caption grey--text">ArtRus</div>
                                    </div>
                                </div>

                                <div class="row grey-border-stripe c-mt-4">
                                    <div class="pill width-7">
                                        <div class="white--text">SHA256</div>
                                        <div class="grey--text">Signanure</div>
                                    </div>
                                    <div class="col-grow pill-value">
                                        <div>01769bec491405adc5132be6a48caebd71c46553</div>
                                        <div>b9995768a5c23f697fe4588de49dfd9c2a142574bcd7e5dd55777e1805df83e2</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="c-mt-4">
                    <div class="bold">Chain ID</div>
                    <div class="row grey-border-stripe">
                        <div class="pill width-7 white--text">SHA256</div>
                        <div class="col-grow pill-value">01769bec491405adc5132be6a48caebd71c46553</div>
                    </div>
                </div>

                <div class="c-mt-4">
                    <div class="bold">Public ID</div>
                    <div class="row grey-border-stripe">
                        <div class="pill width-7 white--text">SHA256</div>
                        <div class="col-grow pill-value">01769bec491405adc5132be6a48caebd71c46553</div>
                    </div>
                </div>
                
                <div class="c-mt-4">
                    <div class="bold">Transaction ID</div>
                    <div class="row grey-border-stripe">
                        <div class="pill width-7 white--text">SHA256</div>
                        <div class="col-grow pill-value">01769bec491405adc5132be6a48caebd71c46553</div>
                    </div>
                </div>

            </div>
        </div>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-rpc-client'
    import config from './../../config'

    export default {
        name: "ResearchContentMetadata",

        data() { 
            return {
            } 
        },

        computed:{
        },
        
        methods: {
        },

        created() {
        }
    };
</script>

<style lang="less" scoped>
    @import '../../styles/colors.less';

    .grey-border-stripe {
        border: 1px solid @grey-lighten-2;
        border-radius: 2px;

        .pill {
            background-color: @grey-lighten-2;
            padding: 4px 8px;
            text-align: center;
        }

        .pill-value {
            padding: 4px 16px;
        }
    }
</style>
