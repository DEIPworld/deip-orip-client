<template>
    <page-container>
        <contentbar>
            <div class="display-1 bold">Wallet</div>

            <div class="legacy-row-nowrap c-pt-8">
                <div class="legacy-col-grow c-p-1 c-mr-7 overflow-hidden">
                    <v-card>
                        <div class="info-card-list">
                            <div class="list-line">
                                <div class="list-header-cell legacy-col-grow">Token</div>
                                <div class="list-header-cell width-10 text-align-center">Amount</div>

                                <div class="list-header-cell token-actions">
                                    <span class="c-pr-8">Actions</span>
                                </div>
                            </div>

                            <v-divider></v-divider>

                            <div class="list-line"
                                :class="{ 'primary lighten-5': sendingType === sendingTypes.deipToken }"
                            >
                                <div class="legacy-col-grow list-body-cell display-flex align-center">
                                    <!-- TODO: make service component which can manage our all SVG items -->
                                    <div style="height: 40px; width: 40px;">
                                        <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="20" cy="20" r="20" fill="black"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.91431 0H6.15204V1.9375H7.271V0H9.50873V2.01611C10.6616 2.15356 11.725 2.47119 12.6993 2.96875C14.0454 3.64844 15.0944 4.61328 15.8462 5.86328C16.6067 7.10547 16.9913 8.5 17 10.0469V10.832C17 12.3945 16.6285 13.7969 15.8855 15.0391C15.1512 16.2734 14.111 17.2422 12.7648 17.9453C11.767 18.4641 10.6817 18.7915 9.50873 18.9275V21H7.271V19H6.15204V21H3.91431V19H0V1.9375H3.91431V0ZM4 5.11328V15.8359H8.2019C9.52185 15.8359 10.5358 15.418 11.2439 14.582C11.9519 13.7383 12.306 12.4883 12.306 10.832V10.0938C12.306 8.44531 11.9519 7.20312 11.2439 6.36719C10.5358 5.53125 9.50439 5.11328 8.14948 5.11328H4Z" transform="translate(13 9)" fill="#F0F1F4"/>
                                        </svg>
                                    </div>

                                    <span class="subheading c-pl-4 c-pr-2">DEIP Token</span>

                                    <v-tooltip bottom>
                                        <v-icon class="clickable c-pb-1" slot="activator" size="20">help</v-icon>
                                        <span>
                                            The DEIP Token is the liquid currency of the platform. 
                                            It is used to reward scientists for their contribution of expertise and to finance projects published on the platform. 
                                            It is also distributed as a reward for maintenance of the platform infrastructure.
                                        </span>
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

                            <div class="list-line"
                                :class="{ 'primary lighten-5': sendingType === sendingTypes.deipCommon }"
                            >
                                <div class="legacy-col-grow list-body-cell display-flex align-center">
                                    <!-- TODO: make service component which can manage our all SVG items -->
                                    <div style="height: 40px; width: 40px;">
                                        <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="20" cy="20" r="20" fill="#F2C94C"/>
                                            <path d="M0.859375 15V3.625H4.52344C5.52865 3.625 6.43229 3.85417 7.23438 4.3125C8.03646 4.76562 8.66146 5.40885 9.10938 6.24219C9.5625 7.07031 9.79167 8 9.79688 9.03125V9.55469C9.79688 10.5964 9.57552 11.5312 9.13281 12.3594C8.69531 13.1823 8.07552 13.8281 7.27344 14.2969C6.47656 14.7604 5.58594 14.9948 4.60156 15H0.859375ZM3.60156 5.74219V12.8906H4.55469C5.34115 12.8906 5.94531 12.612 6.36719 12.0547C6.78906 11.4922 7 10.6589 7 9.55469V9.0625C7 7.96354 6.78906 7.13542 6.36719 6.57812C5.94531 6.02083 5.33073 5.74219 4.52344 5.74219H3.60156ZM20.4062 11.1484C20.3698 11.9401 20.1562 12.6406 19.7656 13.25C19.375 13.8542 18.8255 14.3229 18.1172 14.6562C17.4141 14.9896 16.6094 15.1562 15.7031 15.1562C14.2083 15.1562 13.0312 14.6693 12.1719 13.6953C11.3125 12.7214 10.8828 11.3464 10.8828 9.57031V9.00781C10.8828 7.89323 11.0755 6.91927 11.4609 6.08594C11.8516 5.2474 12.4115 4.60156 13.1406 4.14844C13.8698 3.6901 14.7135 3.46094 15.6719 3.46094C17.0521 3.46094 18.1615 3.82552 19 4.55469C19.8385 5.27865 20.3151 6.27865 20.4297 7.55469H17.6953C17.6745 6.86198 17.5 6.36458 17.1719 6.0625C16.8438 5.76042 16.3438 5.60938 15.6719 5.60938C14.9896 5.60938 14.4896 5.86458 14.1719 6.375C13.8542 6.88542 13.6875 7.70052 13.6719 8.82031V9.625C13.6719 10.8385 13.8229 11.7057 14.125 12.2266C14.4323 12.7474 14.9583 13.0078 15.7031 13.0078C16.3333 13.0078 16.8151 12.8594 17.1484 12.5625C17.4818 12.2656 17.6589 11.7943 17.6797 11.1484H20.4062Z" transform="translate(10 11)" fill="black"/>
                                        </svg>
                                    </div>

                                    <span class="subheading c-pl-4 c-pr-2">DEIP Common Token</span>

                                    <v-tooltip bottom>
                                        <v-icon class="clickable c-pb-1" slot="activator" size="20">help</v-icon>
                                        <span>
                                            The DEIP Common Token is used to distribute network throughput among DEIP participants. It is allocated to new platform members and allows them to use its functionality for free.
                                            The amount of DEIP Common influences the storage capacity assigned to researchers and defines the maximum frequency of their operations. DEIP Common tokens cannot be transferred but can be converted to and from the DEIP Token.
                                            Important note! The conversion from DEIP Token to DEIP Common happens immediately, but the reverse action takes a certain period of time. The amount of DEIP Common on a member’s account cannot be lower than that initially received.
                                        </span>
                                    </v-tooltip>
                                </div>

                                <div class="width-10 list-body-cell text-align-center">
                                    <div class="half-bold headline">
                                        {{ commonTokenBalance }}
                                    </div>
                                </div>

                                <div class="list-body-cell token-actions">
                                    <v-btn class="ma-0" flat 
                                        color="primary"
                                        @click="sendingType = sendingTypes.deipCommon"
                                    >Convert</v-btn>
                                </div>
                            </div>
                        </div>
                    </v-card>

                    <div class="title c-pt-8">
                        Research Tokens
                        <v-tooltip bottom>
                            <v-icon class="clickable c-pb-1" slot="activator" size="20">help</v-icon>
                            <span>
                                Research Tokens define the ownership rights for a research project on the DEIP platform. Every research project is allocated a number of unique tokens, all of which initially belong to the research group. 
                                The research group may sell some of them to stakeholders to raise funds for its project. 
                                A research project conducted on the platform can be rewarded by the emission of DEIP Tokens which are then distributed among the Research Token holders.
                            </span>
                        </v-tooltip>
                    </div>

                    <v-card class="c-mt-6">
                        <div class="info-card-list">
                            <div class="reserarch-table-header c-ph-3">
                                <div class="list-header-cell legacy-col-grow">Title</div>
                                <!-- <div class="list-header-cell width-7 text-align-center">
                                    Market price<br>
                                    (DEIP Tokens)
                                </div> -->
                                <div class="list-header-cell width-5 text-align-center">Amount</div>
                                <div class="list-header-cell width-8 text-align-center">Actions</div>
                            </div>

                            <v-divider></v-divider>

                            <div class="hidden-last-child" v-if="investments.length">
                                <template v-for="(investment, i) in investments">
                                    <div class="list-line"
                                        :class="{ 'primary lighten-5': sendingType === sendingTypes.researchToken && selectedResearch && selectedResearch.id === investment.research.id }"
                                        :key="'research-'+ i">
                                        
                                        <div class="legacy-col-grow list-body-cell">
                                            <div class="subheading">{{ investment.research.title }}</div>
                                        </div>

                                        <!-- <div class="width-7 list-body-cell text-align-center half-bold">10</div> -->

                                        <div class="width-5 list-body-cell text-align-center half-bold">
                                            {{ convertToPercent(investment.myShare.amount) }}%
                                        </div>

                                        <div class="width-8 list-body-cell text-align-center">
                                            <v-btn class="ma-0" flat color="primary" @click="selectResearch(investment.research)">Send</v-btn>
                                        </div>
                                    </div>

                                    <v-divider :key="'divider-research-'+ i">></v-divider>
                                </template>
                            </div>

                            <div class="list-line height-7" v-else>
                                <div class="c-m-auto grey--text">Research Token list is empty</div>
                            </div>
                        </div>
                    </v-card>

                    <div class="title c-pt-8">Account transfers</div>
                    
                    <v-card class="c-mt-6">
                        <div class="info-card-list">
                            <div class="reserarch-table-header c-ph-3">
                                <div class="list-header-cell legacy-col-grow">TX hash</div>
                                <div class="list-header-cell width-8 text-align-center">Who</div>
                                <div class="list-header-cell width-10 text-align-center">Date (UTC)</div>
                                <div class="list-header-cell width-10 text-align-center">Amount</div>
                            </div>

                            <v-divider></v-divider>

                            <div class="hidden-last-child" v-if="transfers.length">
                                <template v-for="(transfer, i) in transfers">
                                    <div class="list-line" :key="'transfer-' + i">
                                        <div class="legacy-col-grow list-body-cell overflow-hidden">
                                            <div class="subheading overflow-ellipsis">
                                                {{ transfer[1].trx_id }}
                                            </div>
                                        </div>

                                        <div class="width-8 legacy-col-shrink list-body-cell text-align-center half-bold">
                                            <router-link v-if="transfer[1].op[1].from === user.username" class="a"
                                                :to="{ name: 'UserDetails', params: { account_name: transfer[1].op[1].to }}"
                                            >{{ transfer[1].op[1].to }}</router-link>

                                            <router-link v-else class="a"
                                                :to="{ name: 'UserDetails', params: { account_name: transfer[1].op[1].from }}"
                                            >{{ transfer[1].op[1].from }}</router-link>
                                        </div>

                                        <div class="width-10 legacy-col-shrink list-body-cell text-align-center half-bold">
                                            {{ transfer[1].timestamp | dateFormat('HH:mm D MMM YYYY', true) }}
                                        </div>

                                        <div v-if="transfer[1].op[1].from === user.username"
                                            class="width-10 legacy-col-shrink list-body-cell text-align-center red--text text--darken-2"
                                        >- {{ fromAssetsToFloat(transfer[1].op[1].amount) }} DT</div>
                                        <div v-else
                                            class="width-10 legacy-col-shrink list-body-cell text-align-center green--text text--darken-2"
                                        >+ {{ fromAssetsToFloat(transfer[1].op[1].amount) }} DT</div>
                                    </div>

                                    <v-divider :key="'transfer-divider-' + i"></v-divider>
                                </template>
                            </div>

                            <div class="list-line height-7" v-else>
                                <div class="c-m-auto grey--text">Research Token list is empty</div>
                            </div>
                        </div>
                    </v-card>
                </div>

                <div class="tokens-send-panel">
                    <transition mode="out-in">
                        <deip-token-send-form
                            v-if="sendingType === sendingTypes.deipToken"
                            :deip-token-balance="deipTokenBalance"
                            @deipTokensTransfered="loadUserAccount"
                        ></deip-token-send-form>

                        <common-token-convert-form
                            v-else-if="sendingType === sendingTypes.deipCommon"
                            :deip-token-balance="deipTokenBalance"
                            :common-tokens-balance="commonTokenBalance"
                            @convertingTransactionWasApplied="loadUserAccount"
                        ></common-token-convert-form>
                        
                        <research-token-send-form
                            v-else-if="sendingType === sendingTypes.researchToken && selectedResearch"
                            :research-id="selectedResearch.id"
                            :research-token="selectedResearch.researchToken"
                            :researches="investments.map(inv => inv.research)"
                            @researchTokensTransfered="loadResearches"
                            @researchChanged="researchChanged"
                        ></research-token-send-form>
                    </transition>
                </div>

            </div>
        </contentbar>
    </page-container>
