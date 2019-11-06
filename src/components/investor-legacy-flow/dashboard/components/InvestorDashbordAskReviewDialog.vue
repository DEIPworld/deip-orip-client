<template>
    <v-dialog fullscreen v-model="isShown" persistent transition="scale-transition">
        <v-card class="" v-if="isShown">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="$emit('close')">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Request review</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <page-container>
                <contentbar>

                    <!-- in future should be replaced by ResearchFeedListItem -->
                    <v-card>
                        <div class="c-p-6 pos-relative">
                            <div class="a subheading">Parallel functional preprocessor</div>

                            <div class="c-pt-2">
                                <div class="a c-pr-2 caption">Minsk 1 RG</div>

                                <span class="caption grey--text hidden-last-child">
                                    Floria Ptacek  ·  Raquel Oliveras  ·  Fernando	Zimmerman 
                                </span>
                            </div>

                            <div class="c-pt-2">
                                <v-divider></v-divider>
                                <div class="c-pv-2 half-bold">
                                    Seamlessly leverage existing empowered relationships whereas high-payoff potentialities.
                                    Dynamically maximize accurate networks whereas revolutionary innovation. Compellingly
                                    repurpose 24/365 deliverables rather than holistic intellectual capital. Authoritatively
                                    evolve prospective paradigms without vertical services. Compellingly.
                                </div>
                                <v-divider></v-divider>
                            </div>

                            <div class="legacy-row c-pt-2">
                                <div class="grey--text">
                                    <span class="c-pr-1">
                                        <span class="">Computer science</span>
                                    </span>

                                    <span class="c-pr-4 bold">
                                        <span>1500</span>
                                    </span>
                                </div>
                            </div>

                            <div class="legacy-row-nowrap c-pt-1">
                                <div class="c-pr-8 grey--text">
                                    <v-icon color="grey" size="18px">event</v-icon> Created
                                    <span class="half-bold">20 Jan 2018</span>
                                </div>

                                <div class="c-pr-8 grey--text">
                                    <v-icon color="grey" size="18px">timelapse</v-icon> Owned tokens
                                    <span class="half-bold">100%</span>
                                </div>

                                <div class="c-pr-8 grey--text">
                                    <v-icon color="grey" size="18px">pie_chart</v-icon> Review award
                                    <span class="half-bold">5%</span>
                                </div>

                                <div class="c-pr-8">
                                    <v-icon color="grey" size="18px">chat_bubble</v-icon>
                                    
                                    <span class="bold display-inline-flex">
                                        <span class="green--text text--darken-2">7</span>
                                        <span>/</span>
                                        <span class="red--text text--darken-2">5</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </v-card>

                    <div class="c-pt-6">
                        <v-textarea
                            label="Type your cover letter"
                            auto-grow
                            :rows="2"
                            value="HI! I’m reprsenting XYZ fund supporting perspective and undiscovered computer science research all over the world. Can you please review the following publication for the reward of 200 Deip Tokens? Thank you in advance. Cheers, John."
                        ></v-textarea>
                    </div>

                    <div class="c-pt-5">
                        <v-tabs slot="extension" v-model="tab" grow color="blue lighten-4">
                            <v-tabs-slider color="black"></v-tabs-slider>

                            <v-tab key="findReviewers">Find reviwers</v-tab>
                            <v-tab key="myReviewers">My reviewers</v-tab>
                        </v-tabs>

                        <v-tabs-items v-model="tab" style="margin: 0px -2px -3px;">
                            <v-tab-item key="findReviewers">
                                <div style="margin: 0px 2px 3px;">
                                    <v-card class="c-ph-12 c-pv-6">
                                        <v-text-field
                                            label="Start typing for suggestion"
                                            append-icon="search"
                                        ></v-text-field>

                                        <v-radio-group>
                                            <div class="legacy-row">
                                                <div class="width-9">
                                                    <v-radio
                                                        label="By name"
                                                        value="by-name"
                                                    ></v-radio>
                                                </div>

                                                <div class="width-9">
                                                    <v-radio
                                                        label="By keywords"
                                                        value="by-keywords"
                                                    ></v-radio>
                                                </div>
                                            </div>
                                        </v-radio-group>

                                        <div class="c-pt-8">
                                            <div class="legacy-row-nowrap legacy-align-items-center">
                                                <v-avatar size="40px" class="">
                                                    <!-- <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" /> -->
                                                    <v-gravatar :email="'shawna' + '@deip.world'" />
                                                </v-avatar>

                                                <div class="c-pl-4 legacy-col-grow">
                                                    <span class="a">Shawna Mathis</span>
                                                </div>

                                                <div class="">
                                                    <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                                                </div>
                                            </div>

                                            <div class="legacy-row-nowrap legacy-align-items-center c-pt-4">
                                                <v-avatar size="40px" class="">
                                                    <!-- <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" /> -->
                                                    <v-gravatar :email="'egow' + '@deip.world'" />
                                                </v-avatar>

                                                <div class="c-pl-4 legacy-col-grow">
                                                    <span class="a">Egow Tompson</span>
                                                </div>

                                                <div class="">
                                                    <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                                                </div>
                                            </div>

                                            <div class="legacy-row-nowrap legacy-align-items-center c-pt-4">
                                                <v-avatar size="40px" class="">
                                                    <!-- <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" /> -->
                                                    <v-gravatar :email="'Egota' + '@deip.world'" />
                                                </v-avatar>

                                                <div class="c-pl-4 legacy-col-grow">
                                                    <span class="a">Egota Rydberg</span>
                                                </div>

                                                <div class="">
                                                    <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                                                </div>
                                            </div>
                                        </div>
                                    </v-card>
                                </div>
                            </v-tab-item>

                            <v-tab-item key="myReviewers">
                                <div style="margin: 0px 2px 3px;">
                                    <v-card class="c-ph-12 c-pv-6">
                                        <div class="legacy-row-nowrap legacy-align-items-center">
                                            <v-avatar size="40px" class="">
                                                <!-- <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" /> -->
                                                <v-gravatar :email="'shawna' + '@deip.world'" />
                                            </v-avatar>

                                            <div class="c-pl-4 legacy-col-grow">
                                                <span class="a">Shawna Mathis</span>
                                            </div>

                                            <div class="">
                                                <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                                            </div>
                                        </div>

                                        <div class="legacy-row-nowrap legacy-align-items-center c-pt-4">
                                            <v-avatar size="40px" class="">
                                                <!-- <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" /> -->
                                                <v-gravatar :email="'egow' + '@deip.world'" />
                                            </v-avatar>

                                            <div class="c-pl-4 legacy-col-grow">
                                                <span class="a">Egow Tompson</span>
                                            </div>

                                            <div class="">
                                                <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                                            </div>
                                        </div>

                                        <div class="legacy-row-nowrap legacy-align-items-center c-pt-4">
                                            <v-avatar size="40px" class="">
                                                <!-- <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" /> -->
                                                <v-gravatar :email="'Egota' + '@deip.world'" />
                                            </v-avatar>

                                            <div class="c-pl-4 legacy-col-grow">
                                                <span class="a">Egota Rydberg</span>
                                            </div>

                                            <div class="">
                                                <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                                            </div>
                                        </div>

                                        <div class="legacy-row-nowrap legacy-align-items-center c-pt-4">
                                            <v-avatar size="40px" class="">
                                                <!-- <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" /> -->
                                                <v-gravatar :email="'Bern' + '@deip.world'" />
                                            </v-avatar>

                                            <div class="c-pl-4 legacy-col-grow">
                                                <span class="a">John Bern</span>
                                            </div>

                                            <div class="">
                                                <v-checkbox class="ma-0 pa-0" hide-details></v-checkbox>
                                            </div>
                                        </div>
                                    </v-card>
                                </div>
                            </v-tab-item>
                        </v-tabs-items>
                    </div>
                    
                    <div class="legacy-row legacy-justify-center c-p-6">
                        <v-btn color="primary"
                        >Send a review request</v-btn>
                    </div>

                </contentbar>
            </page-container>

        </v-card>
    </v-dialog>
</template>

<script>
    import _ from 'lodash';
    import { mapGetters } from 'vuex';

    export default {
        name: "InvestorDashbordAskReviewDialog",

        props: {
            isShown: { type: Boolean, required: true }
        },

        data() {
            return {
                tab: null
            }
        },

        computed: {
            ...mapGetters({
                user: 'auth/user'
            })
        },

        methods: {
        },

        watch: {
            'isShown': function(newValue) {
                if (newValue) {
                }
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
