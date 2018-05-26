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
