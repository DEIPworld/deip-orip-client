<template>
    <v-card>
        <v-layout class="d-block c-p-4">
            <v-flex>
                <router-link to="/researchDetails" class="research-item-title">
                    Antagonistically maximize market-driven quality vectors before progressive functionalities.
                </router-link>
            </v-flex>
            <v-flex class="research-item-authors c-pt-3">Alex Shkor  ·  Artyom Ruseckiy  ·  Egor Tsaryk</v-flex>
            <v-flex class="research-item-caption" v-show="!isCollapsed">
                Dramatically underwhelm extensive mindshare whereas cross-platform potentialities. Interactively recaptiualize viral relationships before competitive functionalities. 
                Synergistically strategize intermandated services with premier vortals.
            </v-flex>
            <v-flex class="c-pt-3" v-show="!isCollapsed">
                <v-layout>
                    <v-flex shrink class="pr-5">
                        <div>Quantum optics</div>
                    </v-flex>
                    <v-flex shrink class="pr-5">
                        <div>900 tokens</div>
                    </v-flex>
                    <v-flex shrink class="pr-5">
                        <div>
                            <v-icon size="18px">visibility</v-icon> <span>1999</span>
                        </div>
                    </v-flex>
                    <v-flex shrink class="pr-5">
                        <div>
                            <v-icon size="18px">chat_bubble</v-icon> <span>23</span>
                        </div>
                    </v-flex>
                    <v-flex shrink>
                        <div>
                            <v-icon size="18px">date_range</v-icon> <span>Upd 13 Mar 2018</span>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout class="d-block c-p-4">
                <v-flex>
                    <router-link to="/researchDetails" class="research-item-title">
                        Antagonistically maximize market-driven quality vectors before progressive functionalities.
                    </router-link>
                </v-flex>
            <v-flex class="research-item-authors c-pt-3">Alex Shkor  ·  Artyom Ruseckiy  ·  Egor Tsaryk</v-flex>
            <v-flex class="research-item-caption" v-show="!isCollapsed">
                Dramatically underwhelm extensive mindshare whereas cross-platform potentialities. Interactively recaptiualize viral relationships before competitive functionalities. 
                Synergistically strategize intermandated services with premier vortals.
            </v-flex>
            <v-flex class="c-pt-3" v-show="!isCollapsed">
                <v-layout>
                    <v-flex shrink class="pr-5">
                        <div>Quantum optics</div>
                    </v-flex>
                    <v-flex shrink class="pr-5">
                        <div>900 tokens</div>
                    </v-flex>
                    <v-flex shrink class="pr-5">
                        <div>
                            <v-icon size="18px">visibility</v-icon> <span>1999</span>
                        </div>
                    </v-flex>
                    <v-flex shrink class="pr-5">
                        <div>
                            <v-icon size="18px">chat_bubble</v-icon> <span>23</span>
                        </div>
                    </v-flex>
                    <v-flex shrink>
                        <div>
                            <v-icon size="18px">date_range</v-icon> <span>Upd 13 Mar 2018</span>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
    export default {
        name: "ResearchList",
        props: {
            isCollapsed: Boolean
        },
        data() {
            return {};
        }
    };
</script>

<style lang="less" scoped>
    .research-item-title {
        font-size: 16px;
        color: #2F80ED;
        font-weight: 500;

        text-decoration: none;
    }
    .research-item-authors {
        font-size: 12px;
        color: #888888;
    }
    .research-item-caption {
        font-weight: 500;
        padding-top: 12px;
    }
</style>
