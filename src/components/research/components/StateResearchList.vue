<template>
    <div>
        <div class="row justify-between align-center">
            <div class="title">Research</div>
            <v-menu offset-y>
                <v-btn slot="activator" class="ma-0">
                    <div class="deip-blue-color">Newest First <v-icon class="c-pl-4" small>keyboard_arrow_down</v-icon></div>
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
            <v-tabs color="primary" slot="extension"  v-model="tab" grow dark>
                <v-tabs-slider color="black"></v-tabs-slider>
                <v-tab v-for="item in ['Acitive research:', 'Finished research:']" :key="item">
                    {{ item }} 2
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" style="margin: 0px -2px -3px;">
                <v-tab-item v-for="item in ['Acitive research:', 'Finished research:']" :key="item">
                    <div style="margin: 0px 2px 3px;">
                        <v-card>
                            <research-list-item></research-list-item>
                            <v-divider></v-divider>
                            <research-list-item></research-list-item>
                            <v-divider></v-divider>
                            <research-list-item></research-list-item>
                        </v-card>
                    </div>
                </v-tab-item>
            </v-tabs-items>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'StateResearchList',
        data() {
            return {
                tab: null
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