</template>

<script>
    import _ from 'lodash';
    import deipRpc from '@deip/deip-oa-rpc-client';
    import { mapGetters } from 'vuex';

    export default {
        name: "UserWalletOld",

        data() { 
            return {
                sendingType: undefined,

                selectedResearchId: undefined,

                sendingTypes: {
                    deipToken: 'deipToken',
                    deipCommon: 'deipCommon',
                    researchToken: 'researchToken'
                }
            }
        },

        computed: {
            ...mapGetters({
                user: 'auth/user',
                investments: 'userWallet/investments',
                transfers: 'userWallet/transfers'
            }),
            deipTokenBalance() {
                return this.fromAssetsToFloat(this.user.account.balance);
            },
            commonTokenBalance() {
                return this.toCommonTokens(this.user.account.common_tokens_balance);
            },
            selectedResearch() {
                let investment = this.investments.find(inv => inv.research.id == this.selectedResearchId);
                return investment ? {...investment.research, researchToken: investment.myShare } : null;
            }
        },

        methods: {
            loadUserAccount() {
                this.$store.dispatch('auth/loadAccount');
                this.$store.dispatch('userWallet/loadTransfers', this.user.username);
            },

            selectResearch(research) {
                this.selectedResearchId = research.id;
                this.sendingType = this.sendingTypes.researchToken;
            },

            loadResearches() {
                this.$store.dispatch('userWallet/loadResearchTokens', this.user.username);
            },

            researchChanged(id) {
                this.selectedResearchId = id;
            }
        },
        
        created() {
            
        }
    };
</script>

<style lang="less" scoped>
    @import './../../../styles/colors.less';

    .tokens-send-panel {
        width: 300px;
        flex-shrink: 0;
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

    .v-enter-active, .v-leave-active {
        transition: opacity .1s;
    }
    .v-enter, .v-leave-to {
        opacity: 0;
    }

    .info-card-list {
        .list-line {
            display: flex;
            padding-top: 24px;
            padding-bottom: 24px;
            padding-left: 12px;
            padding-right: 12px;
        }
        .list-header-cell {
            padding-right: 12px;
            padding-left: 12px;
            color: @grey;
        }
        .list-body-cell {
            padding-right: 12px;
            padding-left: 12px;
            align-self: center;
        }
    }
</style>
