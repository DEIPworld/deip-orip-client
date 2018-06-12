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

                                    <div class="list-header-cell token-actions">
                                        <span class="c-pr-8">Actions</span>
                                    </div>
                                </div>

                                <v-divider></v-divider>

                                <div class="list-line">
                                    <div class="col-grow list-body-cell display-flex align-center">
                                        <!-- TODO: make service component which can manage our all SVG items -->
                                        <div style="height: 40px; width: 40px;">
                                            <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="20" cy="20" r="20" fill="black"/>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.91431 0H6.15204V1.9375H7.271V0H9.50873V2.01611C10.6616 2.15356 11.725 2.47119 12.6993 2.96875C14.0454 3.64844 15.0944 4.61328 15.8462 5.86328C16.6067 7.10547 16.9913 8.5 17 10.0469V10.832C17 12.3945 16.6285 13.7969 15.8855 15.0391C15.1512 16.2734 14.111 17.2422 12.7648 17.9453C11.767 18.4641 10.6817 18.7915 9.50873 18.9275V21H7.271V19H6.15204V21H3.91431V19H0V1.9375H3.91431V0ZM4 5.11328V15.8359H8.2019C9.52185 15.8359 10.5358 15.418 11.2439 14.582C11.9519 13.7383 12.306 12.4883 12.306 10.832V10.0938C12.306 8.44531 11.9519 7.20312 11.2439 6.36719C10.5358 5.53125 9.50439 5.11328 8.14948 5.11328H4Z" transform="translate(13 9)" fill="#F0F1F4"/>
                                            </svg>
                                        </div>

                                        <span class="subheading deip-blue-color c-pl-4 c-pr-2">DEIP token</span>

                                        <v-tooltip bottom>
                                            <v-icon class="clickable c-pb-1" slot="activator" size="20">help</v-icon>
                                            <span>DEIP token</span>
                                        </v-tooltip>
                                    </div>

                                    <div class="width-10 list-body-cell text-align-center">
                                        <div class="half-bold headline">{{ deipTokenBalance }}</div>
                                    </div>

                                    <div class="list-body-cell token-actions">
                                        <v-btn class="ma-0" 
                                            flat 
                                            color="primary"
                                            @click="sendingType = sendingTypes.deipToken"
                                        >Send</v-btn>
                                    </div>
                                </div>

                                <v-divider></v-divider>

                                <div class="list-line">
                                    <div class="col-grow list-body-cell display-flex align-center">
                                        <!-- TODO: make service component which can manage our all SVG items -->
                                        <div style="height: 40px; width: 40px;">
                                            <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="20" cy="20" r="20" fill="#F2C94C"/>
                                                <path d="M0.859375 15V3.625H4.52344C5.52865 3.625 6.43229 3.85417 7.23438 4.3125C8.03646 4.76562 8.66146 5.40885 9.10938 6.24219C9.5625 7.07031 9.79167 8 9.79688 9.03125V9.55469C9.79688 10.5964 9.57552 11.5312 9.13281 12.3594C8.69531 13.1823 8.07552 13.8281 7.27344 14.2969C6.47656 14.7604 5.58594 14.9948 4.60156 15H0.859375ZM3.60156 5.74219V12.8906H4.55469C5.34115 12.8906 5.94531 12.612 6.36719 12.0547C6.78906 11.4922 7 10.6589 7 9.55469V9.0625C7 7.96354 6.78906 7.13542 6.36719 6.57812C5.94531 6.02083 5.33073 5.74219 4.52344 5.74219H3.60156ZM20.4062 11.1484C20.3698 11.9401 20.1562 12.6406 19.7656 13.25C19.375 13.8542 18.8255 14.3229 18.1172 14.6562C17.4141 14.9896 16.6094 15.1562 15.7031 15.1562C14.2083 15.1562 13.0312 14.6693 12.1719 13.6953C11.3125 12.7214 10.8828 11.3464 10.8828 9.57031V9.00781C10.8828 7.89323 11.0755 6.91927 11.4609 6.08594C11.8516 5.2474 12.4115 4.60156 13.1406 4.14844C13.8698 3.6901 14.7135 3.46094 15.6719 3.46094C17.0521 3.46094 18.1615 3.82552 19 4.55469C19.8385 5.27865 20.3151 6.27865 20.4297 7.55469H17.6953C17.6745 6.86198 17.5 6.36458 17.1719 6.0625C16.8438 5.76042 16.3438 5.60938 15.6719 5.60938C14.9896 5.60938 14.4896 5.86458 14.1719 6.375C13.8542 6.88542 13.6875 7.70052 13.6719 8.82031V9.625C13.6719 10.8385 13.8229 11.7057 14.125 12.2266C14.4323 12.7474 14.9583 13.0078 15.7031 13.0078C16.3333 13.0078 16.8151 12.8594 17.1484 12.5625C17.4818 12.2656 17.6589 11.7943 17.6797 11.1484H20.4062Z" transform="translate(10 11)" fill="black"/>
                                            </svg>
                                        </div>

                                        <span class="subheading deip-blue-color c-pl-4 c-pr-2">DEIP common</span>

                                        <v-tooltip bottom>
                                            <v-icon class="clickable c-pb-1" slot="activator" size="20">help</v-icon>
                                            <span>DEIP common</span>
                                        </v-tooltip>
                                    </div>

                                    <div class="width-10 list-body-cell text-align-center">
                                        <div class="half-bold headline">{{ commonTokensBalance }}</div>
                                    </div>

                                    <div class="list-body-cell token-actions">
                                        <v-btn class="ma-0" flat color="primary">Convert</v-btn>
                                        <v-btn class="ma-0" flat color="primary">Withdraw</v-btn>
                                    </div>
                                </div>
                            </div>
                        </v-card>

                        <div class="title c-pt-8">
                            Research tokens
                            <v-tooltip bottom>
                                <v-icon class="clickable c-pb-1" slot="activator" size="20">help</v-icon>
                                <span>Research tokens</span>
                            </v-tooltip>
                        </div>

                        <v-card class="c-mt-6">
                            <div class="info-card-list">
                                <div class="reserarch-table-header c-ph-3">
                                    <div class="list-header-cell col-grow">Title</div>
                                    <!-- <div class="list-header-cell width-7 text-align-center">
                                        Market price<br>
                                        (DEIP Tokens)
                                    </div> -->
                                    <div class="list-header-cell width-5 text-align-center">Amount</div>
                                    <div class="list-header-cell width-8 text-align-center">Actions</div>
                                </div>

                                <v-divider></v-divider>

                                <div class="hidden-last-child" v-if="researches && researches.length">
                                    <template v-for="research in researches">
                                        <div class="list-line">
                                            <div class="col-grow list-body-cell">
                                                <div class="deip-blue-color subheading">{{ research.title }}</div>

                                                <div class="caption grey--text c-pt-2">
                                                    {{ research.groupTokens.map(item => item.owner).join(' · ') }}
                                                </div>
                                            </div>

                                            <!-- <div class="width-7 list-body-cell text-align-center half-bold">10</div> -->

                                            <div class="width-5 list-body-cell text-align-center half-bold">
                                                {{ convertToPercent(research.researchToken.amount) }}%
                                            </div>

                                            <div class="width-8 list-body-cell text-align-center">
                                                <v-btn class="ma-0" flat color="primary">Send</v-btn>
                                            </div>
                                        </div>

                                        <v-divider></v-divider>
                                    </template>
                                </div>

                                <div class="list-line height-7" v-else>
                                    <div class="c-m-auto grey--text">Research token list is empty</div>
                                </div>
                            </div>
                        </v-card>
                    </div>

                    <div class="tokens-send-panel">
                        <deip-token-send-form
                            v-if="account && sendingType === sendingTypes.deipToken"
                            :deip-token-balance="deipTokenBalance"
                            @deipTokensTransfered="loadUserAccount"
                        ></deip-token-send-form>
                    </div>

                </div>
            </div>
        </div>
    </v-container>
