<template>
    <div class="c-ph-6 c-pt-6 c-pb-4">
        <router-link to="/researchDetails" class="a subheading">
            Antagonistically maximize market-driven quality vectors before progressive functionalities.
        </router-link>
        <div class="caption grey--text c-pt-2">Alex Shkor  ·  Artyom Ruseckiy  ·  Egor Tsaryk</div>
        
        <div v-show="!isCollapsed">
            <div class="c-pt-4 half-bold">
                Dramatically underwhelm extensive mindshare whereas cross-platform potentialities. Interactively recaptiualize viral relationships before competitive functionalities. 
                Synergistically strategize intermandated services with premier vortals.
            </div>
            <div class="c-pt-6">
                <div class="row-nowrap">
                    <div class="c-pr-10">
                        <div class="bold green--text text--darken-2">Quantum optics</div>
                    </div>
                    <div class="c-pr-10">
                        <div>900 tokens</div>
                    </div>
                    <div class="c-pr-10">
                        <v-icon size="18px">visibility</v-icon> <span>1999</span>
                    </div>
                    <div class="c-pr-10">
                        <v-icon size="18px">chat_bubble</v-icon> <span>23</span>
                    </div>
                    <div>
                        <v-icon size="18px">date_range</v-icon> <span>Upd 13 Mar 2018</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ResearchListItem",
        props: {
            isCollapsed: { type: Boolean, required: false }
        },
        data() {
            return {};
        }
    };
</script>

<style lang="less" scoped>
</style>
