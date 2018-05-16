<template>
    <div> 
        <div class="title">Proposals</div>

        <div class="row c-pt-2 justify-between align-center">
            <div class="row align-center">
                <span class="uppercase half-bold">Show past proposals</span>
                <v-switch class="c-ml-4" color="primary" hide-details v-model="areShownPastProposals"></v-switch>
            </div>
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

        <div class="c-pt-4">
            <v-expansion-panel>
                <v-expansion-panel-content hide-actions>
                    <div slot="header">
                        <div class="row-nowrap align-center c-pr-6">
                            <div class="id-col grey--text">ID</div>
                            <div class="proposal-type grey--text">Proposal</div>
                            <div class="date grey--text">Date</div>
                            <div class="date grey--text">Exp. date</div>
                            <div class="created-by grey--text">Created by</div>
                            <div class="voted grey--text">Voted</div>
                            <div class="action-col grey--text">Action</div>
                        </div>
                    </div>
                </v-expansion-panel-content>

                <v-expansion-panel-content>
                    <div slot="header">
                        <div class="row-nowrap align-center" v-on:click.stop>
                            <div class="id-col">
                                <div class="a">83</div>
                            </div>
                            <div class="proposal-type">
                                <v-icon small color="primary">person_add</v-icon>
                                <router-link to="/userDetails" class="a c-ml-2">A. Kastsiushkina</router-link>
                            </div>
                            <div class="date">
                                <div class="caption">27 Mar, 2018</div>
                            </div>
                            <div class="date">
                                <div class="caption">27 May, 2018</div>
                            </div>
                            <div class="created-by">
                                <router-link to="/userDetails" class="a overflow-ellipsis">A. Kastsiushkina</router-link>
                            </div>
                            <div class="voted">
                                <div>40 of 70%</div>
                            </div>
                            <div class="action-col">
                                <v-btn flat small color="primary" class="ma-0">Approve</v-btn>
                            </div>
                        </div>
                    </div>
                    <v-card>
                        <v-card-text class="pt-0">
                            <div class="c-ph-2">
                                <div class="caption">
                                    Seamlessly leverage existing empowered relationships whereas high-payoff potentialities. 
                                    Dynamically maximize accurate networks whereas revolutionary innovation. Compellingly 
                                    repurpose 24/365 deliverables rather than holistic intellectual capital. Authoritatively 
                                    evolve prospective paradigms without vertical services. Compellingly.
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>

                <v-expansion-panel-content>
                    <div slot="header">
                        <div class="row-nowrap align-center" v-on:click.stop>
                            <div class="id-col">
                                <div class="a">89</div>
                            </div>
                            <div class="proposal-type">
                                <v-icon small color="primary">person_add</v-icon>
                                <router-link to="/userDetails" class="a c-ml-2">E. Marushko</router-link>
                            </div>
                            <div class="date">
                                <div class="caption">22 Apr, 2018</div>
                            </div>
                            <div class="date">
                                <div class="caption">9 May, 2018</div>
                            </div>
                            <div class="created-by">
                                <router-link to="/userDetails" class="a overflow-ellipsis">E. Marushko</router-link>
                            </div>
                            <div class="voted">
                                <div>0 of 52%</div>
                            </div>
                            <div class="action-col">
                                <v-btn flat small color="primary" class="ma-0">Approve</v-btn>
                            </div>
                        </div>
                    </div>
                    <v-card>
                        <v-card-text class="pt-0">
                            <div class="c-ph-2">
                                <div class="caption">
                                    Seamlessly leverage existing empowered relationships whereas high-payoff potentialities. 
                                    Dynamically maximize accurate networks whereas revolutionary innovation. Compellingly 
                                    repurpose 24/365 deliverables rather than holistic intellectual capital. Authoritatively 
                                    evolve prospective paradigms without vertical services. Compellingly.
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>

                <v-expansion-panel-content>
                    <div slot="header">
                        <div class="row-nowrap align-center" v-on:click.stop>
                            <div class="id-col">
                                <div class="a">101</div>
                            </div>
                            <div class="proposal-type">
                                <v-icon small color="primary">note_add</v-icon>
                                <div class="a c-ml-2">Blockchain innovate  best way maintainable Blockchain innovate  best way maintainable</div>
                            </div>
                            <div class="date">
                                <div class="caption">30 Mar, 2018</div>
                            </div>
                            <div class="date">
                                <div class="caption">10 Jun, 2018</div>
                            </div>
                            <div class="created-by">
                                <router-link to="/userDetails" class="a overflow-ellipsis">N. Ignatiev</router-link>
                            </div>
                            <div class="voted">
                                <div>100 of 100%</div>
                            </div>
                            <div class="action-col">
                                <v-btn flat small color="primary" class="ma-0" disabled>Approved</v-btn>
                            </div>
                        </div>
                    </div>
                    <v-card>
                        <v-card-text class="pt-0">
                            <div class="c-ph-2">
                                <div class="caption">
                                    Seamlessly leverage existing empowered relationships whereas high-payoff potentialities. 
                                    Dynamically maximize accurate networks whereas revolutionary innovation. Compellingly 
                                    repurpose 24/365 deliverables rather than holistic intellectual capital. Authoritatively 
                                    evolve prospective paradigms without vertical services. Compellingly.
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>
    </div>   
</template>

<script>
    export default {
        name: "ResearchGroupDetailsProposals",
        props: {
            proposals: { required: true, type: Array, default: [] }
        },
        data() { 
            return {
                areShownPastProposals: false
            } 
        },
        watch: {
            'proposals': function(newProposals) {
                console.log('PROPOSALS', newProposals);
            }
        }
    };
</script>

<style lang="less" scoped>
    .id-col {
        width: 60px;
    }
    .proposal-type {
        display: flex;
        align-items: flex-start;
        flex: 1 0 0;
    }
    .date {
        width: 90px;
        text-align: center;
        flex-shrink: 0;
    }
    .created-by {
        padding-left: 20px;
        width: 200px;
        flex-shrink: 0;
    }
    .voted {
        width: 90px;
        text-align: center;
        flex-shrink: 0;
    }
    .action-col {
        width: 100px;
        display: flex;
        justify-content: center;
    }

</style>
