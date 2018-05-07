<template>
    <v-container fluid fill-height class="pa-0 column-page">
        <div class="content-column">
            <div class="filling">
            
                <div class="display-1 bold">My Wallet</div>

                <div class="row-nowrap c-pt-8">
                    <div class="col-grow c-pr-8">
                        <v-card>
                            <div class="info-card-list">
                                <div class="list-line">
                                    <div class="list-header-cell col-grow">Token</div>
                                    <div class="list-header-cell width-10 text-align-center">Amount</div>
                                    <div class="list-header-cell width-8 text-align-center">Actions</div>
                                </div>
                                <v-divider></v-divider>

                                <div class="list-line">
                                    <div class="col-grow list-body-cell">
                                        <span class="subheading deip-blue-color">DEIP token</span>
                                        <v-tooltip bottom>
                                            <v-icon class="clickable c-pb-1" slot="activator" size="20">help</v-icon>
                                            <span>
                                                DEIP token
                                            </span>
                                        </v-tooltip>
                                    </div>
                                    <div class="width-10 list-body-cell text-align-center">
                                        <div class="half-bold headline">12 000</div>
                                    </div>
                                    <div class="width-8 list-body-cell text-align-center">
                                        <v-btn class="ma-0" flat color="primary">Send</v-btn>
                                    </div>
                                </div>

                                <v-divider></v-divider>

                                <div class="list-line">
                                    <div class="col-grow list-body-cell">
                                        <span class="subheading deip-blue-color">DEIP common</span>
                                        <v-tooltip bottom>
                                            <v-icon class="clickable c-pb-1" slot="activator" size="20">help</v-icon>
                                            <span>
                                                DEIP common
                                            </span>
                                        </v-tooltip>
                                    </div>
                                    <div class="width-10 list-body-cell text-align-center">
                                        <div class="half-bold headline">10 000</div>
                                    </div>
                                    <div class="width-8 list-body-cell text-align-center">
                                        <v-btn class="ma-0" flat color="primary">Send</v-btn>
                                    </div>
                                </div>
                            </div>
                        </v-card>

                        <div class="title c-pt-8">
                            Research tokens
                            <v-tooltip bottom>
                                <v-icon class="clickable c-pb-1" slot="activator" size="20">help</v-icon>
                                <span>
                                    Research tokens
                                </span>
                            </v-tooltip>
                        </div>

                        <v-card class="c-mt-6">
                            <div class="info-card-list">
                                <div class="list-line">
                                    <div class="list-header-cell col-grow">Title</div>
                                    <div class="list-header-cell width-4 text-align-center">%</div>
                                    <div class="list-header-cell width-8 text-align-center">Actions</div>
                                </div>
                                <v-divider></v-divider>

                                <div class="list-line">
                                    <div class="col-grow list-body-cell">
                                        <div class="deip-blue-color subheading">
                                            Antagonistically maximize market-driven quality.
                                        </div>
                                    </div>
                                    <div class="width-4 list-body-cell text-align-center half-bold">12</div>
                                    <div class="width-8 list-body-cell text-align-center">
                                        <v-btn class="ma-0" flat color="primary">Send</v-btn>
                                    </div>
                                </div>
                                <v-divider></v-divider>
                                <div class="list-line">
                                    <div class="col-grow list-body-cell">
                                        <div class="deip-blue-color subheading">
                                            Antagonistically maximize market-driven quality.
                                        </div>
                                    </div>
                                    <div class="width-4 list-body-cell text-align-center half-bold">12</div>
                                    <div class="width-8 list-body-cell text-align-center">
                                        <v-btn class="ma-0" flat color="primary">Send</v-btn>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </div>

                    <div class="tokens-send-panel">
                        <v-card class="">
                            <div class="blue lighten-4 c-p-4">
                                <div class="uppercase text-align-center half-bold">Send deip tokens</div>
                            </div>
                            <div class="c-p-4">
                                <v-text-field label="To"></v-text-field>
                                <v-text-field
                                    label="Memo - optional" 
                                    multi-line
                                    rows="3"
                                    counter="50"
                                    no-resize
                                ></v-text-field>
                                <v-text-field label="Amount, DEIP Tokens"></v-text-field>
                                <v-btn block color="primary">Send</v-btn>
                            </div>
                        </v-card>
                    </div>
                </div>

            </div>
        </div>
    </v-container>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "UserWallet",
        data() { 
            return {
            }
        },
        methods: {}
    };
</script>

<style lang="less" scoped>
    .tokens-send-panel {
        width: 300px;
    }
</style>
