<template>
    <div>
        <div class="legacy-row legacy-justify-between align-center">
            <div class="title">{{ !headerText ? 'Research projects' : headerText }}</div>
            
            <v-menu offset-y>
                <v-btn slot="activator" class="ma-0">
                    <div>Newest First <v-icon class="c-pl-4" small>keyboard_arrow_down</v-icon></div>
                </v-btn>

                <v-list>
                    <v-list-tile @click="">
                        <v-list-tile-title>Newest First</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile @click="">
                        <v-list-tile-title>Oldest First</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </div>

        <div class="c-pt-5">
            <v-tabs slot="extension" v-model="tab" grow color="primary lighten-5">
                <v-tabs-slider :color="themeSettings['tabs-slider-color']"></v-tabs-slider>

                <v-tab :class="themeSettings['tabs-text-class']" key="active" :disabled="activeResearchList.length === 0">
                    Acitive research: {{ activeResearchList.length }}
                </v-tab>

                <v-tab :class="themeSettings['tabs-text-class']" key="finished" :disabled="finishedResearchList.length === 0">
                    Finished research: {{ finishedResearchList.length }}
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab" style="margin: 0px -2px -3px;">
                <v-tab-item key="active">
                    <div style="margin: 0px 2px 3px;">
                        <v-card class="hidden-last-child">
                            <template v-for="item in activeResearchList">
                                <research-list-item :research="item"></research-list-item>
                                <v-divider></v-divider>
                            </template>
                        </v-card>
                    </div>

                    <v-card flat v-if="!activeResearchList.length">
                        <v-card-text>There is no active research at the moment</v-card-text>
                    </v-card>
                </v-tab-item>

                <v-tab-item key="finished">
                    <div style="margin: 0px 2px 3px;">
                        <v-card class="hidden-last-child">
                            <template v-for="item in finishedResearchList">
                                <research-list-item :research="item"></research-list-item>
                                <v-divider></v-divider>
                            </template>
                        </v-card>
                    </div>

                    <v-card flat v-if="!finishedResearchList.length">
                        <v-card-text>Finished research list is empty at the moment</v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </div>
    </div>
</template>

<script>
    import deipRpc from '@deip/deip-oa-rpc-client';
    import { mapGetters } from 'vuex';

    export default {
        name: 'StateResearchList',
        props: {
            researchList: { required: true, type: Array },
            headerText: { required: false, type: String },
        },
        data() {
            return {
                tab: null
            }
        },
        computed: {
            ...mapGetters({
                themeSettings: 'layout/themeSettings'
            }),
            finishedResearchList() {
                return this.researchList.filter(research => research.is_finished);
            },
            activeResearchList() {
                return this.researchList.filter(research => !research.is_finished);
            },
        },
        created() {
        }
    }
</script>

<style lang="less" scoped>
</style>
