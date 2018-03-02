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
                            <input type="number" v-model="newResearchGroup.quorumPercent" class="form-control col-4 mb-1" min="0" placeholder="Quorum percent">
                            <input type="number" v-model="newResearchGroup.tokensAmount" class="form-control col-4 mb-1" min="0" placeholder="Tokens amount">
                            <button type="button" class="btn btn-info" v-on:click="addResearchGroup()" v-bind:disabled="isAddingGroupDisabled">Add</button>
                        </div>
                    </div>

                    <div class="items-list">
                        <div v-for="group in groups" class="p-1 text-secondary"
                            v-bind:class="{ 'active-item': activeGroup === group }"
                            v-on:click="clickGroup(group)">
                            ID: {{ group.id }}, amount({{ group.amount }})
                        </div>
                    </div>
                    
                </div>

                <div  v-if="activeGroup" class="col-4 py-1">
                    <div class="bg-dark text-white p-1">Proposals for "{{activeGroup.id}}" group</div>
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
                            v-on:click="activeProposal = proposal">

                            ID: {{ proposal.id }}, action - {{ proposal.action }}
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

            <div class="row">
                <div class="col-4 py-1" v-if="researches.length">
                    <div class="bg-dark text-white p-1">Group {{activeGroup.id}} Researches</div>
                        <div class="items-list">
                            <div v-for="research in researches"  
                                v-bind:class="{ 'active-item': activeResearch === research }"
                                v-on:click="clickResearch(research)" class="p-1 text-secondary">
                                <div><b>Title:</b> {{ research.name }}</div>
                                <div><b>Abstract:</b> {{ research.abstract }}</div>
                            </div>
                    </div>
                </div>
                <div class="col-4 py-1" v-if="activeResearch && activeResearch.content.length">
                    <div class="bg-dark text-white p-1">Content for {{activeResearch.id}} research</div>
                        <div class="items-list">
                            <div v-for="content in activeResearch.content" v-on:click="clickResearchContent(content)" class="p-1 text-secondary">
                                <div><b>Type:</b> {{ content.content_type }}</div>
                                <div><b>Content:</b> {{ content.content }}</div>
                                <div><b>Authors:</b> {{ content.authors.join(", ") }}</div>
                                <div v-if="activeResearchContent === content"
                                     v-bind:class="{ 'active-item': activeResearchContent === content }"
                                     class="p-1 text-secondary">

                                    <label>Discipline:</label>
                                    <input type="number" v-model="votingDiscipline"></input>
                                    <br/>
                                    <label>Weight:</label>
                                    <input type="number" v-model="votingWeight"></input>
                                    <div><button type="button" class="btn-sm btn-outline-secondary" @click="voteResearchContent(content, $event)">Vote</button></div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    // import 'e:/deip/deip-connector/deip-rpc/dist/deip.min';
    import '/Users/yahortsaryk/work/ethereum/deip/deip-rpc/dist/deip.min'

    export default {
        name: "AdminPage",
        data() {
            return {
                newResearchGroup: {},
                newProposal: {},
                user: { name: 'initdelegate', postingWif: '5JidFW79ttL9YP3W2Joc5Zer49opYU3fKNeBx9B6cpEH1GiDm5p' },
                // user: { name: 'alice', postingWif: '5JGoCjh27sfuCzp7kQme5yMipaQtgdVLPiZPr9zaCwJVrSrbGYx' },
                // user: { name: 'bob', postingWif: '5JgsnUtjj3gpgpFMMpbXFJFVfLAsiq1tJQ7ZdBBuyaU1RFVevU2' },
                groups: [],
                proposals: [],
                researches: [],
                activeGroup: undefined,
                activeProposal: undefined,
                activeResearch: undefined,
                activeResearchContent: undefined,
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
                },
                votingWeight: 1,
                votingDiscipline: 1
            };
        },
        methods: {
            loadResearchGroups() {
                // there is no method which will be able to load normal group collection
                deipRpc.api.getResearchGroupTokensByAccountAsync(this.user.name)
                    .then((data) => {
                        this.groups = data;
                        this.proposals = [];
                    });
            },
            loadGroupProposals(groupId) {
                this.activeProposal = undefined;
                deipRpc.api.getProposalsByResearchGroupIdAsync(groupId).then((data) => {
                    this.proposals = data;
                });
            },
            clickGroup(group) {
                this.activeGroup = group;
                this.activeResearch = undefined;
                this.activeResearchContent = undefined;
                this.loadGroupProposals(group.id);
                this.loadGroupResearches(group.id);
            },
            clickResearch(research){
                this.activeResearch = research;
                this.activeResearchContent = undefined;
                this.loadResearchContent(research.id);
            },
            clickResearchContent(content){
                this.activeResearchContent = content;
            },
            addResearchGroup() {
                deipRpc.broadcast.createResearchGroupAsync(
                    this.user.postingWif,
                    this.user.name,
                    this.newResearchGroup.permlink,
                    this.newResearchGroup.description,
                    parseInt(this.newResearchGroup.quorumPercent),
                    parseInt(this.newResearchGroup.tokensAmount)
                ).then(() => {
                    this.newResearchGroup = {};
                    this.loadResearchGroups();
                });
            },
            addProposal() {
                // 1 - `{"research_group_id": 1,"name": "quantum break", "abstract":"research for quantum break", "permlink":"quantumbreak108", "review_share_in_percent": 10, "dropout_compensation_in_percent": 5, "disciplines": [2]}` 
                // 8 - `{"quorum_percent": 80,"research_group_id": ${res.id}}`, 
                // 4 - `{"research_group_id": ${res.id},"account_name": "bob","funds": 20}`,
                // 2 - `{"name": "alice","research_group_id": ${res.id},"research_group_token_amount": 50}`
                // 12 - `{"research_id": 1,"type": 2,"content": "My milestone for quantum break", "authors": ["initdelegate"], "research_references": [], "research_external_references": []}`

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

            loadGroupResearches(groupId) {
                deipRpc.api.getResearchesByResearchGroupIdAsync(groupId)
                    .then((data) => {
                        for (var i = 0; i < data.length; i++) {
                            var research = data[i];
                            research.content = [];
                        }
                        this.researches = data;
                    })
            },
            loadResearchContent(researchId){
                deipRpc.api.getAllResearchContentAsync(researchId)
                    .then((data) => {
                        var research = this.researches.find(function(research) {
                            return research.id == researchId;
                        });
                        research.content = data;
                    })
            },
            voteProposal(proposal, $event) {
                $event.stopPropagation();
                deipRpc.broadcast.voteProposalAsync(
                    this.user.postingWif,
                    this.user.name,
                    proposal.id,
                    this.activeGroup.id
                ).then(() => {
                    this.clickGroup(this.activeGroup);
                });
            },
            voteResearchContent(content, $event) {
                $event.stopPropagation();
                if(this.votingDiscipline && this.votingWeight){
                    deipRpc.broadcast.voteAsync(
                        this.user.postingWif,
                        this.user.name,
                        parseInt(this.votingDiscipline),
                        parseInt(this.votingWeight),
                        this.activeResearch.id,
                        content.id
                    ).then(() => {
                        console.log("voted!");
                    });
                }
            }
        },
        computed: {
            isAddingGroupDisabled() {
                return !this.newResearchGroup.description || !this.newResearchGroup.permlink
                    || !parseInt(this.newResearchGroup.quorumPercent) > 0 
                    || !parseInt(this.newResearchGroup.tokensAmount) > 0
            },
            isAddingProposalDisabled() {
                return !this.newProposal.data || !parseInt(this.newProposal.actionId) > 0;
            }
        },
        created() {
            // deipRpc.api.setOptions({ url: 'ws://146.185.140.12:11011/' });
            deipRpc.api.setOptions({ url: 'ws://127.0.0.1:11011/' });
            deipRpc.config.set('chain_id', 'b387f20ec96eeb24646462128b076ff210b8d15a7e763b47741912bb7c431cf9');
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
    .text-center {
        text-align: center;
    }
    .pull-left {
        float: right;
    }
</style>
