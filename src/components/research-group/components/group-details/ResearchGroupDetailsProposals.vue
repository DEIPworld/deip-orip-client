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
                        <div class="row-nowrap align-center c-pr-6 grey--text">
                            <div class="id-col">ID</div>
                            <div class="proposal-type">Proposal</div>
                            <div class="date">Date</div>
                            <div class="date">Exp. date</div>
                            <div class="created-by">Created by</div>
                            <div class="voted">Voted</div>
                            <div class="action-col">Action</div>
                        </div>
                    </div>
                </v-expansion-panel-content>

                <research-group-details-proposals-item
                    v-for="(proposal, i) in proposals" :key="i"
                    :proposal="proposal"
                ></research-group-details-proposals-item>

                <!-- <v-expansion-panel-content>
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
                </v-expansion-panel-content> -->
            </v-expansion-panel>
        </div>
    </div>   
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "ResearchGroupDetailsProposals",
        props: {
        },
        data() { 
            return {
                areShownPastProposals: false
            } 
        },
        computed: {
            ...mapGetters({
                proposals: 'researchGroup/proposals'
            })
        }
    };
</script>

<style lang="less">
    .id-col {
        width: 60px;
    }
    .proposal-type {
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
