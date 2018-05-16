<template>
    <v-container fluid fill-height class="pa-0 column-page">

        <div class="content-column">
            <div class="filling">
                <research-group-details-body
                    :proposals="proposals"
                ></research-group-details-body>
            </div>
        </div>

        <v-card height="100%" class="sidebar">
            <research-group-details-sidebar></research-group-details-sidebar>
        </v-card>

    </v-container>   
</template>

<script>

    import deipRpc from '@deip/deip-rpc';
    import _ from 'lodash';
    import * as proposalService from "../services/ProposalService"; 

    export default {
        name: "ResearchGroupDetails",
        data() { 
            return {
                proposals: []
            } 
        },
        created() {
            deipRpc.api.getProposalsByResearchGroupIdAsync(0)
                .then(data => {
                    this.proposals = _.map(data, proposal => proposalService.getParsedProposal(proposal));
                });
        }
    };
</script>

<style lang="less" scoped>
</style>
