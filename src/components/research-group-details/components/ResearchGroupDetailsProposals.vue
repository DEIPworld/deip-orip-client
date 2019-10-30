<template>
    <div> 
        <div class="title">Proposals</div>

        <div class="row c-pt-2 legacy-justify-between align-center">
            <div class="row align-center">
                <span class="uppercase half-bold">Show approved proposals</span>

                <v-switch class="c-ml-4 mt-0 pt-0" 
                    color="primary" 
                    hide-details 
                    :value="filter.areShownPastProposals"
                    @change="updateProposalFilter(
                        { key: 'areShownPastProposals', value: !filter.areShownPastProposals }
                    )"
                ></v-switch>
            </div>

            <v-menu offset-y>
                <v-btn slot="activator" class="ma-0">
                    <div class="deip-blue-color">
                        <span v-if="filter.order === 'desc'">Newest First</span>
                        <span v-if="filter.order === 'asc'">Oldest First</span>

                        <v-icon class="c-pl-4" small>keyboard_arrow_down</v-icon>
                    </div>
                </v-btn>

                <v-list>
                    <v-list-tile @click="updateProposalFilter({ key: 'order', value: 'desc' })">
                        <v-list-tile-title>Newest First</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile @click="updateProposalFilter({ key: 'order', value: 'asc' })">
                        <v-list-tile-title>Oldest First</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </div>

        <div class="c-pt-4">
            <v-expansion-panel>
                <v-expansion-panel-content hide-actions>
                    <div slot="header">
                        <div class="legacy-row-nowrap align-center c-pr-6 grey--text">
                            <div class="id-col">ID</div>
                            <div class="proposal-activity">Proposal</div>
                            <div class="date">Date</div>
                            <div class="date">Exp. date</div>
                            <div class="created-by">Created by</div>
                            <div class="voted">Voted</div>
                            <div class="action-col">Action</div>
                        </div>
                    </div>
                </v-expansion-panel-content>

                <template v-if="proposals.length">
                    <research-group-details-proposals-item
                        v-for="(proposal, i) in proposals" :key="i"
                        :proposal="proposal"
                    ></research-group-details-proposals-item>
                </template>

                <v-expansion-panel-content hide-actions v-if="!proposals.length">
                    <div slot="header" class="grey--text display-flex height-4">
                        <div class="c-m-auto">Proposal list is empty</div>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>
    </div>   
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: "ResearchGroupDetailsProposals",
        props: {
        },
        data() { 
            return {} 
        },
        computed: {
            ...mapGetters({
                allProposals: 'researchGroup/proposals',
                filter: 'researchGroup/proposalListFilter'
            }),
            proposals() {
                return _(this.allProposals)
                    .filter(proposal => proposal.is_completed === this.filter.areShownPastProposals)
                    .orderBy([this.filter.sortBy], [this.filter.order])
                    .value();
            }
        },
        methods: {
            ...mapActions({
                updateProposalFilter: 'researchGroup/updateProposalFilter'
            })
        }
    };
</script>

<style lang="less">
    .id-col {
        width: 60px;
    }
    .proposal-activity {
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
