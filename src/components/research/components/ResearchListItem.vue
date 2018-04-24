<template>
    <div class="c-p-6 pos-relative">
        <router-link :to="/researchDetails/ + research.research_id" class="a subheading">
            {{research.title}}
        </router-link>
        <div class="caption grey--text c-pt-2">{{research.authors.join("  ·  ")}}</div>
        
        <div v-show="isCollapsable === undefined || !research.isCollapsed">
            <div class="c-pt-4 half-bold">
                {{research.abstract}}
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

        <div class="pos-absolute expand-btn" v-if="isCollapsable !== undefined">
            <v-btn flat small icon color="grey" class="ma-0" @click="changeMode()">
                <v-icon v-show="research.isCollapsed">keyboard_arrow_down</v-icon>
                <v-icon v-show="!research.isCollapsed">keyboard_arrow_up</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ResearchListItem",
        props: {
            research: { required: true, default: undefined },
            isCollapsable: { required: false, default: undefined }
        },
        data() {
            return {};
        },
        methods: {
            changeMode() {
                this.research.isCollapsed = !this.research.isCollapsed;
            }
        }
    };
</script>

<style lang="less" scoped>
    .expand-btn {
        right: 24px;
        bottom: 12px;
    }
</style>
