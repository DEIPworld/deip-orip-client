<template>
    <page-container>
        <contentbar>
            <div>
                <div class="legacy-row legacy-justify-between legacy-align-items-end">
                    <div class="display-1 bold">
                        Block #{{contentMetadata.blockNum}}
                        <span v-if="isGenesisBlock" class="caption grey--text">GENESIS</span>
                    </div>

                    <!-- <qrcode value="Hello, World!" :options="{ size: 120 }"></qrcode> -->
                </div>

                <div class="c-mt-4">
                    <div class="bold">Block ID</div>
                    <div class="legacy-row grey-border-stripe">
                        <div class="pill width-7 white--text">RIPEMD-160</div>
                        <div class="legacy-col-grow pill-value">{{contentMetadata.blockId}}</div>
                    </div>
                </div>

            <!--    <div class="c-mt-4">
                    <div class="legacy-row">
                        <div class="bold width-7">Research</div>
                        <div class="bold deip-blue-color c-pl-4">
                            <router-link class="a" :to="{ name: 'ResearchDetails', params: { 
                                research_group_permlink: $route.params.research_group_permlink,
                                research_permlink: $route.params.research_permlink}}">
                                {{ contentMetadata.research.title }}
                            </router-link>
                        </div>
                    </div>
                    <div class="legacy-row grey-border-stripe">
                        <div class="pill width-7 white--text">Public ID</div>
                        <div class="legacy-col-grow pill-value">{{contentMetadata.research.id}}</div>
                    </div>
                </div> -->

                <div class="c-mt-4">
                    <div class="legacy-row">
                        <div class="bold width-7">Content</div>
                        <div class="bold deip-blue-color c-pl-4">
                            <router-link class="a" 
                                :to="`/${$route.params.research_group_permlink}/research/${$route.params.research_permlink}/${$route.params.content_permlink}`">
                                    {{ contentMetadata.content.title }}
                            </router-link>
                        </div>
                    </div>
                    <div class="legacy-row grey-border-stripe">
                        <div class="pill width-7 white--text">SHA256</div>
                        <div class="legacy-col-grow pill-value">{{getContentHash(contentMetadata.content.content)}}</div>
                    </div>
                </div>
                
                <div class="c-mt-4">
                    <div class="legacy-row">
                        <div class="bold width-7">Timestamp<br>(ISO 8601)</div>
                        <div class="c-pl-4 c-pt-3">{{new Date(contentMetadata.timestamp).toISOString()}}</div>
                    </div>
                </div>

                <div class="c-mt-8">
                    <div class="legacy-row">
                        <div class="bold width-7">Signee</div>

                        <div class="legacy-col-grow">
                            <div>
                                <div class="legacy-row">
                                    <v-avatar size="40px">
                                        <img v-if="contentMetadata.witness.user.profile" v-bind:src="contentMetadata.witness.user.profile.avatar | avatarSrc(80, 80, false)" />
                                        <v-gravatar v-else :email="contentMetadata.witness.user.account.name + '@deip.world'" />
                                    </v-avatar>
                                    <div class="c-ml-4">
                                        <router-link class="a" :to="'/user-details/' + contentMetadata.witness.user.account.name">
                                            {{contentMetadata.witness.user | fullname}}
                                        </router-link>
                                        <div class="caption grey--text">{{contentMetadata.witness.user.account.name}}</div>
                                    </div>
                                </div>

                                <div class="grey-border-stripe c-mt-4">
                                    <div class="legacy-row-nowrap">
                                        <div class="pill width-7">
                                            <div class="white--text">ECC</div>
                                        </div>
                                        <div class="legacy-col-grow pill-value">
                                            <div>{{ contentMetadata.witness.signingKey }}</div>
                                        </div>
                                    </div>
                                    
                                    <div class="legacy-row-nowrap">
                                        <div class="pill width-7 display-flex">
                                            <div class="grey--text text--darken-3 c-m-auto">Signature</div>
                                        </div>
                                        <div class="legacy-col-grow pill-value">
                                            <div class="">{{ contentMetadata.witness.signature }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="c-mt-8" v-if="!isGenesisBlock">
                    <div class="legacy-row">
                        <div class="bold width-7">Approved by</div>

                        <div class="legacy-col-grow">

                            <div class="c-mb-4" v-for="(voter, idx) in contentMetadata.voters" :key="'approver-' + idx">
                                <div class="legacy-row">
                                    <v-avatar size="40px">
                                        <img v-if="voter.user.profile" v-bind:src="voter.user.profile.avatar | avatarSrc(80, 80, false)" />
                                        <v-gravatar v-else :email="voter.user.account.name + '@deip.world'" />
                                    </v-avatar>
                                    <div class="c-ml-4">
                                        <router-link class="a" :to="'/user-details/' + voter.user.account.name">
                                            {{voter.user | fullname}}
                                        </router-link>
                                        <div class="caption grey--text">{{voter.user.account.name}}</div>
                                    </div>
                                </div>

                                <div class="grey-border-stripe c-mt-4">
                                    <div class="legacy-row-nowrap">
                                        <div class="pill width-7">
                                            <div class="white--text">ECC</div>
                                        </div>
                                        <div class="legacy-col-grow pill-value">
                                            <div>{{ voter.user.account.owner.key_auths[0][0] }}</div>
                                        </div>
                                    </div>
                                    
                                    <div class="legacy-row-nowrap">
                                        <div class="pill width-7 display-flex">
                                            <div class="grey--text text--darken-3 c-m-auto">Signature</div>
                                        </div>
                                        <div class="legacy-col-grow pill-value">
                                            <div class="">{{ voter.signature }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>

                <div class="c-mt-4" v-if="!isGenesisBlock">
                    <div class="bold">Transaction ID</div>
                    <div class="legacy-row grey-border-stripe">
                        <div class="pill width-7 white--text">RIPEMD-160</div>
                        <div class="legacy-col-grow pill-value">{{contentMetadata.transaction.id}}</div>
                    </div>
                </div>
                
                <div class="c-mt-4" v-if="!isGenesisBlock">
                    <div class="bold">Transaction HEX</div>
                    <div class="legacy-row-nowrap grey-border-stripe">
                        <div class="pill width-7 white--text display-flex">
                            <div class="c-m-auto">HEX</div>
                        </div>
                        <div class="legacy-col-grow pill-value">{{contentMetadata.transaction.hex}}</div>
                    </div>
                </div>

                <div class="c-mt-4">
                    <div class="bold">Chain ID</div>
                    <div class="legacy-row grey-border-stripe">
                        <div class="pill width-7 white--text">SHA256</div>
                        <div class="legacy-col-grow pill-value">{{contentMetadata.chainId}}</div>
                    </div>
                </div>

            </div>
        </contentbar>
    </page-container>
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-oa-rpc-client'
    import { findBlocksByRange } from './../../utils/blockchain'

    export default {
        name: "ResearchContentMetadata",

        data() { 
            return {
            } 
        },

        computed:{
            ...mapGetters({
                contentMetadata: 'rcd/contentMetadata'
            }),

            isGenesisBlock(){
                return this.contentMetadata.blockNum == 1;
            }
        },
        
        methods: {
            getContentHash(content) {
                return content.indexOf('file:') == 0 ? content.slice(5) : content.indexOf('dar:') == 0 ? content.slice(4) : content;
            }
        },

        created() {
        }
    };
</script>

<style lang="less" scoped>
    @import '../../styles/colors.less';

    .grey-border-stripe {
        border: 1px solid @grey-lighten-1;
        border-radius: 2px;
        position: relative;

        .pill {
            flex: 0 0 auto;
            background-color: @grey-lighten-1;
            padding: 4px 8px;
            text-align: center;
            vertical-align: middle;
        }

        .pill-value {
            padding: 4px 16px;
            word-break: break-word;
        }
    }
</style>
