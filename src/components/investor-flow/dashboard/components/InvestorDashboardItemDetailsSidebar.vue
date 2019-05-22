<template>
    <div>
        <div class="c-pb-6">
            <span class="a sm-title">
                Parallel functional	processor
            </span>
        </div>
        
        <div class="sidebar-fullwidth">
            <v-divider></v-divider>
        </div>

        <div class="c-pt-6 c-pb-6">
            <div class="caption grey--text">
                <v-icon size="18px">date_range</v-icon>
                <span>Created on 20 Jan 2018 by Alex Shkor</span>
            </div>

            <div class="c-pt-4">
                <span class="sm-title bold">Announcement</span>
            </div>

            <div class="c-pt-4">
                Intrinsicly seize resource-leveling infrastructures via prospective human capital. Efficiently aggregate
                quality users and revolutionary paradigms. Rapidiously aggregate reliable services through functional
                outsourcing. Completely reinvent B2B convergence before market-driven web-readiness. Uniquely seize
                principle-centered portals before visionary human capital.
                <span class="a">More</span>
            </div>
        </div>
        
        <div class="sidebar-fullwidth">
            <v-divider></v-divider>
        </div>

        <div class="c-pt-6 c-pb-6">
            <div class="">
                <span class="sm-title bold">Research group: Minsk 1</span>
            </div>

            <div class="c-pt-4">
                <v-avatar size="40px">
                    <v-gravatar :email="'shkor' + '@deip.world'" />
                </v-avatar>

                <v-avatar size="40px">
                    <v-gravatar :email="'debra' + '@deip.world'" />
                </v-avatar>

                <v-avatar size="40px">
                    <v-gravatar :email="'lawson' + '@deip.world'" />
                </v-avatar>
            </div>
        </div>
        
        <div class="sidebar-fullwidth">
            <v-divider></v-divider>
        </div>

        <div class="c-pt-6 c-pb-6">
            <div class="">
                <span class="sm-title bold">
                    Reviews:
                    <span class="green--text text--darken-2">9</span>
                    /
                    <span class="red--text text--darken-2">7</span>
                </span>
            </div>

            <div class="caption grey--text c-pt-4">
                <v-icon size="18px">av_timer</v-icon>
                <span>Reward period active till</span>
            </div>
            <div class="caption bold">
                <v-icon size="18px">event</v-icon>
                <span>20 Jan 2018 17:00</span>
            </div>

            <div class="c-pt-4">
                <div class="row-nowrap align-items-center">
                    <v-avatar size="40px" class="">
                        <!-- <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" /> -->
                        <v-gravatar :email="'rudberg' + '@deip.world'" />
                    </v-avatar>

                    <div class="c-pl-4 col-grow">
                        <div>
                            <span class="a">Anna Rudberg</span>
                            <span class="grey--text caption">10 Dec 2018</span>
                        </div>

                        <div class="caption">Imperial College London</div>
                        <div class="caption grey--text">Approve</div>
                    </div>
                </div>

                <div class="c-pt-4">
                    The paper is well written, easy to follow and cites the most significant papers in the field. Below
                    are my thoughts and suggestions on what else could be done in the continuation of the research.
                    <span class="a">Readmore</span>
                </div>

                <div class="caption grey--text c-pt-2">Computer Science +300  Physics +2087</div>

                <div class="c-pt-4">
                    <v-btn color="primary" block @click="isAskReviewDialogOpen = true">Request reveiw</v-btn>
                </div>
            </div>
        </div>
        
        <div class="sidebar-fullwidth">
            <v-divider></v-divider>
        </div>

        <div class="c-pt-6 c-pb-6">
            <div class="c-pt-4">
                <span class="sm-title bold">Research stakeholders</span>
            </div>

            <div class="c-pt-4">
                <div class="row-nowrap">
                    <div class="bold">Research group</div>
                    <div class="col-grow"></div>
                    <div class="">1000</div>
                </div>
                
                <div class="row-nowrap">
                    <div class="bold">Investor</div>
                    <div class="col-grow"></div>
                    <div class="">300</div>
                </div>
                
                <div class="row-nowrap">
                    <div class="bold">Fundraise</div>
                    <div class="col-grow"></div>
                    <div class="">20% on sale</div>
                </div>
            </div>
        </div>
        
        <div class="sidebar-fullwidth">
            <v-divider></v-divider>
        </div>

        <div class="c-pt-6 c-pb-6">
            <div class="c-pt-4">
                <span class="sm-title bold">My memo</span>
            </div>

            <div class="c-pt-4">
                Intrinsicly seize resource-leveling infrastructures via prospective human capital. Efficiently aggregate
                quality users and revolutionary paradigms. Rapidiously aggregate reliable services through functional
                outsourcing. Completely reinvent B2B convergence before market-driven web-readiness. Uniquely seize
                principle-centered portals before visionary human capital.
            </div>
        </div>
        
        <div class="sidebar-fullwidth">
            <v-divider></v-divider>
        </div>

        <div class="c-pt-6 c-pb-6">
            <div class="">
                <div>
                    <span class="color-label blue lighten-3">A. Lawren</span>
                </div>
                <div class="c-pt-2">
                    <span class="color-label yellow lighten-1">Wait for review</span>
                </div>
            </div>
        </div>
        
        <div class="sidebar-fullwidth">
            <v-divider></v-divider>
        </div>

        <div class="c-pt-6 c-pb-6">
            <div class="">
                <span class="sm-title bold">Comments</span>
            </div>

            <div class="c-pt-4">
                <div class="row-nowrap align-items-center">
                    <v-avatar size="40px" class="">
                        <!-- <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" /> -->
                        <v-gravatar :email="'shawna' + '@deip.world'" />
                    </v-avatar>

                    <div class="c-pl-4 col-grow">
                        <div>
                            <span class="a">Shawna Mathis</span>
                            <span class="grey--text caption">10 Dec 2018</span>
                        </div>
                    </div>
                </div>

                <div class="c-pt-4">
                    I think we can watch the development of the research for a little while
                </div>
            </div>
        </div>

        <investor-dashbord-ask-review-dialog
            :is-shown="isAskReviewDialogOpen"
            @close="isAskReviewDialogOpen = false"
        ></investor-dashbord-ask-review-dialog>
    </div>
</template>

<script>
    export default {
        name: 'InvestorDashboardSidebar',

        data() {
            return {
                isAskReviewDialogOpen: false
            }
        },

        methods: {
        },
        
        created() {
        }
    }
</script>

<style lang="less" scoped>
    .color-label {
        line-height: 25px;
        border-radius: 2px;
        text-transform: uppercase;
        font-size: 12px;
        padding: 0 10px;
        display: inline-block;
        vertical-align: middle;
        white-space: nowrap;
    }
</style>
