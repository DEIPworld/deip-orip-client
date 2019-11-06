<template>
    <div>
        <div class="c-pb-6">
            <span class="title bold">
                <v-icon size="18" class="c-mr-2">dashboard</v-icon> My dashboard
            </span>
        </div>
        
        <div class="sidebar-fullwidth">
            <v-divider></v-divider>
        </div>
        
        <div class="c-pt-6 c-pb-6">
            <div class="">
                <span class="title bold">My lists</span>
            </div>

            <div class="c-pt-4">
                <div class="legacy-row-nowrap legacy-align-items-center">
                    <div class="color-circle green"></div>
                    <div class="c-pl-2">My investments</div>
                    <div class="legacy-col-grow"></div>
                    <div class="">8</div>
                </div>

                <div class="legacy-row-nowrap legacy-align-items-center c-pt-2">
                    <div class="color-circle yellow"></div>
                    <div class="c-pl-2">Reviewed</div>
                    <div class="legacy-col-grow"></div>
                    <div class="">5</div>
                </div>
                
                <div class="legacy-row-nowrap legacy-align-items-center c-pt-2">
                    <div class="color-circle red"></div>
                    <div class="c-pl-2">Computer science</div>
                    <div class="legacy-col-grow"></div>
                    <div class="">3</div>
                </div>
                
                <div class="legacy-row-nowrap legacy-align-items-center c-pt-2">
                    <div class="color-circle blue"></div>
                    <div class="c-pl-2">A. Lawrence</div>
                    <div class="legacy-col-grow"></div>
                    <div class="">6</div>
                </div>

                <div class="c-pt-4">
                    <v-btn class="ma-0" outline icon color="primary">
                        <v-icon small>add</v-icon>
                    </v-btn>

                    <span class="c-pl-2 deip-blue-color">Add new list</span>
                </div>
            </div>
        </div>
        
        <div class="sidebar-fullwidth">
            <v-divider></v-divider>
        </div>
        
        <div class="c-pt-6 c-pb-6">
            <div class="">
                <span class="title bold">My reviewers</span>
                <span class="float-right a">See all 25</span>
            </div>

            <div class="c-pt-4">
                <div class="legacy-row-nowrap legacy-align-items-center">
                    <v-avatar size="40px">
                        <v-gravatar :email="'shkor' + '@deip.world'" />
                    </v-avatar>

                    <div class="c-pl-3 a">Alex Shkor</div>
                    <div class="legacy-col-grow"></div>
                    <div class="">8</div>
                </div>

                <div class="legacy-row-nowrap legacy-align-items-center c-pt-2">
                    <v-avatar size="40px">
                        <v-gravatar :email="'debra' + '@deip.world'" />
                    </v-avatar>

                    <div class="c-pl-3 a">Debra Ellis</div>
                    <div class="legacy-col-grow"></div>
                    <div class="">2</div>
                </div>

                <div class="legacy-row-nowrap legacy-align-items-center c-pt-2">
                    <v-avatar size="40px">
                        <v-gravatar :email="'lawson' + '@deip.world'" />
                    </v-avatar>

                    <div class="c-pl-3 a">Bob Lawsan</div>
                    <div class="legacy-col-grow"></div>
                    <div class="">11</div>
                </div>
            </div>
        </div>
        
        <div class="sidebar-fullwidth">
            <v-divider></v-divider>
        </div>

        <div class="c-pt-6 c-pb-6">
            <div class="">
                <span class="title bold">Saved search</span>
            </div>

            <div class="c-pt-4">
                <div class="a">Belarus</div>
                <div class="a">11.09.2018</div>
                <div class="a">Physics</div>
                <div class="a">Popular</div>
            </div>
        </div>

        <div class="c-pt-6 c-pb-6">
            <div class="">
                <span class="title bold">Saved comparison</span>
            </div>

            <div class="c-pt-4">
                <div class="a">Computer science</div>
                <div class="a">Reviewed search</div>
            </div>
        </div>

        <div class="c-pt-6 c-pb-6">
            <div class="">
                <span class="title bold">Reviews:</span>
                <span class="title bold a">30</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'InvestorDashboardSidebar',

        data() {
            return {
            }
        },

        methods: {
        },
        
        created() {
        }
    }
</script>

<style lang="less" scoped>
    .color-circle {
        width: 14px;
        height: 14px;
        border-radius: 7px;
    }
</style>
