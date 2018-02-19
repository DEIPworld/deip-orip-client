<template>
    <div class="p-4">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">

        <div class="fluid-container">
            <div class="row">
                <div class="col-4 py-1">
                    <div class="bg-dark text-white p-1">Researh Groups</div>

                    <div class="py-4 container">
                        <div class="row">
                            <input type="text" v-model="newResearchGroup.description" class="form-control col-6 mb-1" placeholder="Description">
                            <input type="text" v-model="newResearchGroup.permlink" class="form-control col-6 mb-1" placeholder="Permlink">
                            <input type="number" v-model="newResearchGroup.funds" class="form-control col-4 mb-1" min="0" placeholder="Funds">
                            <input type="number" v-model="newResearchGroup.quorumPercent" class="form-control col-4 mb-1" min="0" placeholder="Quorum percent">
                            <input type="number" v-model="newResearchGroup.tokensAmount" class="form-control col-4 mb-1" min="0" placeholder="Tokens amount">
                            <button type="button" class="btn btn-info" v-on:click="addResearchGroup()" v-bind:disabled="isAddingGroupDisabled">Add</button>
                        </div>
                    </div>

                    <div class="items-list">
                        <div v-for="group in groups" class="p-1 text-secondary"
                            v-bind:class="{ 'active-item': activeGroup === group }"
                            v-on:click="clickGroup(group)"
                        >
                            ID: {{ group.id }}, amount({{ group.amount }})
                        </div>
                    </div>
                    
                </div>

                <div class="col-4 py-1" v-if="proposals">
                    <div class="bg-dark text-white p-1">Proposals</div>

                    <div class="py-4 container">
                        <div class="row">
                            <select v-model="newProposal.actionId" class="form-control col-8 mb-1">
                                <option v-bind:value="value" v-for="(value, key) in opetationsMap">{{ value }} - {{ key }}</option>
                            </select>
                            <textarea v-model="newProposal.data" class="form-control col-12 mb-1" placeholder="Data JSON"></textarea>
                            <button type="button" class="btn btn-info" v-on:click="addProposal()" v-bind:disabled="isAddingProposalDisabled">Add</button>
                        </div>
                    </div>

                    <div class="items-list">
                        <div v-for="proposal in proposals" class="p-1 text-secondary justify-content-between form-inline"
                            v-bind:class="{ 'active-item': activeProposal === proposal }"
                            v-on:click="activeProposal = proposal"
                        >
                            <div>ID: {{ proposal.id }}, action - {{ proposal.action }}</div>
                            <button type="button" class="btn-sm btn-outline-secondary" @click="voteProposal(proposal, $event)">Vote</button>
                        </div>
                    </div>
                </div>

                <div class="col-4 py-1" v-if="activeProposal">
                    <hr>
                    <div>creator - <b>{{ activeProposal.creator }}</b></div>
                    <div>current_votes_amount - <b>{{ activeProposal.current_votes_amount }}</b></div>
                    <div>quorum_percent - <b>{{ activeProposal.quorum_percent }}</b></div>
                    <div>voted_accounts - <b>{{ activeProposal.voted_accounts }}</b></div>
                    <hr>
                    <div>{{ activeProposal.data }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import 'e:/deip/deip-connector/deip-rpc/dist/deip.min';

    export default {
        name: "AdminPage",
        data() {
            return {
                newResearchGroup: {},
                newProposal: {},
                user: { name: 'initdelegate', postingWif: '5JidFW79ttL9YP3W2Joc5Zer49opYU3fKNeBx9B6cpEH1GiDm5p' },
                groups: [],
                activeGroup: undefined,
                proposals: undefined,
                activeProposal: undefined,
                opetationsMap: {
                    start_research: 1,
                    invite_member: 2,
                    dropout_member: 3,
                    send_funds: 4,
                    transfer_research_tokens: 5,
                    start_research_token_sale: 6,
                    rebalance_research_group_tokens: 7,
                    change_quorum: 8,
                    change_research_review_share_percent: 9,
                    offer_research_tokens: 10,
                    accept_research_tokens_offer: 11,
                    create_research_material: 12
                }
            };
        },
        methods: {
            loadResearchGroups() {
                // there is no method which will be able to load normal group collection
                deipRpc.api.getResearchGroupTokensByAccountAsync(this.user.name).then((data) => {
                    this.groups = data;
                    this.proposals = undefined;
                });
            },
            loadGroupProposals(groupId) {
                this.activeProposal = undefined;
                deipRpc.api.getProposalsByResearchGroupIdAsync(groupId).then((data) => {
                    this.proposals = data;
                    // console.log(data);
                });
            },
            clickGroup(group) {
                this.activeGroup = group;
                this.loadGroupProposals(group.id);
            },
            addResearchGroup() {
                deipRpc.broadcast.createResearchGroupAsync(
                    this.user.postingWif,
                    this.user.name,
                    this.newResearchGroup.permlink,
                    this.newResearchGroup.description,
                    parseInt(this.newResearchGroup.funds),
                    parseInt(this.newResearchGroup.quorumPercent),
                    parseInt(this.newResearchGroup.tokensAmount)
                ).then(() => {
                    this.newResearchGroup = {};
                    this.loadResearchGroups();
                });
            },
            addProposal() {
                // 1 - `{"research_group_id": ${res.id},"name": "researchProposal","abstract": "this is abstract","permlink": "${permlink}","review_share_in_percent": 30}`, 
                // 8 - `{"quorum_percent": 80,"research_group_id": ${res.id}}`, 
                // 4 - `{"research_group_id": ${res.id},"account_name": "bob","funds": 20}`,
                // 2 - `{"name": "alice","research_group_id": 1,"research_group_token_amount": 50}`
                deipRpc.broadcast.createProposalAsync(
					this.user.postingWif,
					this.user.name, 
					this.activeGroup.id, 
					this.newProposal.data,
                    parseInt(this.newProposal.actionId),
					new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
				).then(() => {
                    this.newProposal = {};
                    this.loadGroupProposals(this.activeGroup.id);
                });
            },
            voteProposal(proposal, $event) {
                $event.stopPropagation();

                deipRpc.broadcast.voteProposalAsync(
                    this.user.postingWif,
                    this.user.name,
                    proposal.id,
                    this.activeGroup.id
                ).then(() => {
                    this.loadGroupProposals(this.activeGroup.id);
                });
            }
        },
        computed: {
            isAddingGroupDisabled() {
                return !this.newResearchGroup.description || !this.newResearchGroup.permlink
                    || !parseInt(this.newResearchGroup.funds) > 0 || !parseInt(this.newResearchGroup.quorumPercent) > 0 
                    || !parseInt(this.newResearchGroup.tokensAmount) > 0
            },
            isAddingProposalDisabled() {
                return !this.newProposal.data || !parseInt(this.newProposal.actionId) > 0;
            }
        },
        created() {
            deipRpc.api.setOptions({ url: 'ws://146.185.140.12:11011/' });
            deipRpc.config.set('chain_id', '4891abe5a98f993d984c9233bd667c37ec1b4c0bf9d9bce51c359af16f87ebc3');

            this.loadResearchGroups();
        }
    };
</script>

<style>
    .items-list > div:hover {
        background: #dddddd;
        cursor: pointer;
    }
    .active-item {
        background: #dddddd;
    }
    .fluid-container {
        width: 1500px;
        margin: 0 auto;
    }
</style>
