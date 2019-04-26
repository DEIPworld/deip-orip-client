<template>
    <div>
        <div class="display-1 half-bold">Investor 1 Inbox</div>

        <div class="row justify-between align-center c-pt-6">
            <div class="title">Recent updates</div>
            
            <v-menu offset-y>
                <v-btn slot="activator" class="ma-0">
                    <div class="deip-blue-color">
                        ALL
                        <v-icon class="c-pl-4" small>keyboard_arrow_down</v-icon>
                    </div>
                </v-btn>

                <v-list>
                    <v-list-tile @click="">
                        <v-list-tile-title>All</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile @click="">
                        <v-list-tile-title>Filter 1</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile @click="">
                        <v-list-tile-title>Filter 2</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </div>

        <div class="c-pt-6">
            <v-card>
                <div class="row-nowrap align-items-center item">
                    <div class="item-tag primary"></div>

                    <div class="c-pl-2 c-pr-2">
                        <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                    </div>

                    <div class="col-grow overflow-hidden">
                        <div class="a subheading ellipsis">Integrated mobility network Integrated mobility network Integrated mobility network</div>
                    </div>

                    <div class="display-flex">
                        <span class="c-mh-1 color-label blue lighten-3">A. Lawren</span>
                        <span class="c-mh-1 color-label yellow lighten-1">Wait for review</span>
                    </div>
                </div>

                <v-divider></v-divider>
                
                <div class="row-nowrap align-items-center item">
                    <div class="item-tag primary"></div>

                    <div class="c-pl-2 c-pr-2">
                        <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                    </div>

                    <div class="col-grow overflow-hidden">
                        <div class="a subheading ellipsis">Parallel functional preprocessor</div>
                    </div>

                    <div class="display-flex">
                        <span class="c-mh-1 color-label green lighten-3">Sponsored</span>
                    </div>
                </div>

                <v-divider></v-divider>
                
                <div class="row-nowrap align-items-center item">
                    <div class="item-tag primary"></div>

                    <div class="c-pl-2 c-pr-2">
                        <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                    </div>

                    <div class="col-grow overflow-hidden">
                        <div class="a subheading ellipsis">Virtual programmable compiler</div>
                    </div>

                    <div class="display-flex">
                        <span class="c-mh-1 color-label light-blue lighten-3">Quant. Op</span>
                        <span class="c-mh-1 color-label brown lighten-2">Reviewed</span>
                    </div>
                </div>
            </v-card>
        </div>




        <!--
            Dublicating
        -->
        <div class="row justify-between align-center c-pt-10">
            <div class="title">Unread reviews: 3</div>
        </div>

        <div class="c-pt-6">
            <v-card>
                <div class="row-nowrap align-items-center item">
                    <div class="item-tag"></div>

                    <div class="c-pl-2 c-pr-2">
                        <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                    </div>

                    <div class="a subheading">Integrated mobility network</div>
                    <div class="col-grow"></div>

                    <div class="display-flex">
                        <span class="c-mh-1 color-label yellow lighten-1">Wait for review</span>
                    </div>
                </div>

                <v-divider></v-divider>
                
                <div class="row-nowrap align-items-center item">
                    <div class="item-tag"></div>

                    <div class="c-pl-2 c-pr-2">
                        <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                    </div>

                    <div class="a subheading">Parallel	functional	preprocessor</div>
                    <div class="col-grow"></div>

                    <div class="display-flex">
                        <span class="c-mh-1 color-label brown lighten-2">Reviewed</span>
                    </div>
                </div>

                <v-divider></v-divider>
                
                <div class="row-nowrap align-items-center item">
                    <div class="item-tag primary"></div>

                    <div class="c-pl-2 c-pr-2">
                        <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                    </div>

                    <div class="a subheading">Virtual programmable compiler</div>
                    <div class="col-grow"></div>

                    <div class="display-flex">
                        <span class="c-mh-1 color-label yellow lighten-1">Wait for review</span>
                        <span class="c-mh-1 color-label light-blue lighten-3">Quant. Op</span>
                    </div>
                </div>
            </v-card>
        </div>

        
        <div class="row justify-between align-center c-pt-10">
            <div class="title">Reviews request: 2</div>
        </div>

        <div class="c-pt-6">
            <v-card>
                <div class="row-nowrap align-items-center item">
                    <div class="item-tag primary"></div>

                    <div class="c-pl-2 c-pr-2">
                        <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                    </div>

                    <div class="a subheading">Integrated mobility network</div>
                    <div class="col-grow"></div>

                    <div class="display-flex">
                        <span class="c-mh-1 color-label green lighten-3">Sponsored</span>
                        <span class="c-mh-1 color-label yellow lighten-1">Wait for review</span>
                    </div>
                </div>

                <v-divider></v-divider>
                
                <div class="row-nowrap align-items-center item">
                    <div class="item-tag"></div>

                    <div class="c-pl-2 c-pr-2">
                        <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                    </div>

                    <div class="a subheading">Parallel	functional	preprocessor</div>
                    <div class="col-grow"></div>

                    <div class="display-flex">
                        <span class="c-mh-1 color-label green lighten-3">Sponsored</span>
                        <span class="c-mh-1 color-label brown lighten-2">Reviewed</span>
                    </div>
                </div>
            </v-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'InvestorDashboardBody',

        data() {
            return {
            }
        },

        methods: {
        },
    }
</script>

<style lang="less" scoped>
    .item {
        height: 40px;
        padding-right: 4px;

        .item-tag {
            width: 4px;
            height: 100%;
        }
    }
</style>