</template>

<script>
    import _ from 'lodash';
    import deipRpc from '@deip/deip-rpc';
    import { mapGetters } from 'vuex';

    export default {
        name: "UserWallet",
        data() { 
            return {
                username: undefined,
                sendingType: undefined,

                sendingTypes: {
                    deipToken: 'deipToken',
                    deipCommon: 'deipCommon',
                    researchToken: 'researchToken'
                }
            }
        },
        methods: {
            loadUserAccount() {
                this.$store.dispatch('userWallet/loadUser', this.username);
            }
        },
        computed: {
            ...mapGetters({
                account: 'userWallet/account',
                researches: 'userWallet/researches',
                commonTokensBalance: 'userWallet/commonTokensBalance',
                user: 'auth/user'
            }),
            deipTokenBalance() {
                return this.account ? this.fromAssetsToFloat(this.account.balance) : '';
            }
        },
        created() {
            this.username = this.user.username;

            this.loadUserAccount();
            this.$store.dispatch('userWallet/loadResearchTokens', this.username);
            this.$store.dispatch('userWallet/loadCommonTokens', this.username);
        }
    };
</script>

<style lang="less" scoped>
    .tokens-send-panel {
        width: 300px;
    }
    .token-actions {
        width: 230px;
        text-align: right;
    }
    .reserarch-table-header {
        display: flex;
        align-items: center;
        height: 70px;
    }
</style>
