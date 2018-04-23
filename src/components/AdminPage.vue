<template>
    <div style="padding: 20px">

        <div class="row at-row flex-top flex-end">
            <div class="col-md-24">
                <div class="users-panel">
                    <at-button type="primary" hollow v-on:click="switchUser(users[0])" v-bind:disabled="user.name == 'initdelegate'">initdelegate</at-button>
                    <at-button type="primary" hollow v-on:click="switchUser(users[1])" v-bind:disabled="user.name == 'alice'">alice</at-button>
                    <at-button type="primary" hollow v-on:click="switchUser(users[2])" v-bind:disabled="user.name === 'bob'">bob</at-button>
                </div>
            </div>
        </div>

        <div class="row at-row flex-center flex-top">
            <div class="col-md-8">
                <p>Research Groups</p>
                <div>
                    <at-input type="text" v-model="newResearchGroup.name" placeholder="Name"></at-input>
                    <!-- <at-input type="text" v-model="newResearchGroup.permlink" placeholder="Permlink"></at-input> -->
                    <at-textarea type="text" v-model="newResearchGroup.description" placeholder="Description"></at-textarea>
                    <div class="row at-row flex-center">
                        <at-input type="number" v-model="newResearchGroup.quorumPercent" placeholder="Quorum percent"></at-input>
                        <at-input type="number" v-model="newResearchGroup.tokensAmount" placeholder="Tokens amount"></at-input>
                    </div>
                    <at-button type="primary" v-on:click="createResearchGroup()" v-bind:disabled="isAddingGroupDisabled">Create Group</at-button>
                </div>
                <div class="items-list">
                    <div v-for="group in groups" class="p-1 text-secondary"
                        v-bind:class="{ 'active-item': activeGroup === group }"
                        v-on:click="clickGroup(group)">
                            <div class="row flex-middle"> 
                                <span class="col-md-24 flex-start">
                                    <span> <b>ID:</b> {{ group.research_group_id }}, amount({{ group.amount }})</span>
                                </span>
                            </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div v-if="activeGroup">
                    <p class="bg-dark text-white">Proposals for <b>"{{activeGroup.research_group_id}}"</b> Group</p>
                    <div>
                        <at-select v-model="newProposal.actionId" size="large">
                            <at-option v-bind:value="key" v-for="(value, key) in proposalsMap">{{ key }} - {{ value }}</at-option>
                        </at-select>
                        <at-textarea type="text" v-model="newProposal.data" placeholder="JSON" min-rows="4"></at-textarea>
                        <at-button type="primary" v-on:click="createProposal()" v-bind:disabled="isAddingProposalDisabled">Create Proposal</at-button>
                    </div>

                    <div class="items-list">
                        <div v-for="proposal in proposals"
                            v-bind:class="{ 'active-item': activeProposal === proposal }"
                            v-on:click="activeProposal = proposal">
                                <div class="row flex-middle"> 
                                    <span class="col-md-12 flex-center">
                                        <span><b>ID:</b> {{ proposal.id }}, action - {{ proposal.action }}</span>
                                    </span>
                                    <span class="col-md-12 flex-end">
                                        <at-button @click="voteProposal(proposal, $event)">Vote</at-button>
                                    </span>
                                </div>
                        </div>
                    </div>

                    <div v-if="proposals.length == 0">
                        <div class="row flex-bottom flex-center">
                            <div class="col-md-24 flex-bottom">
                                <p>There are no proposals for <b>"{{activeGroup.research_group_id}}"</b> group</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div v-if="activeProposal">
                    <p>Proposal <b>"{{activeProposal.id}}"</b> Details</p>
                    <at-card class="propoal-details">
                        <h3 slot="title">{{proposalsMap[activeProposal.action]}}</h3>
                        <div>
                            <div>Creator: <b>{{ activeProposal.creator }}</b></div>
                            <div>Current votes amount: <b>{{ activeProposal.current_votes_amount }}</b></div>
                            <div>Quorum percent: <b>{{ activeProposal.quorum_percent }}</b></div>
                            <div>Voted accounts: <b>{{ activeProposal.voted_accounts }}</b></div>
                            <hr/>
                            <div class="proposal-json">{{ activeProposal.data }}</div>
                        </div>
                    </at-card>
                </div>
            </div>
        </div>

        <div class="row at-row flex-center flex-top">
            <div class="col-md-10">
                <div v-if="researches.length">
                    <p>Group <b>"{{activeGroup.research_group_id}}"</b> Researches</p>
                        <div class="items-list">
                            <div v-for="research in researches"  
                                v-bind:class="{ 'active-item': activeResearch === research }"
                                v-on:click="clickResearch(research)">

                                <div class="row flex-middle">
                                    <span class="col-md-24 flex-start">
                                        <span><b>ID: </b>{{ research.id }}</span>
                                    </span>
                                    <span class="col-md-24 flex-start">
                                        <span><b>Title: </b>{{ research.title }}</span>
                                    </span>
                                    <span class="col-md-24 flex-start">
                                        <span><b>Abstract: </b>{{ research.abstract }}</span>
                                    </span>
                                </div>

                            </div>
                        </div>
                </div>
            </div>
            <div class="col-md-14">
                <div v-if="activeResearch && activeResearch.content.length != 0">
                    <p>Content for <b>"{{activeResearch.id}}"</b> Research</p>
                        <div class="items-list">
                            <div v-for="(content, index) in activeResearch.content" v-on:click="clickResearchContent(content)">

                                <div class="row flex-middle" v-bind:class="{ 'active-item': activeResearchContent === content }"> 
                                    <div class="col-md-10 flex-start">
                                        <div># {{ index + 1}}</div>
                                        <div><b>Type: </b>{{ content.content_type }}</div>
                                        <div><b>Title: </b>{{ content.title }}</div>
                                        <div><b>Content: </b>{{ content.content }}</div>
                                        <div><b>Authors: </b>{{ content.authors.join(", ") }}</div>
                                        <div><b>References: </b>{{ content.references.join(", ") }}</div>
                                        <div><b>External References: </b>{{ content.external_references.join(", ") }}</div>
                                    </div>
                                    <div class="col-md-4 flex-center">
                                        <span v-if="activeResearchContent === content" >
                                            <at-input type="number" v-model="newVote.votingDiscipline" placeholder="Discipline"></at-input>
                                        </span>
                                    </div>
                                    <div class="col-md-4 flex-center">
                                        <span v-if="activeResearchContent === content" >
                                            <at-input type="number" v-model="newVote.votingWeight" placeholder="Weight"></at-input>
                                        </span>
                                    </div>
                                    <div class="col-md-6 flex-center">
                                        <span v-if="activeResearchContent === content">
                                            <at-button type="button" @click="voteResearchContent(content, $event)">Vote</at-button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
                <div v-if="activeResearch && activeResearch.content.length == 0">
                    <div class="row flex-bottom flex-center">
                        <div class="col-md-24 flex-bottom">
                            <p class="empty-content-list">There is no content for <b>"{{activeResearch.id}}"</b> research</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row at-row flex-middle flex-center">
            <div class="col-md-3"></div>
            <div class="col-md-18">
                <div v-if="invites && invites.length" class="invites-list">
                    <p>Invites for <b>"{{user.name}}"</b></p>
                    <div class="row flex-middle" v-for="invite in invites"> 
                        <span class="col-md-10 flex-start">
                            <span>Group ID: <b>"{{invite.research_group_id}}"</b>, RG tokens: <b>"{{invite.research_group_token_amount}}"</b></span>
                        </span>
                        <span class="col-md-4 flex-center">
                            <at-input type="number" v-model="invite.rt_conversion_percent" placeholder="RT conversion percent"></at-input>
                        </span> 
                        <span class="col-md-10 flex-middle flex-end">
                            <at-button type="success" hollow v-on:click="approveInvite(invite)">Approve</at-button>
                            <at-button type="error" hollow v-on:click="rejectInvite(invite)">Reject</at-button> 
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-md-3"></div>
        </div>
    </div>
</template>

<script>
    import '../../deip-rpc/dist/deip.min';
    
    export default {
        name: "AdminPage",
        data() {
            var users = [
                    { name: 'initdelegate', postingWif: '5JidFW79ttL9YP3W2Joc5Zer49opYU3fKNeBx9B6cpEH1GiDm5p' },
                    { name: 'alice', postingWif: '5JGoCjh27sfuCzp7kQme5yMipaQtgdVLPiZPr9zaCwJVrSrbGYx' },
                    { name: 'bob', postingWif: '5JgsnUtjj3gpgpFMMpbXFJFVfLAsiq1tJQ7ZdBBuyaU1RFVevU2' }
                ];
            return {
                user: users[0],
                users: users,
                groups: [],
                newResearchGroup: {
                    name: "",
                    permlink: "",
                    description: "",
                    quorumPercent: null,
                    tokensAmount: null
                },
                proposals: [],
                newProposal: {
                    actionId: 0,
                    data: ""
                },
                researches: [],
                activeGroup: undefined,
                activeProposal: undefined,
                activeResearch: undefined,
                activeResearchContent: undefined,
                proposalsMap: {
                    1: "Start research",
                    2: "Invite member",
                    3: "Dropout member",
                    4: "Send funds",
                    5: "Start research token sale",
                    6: "Rebalance research group tokens",
                    7: "Change quorum",
                    8: "Change research review share percent",
                    // 9: "Offer research tokens",
                    // 10: "Accept research tokens offer",
                    11: "Create research material"
                },
                newVote: {
                    votingDiscipline: null,
                    votingWeight: null
                },
                inviteId: null,
                invites: []
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
                this.loadGroupProposals(group.research_group_id);
                this.loadGroupResearches(group.research_group_id);
            },
            clickResearch(research){
                this.activeResearch = research;
                this.activeResearchContent = undefined;
                this.loadResearchContent(research.id);
            },
            clickResearchContent(content){
                this.activeResearchContent = content;
            },
            createResearchGroup() {
                var permlink = this.newResearchGroup.name.replace(/\s+/g, '-').toLowerCase();
                deipRpc.broadcast.createResearchGroupAsync(
                    this.user.postingWif,
                    this.user.name,
                    this.newResearchGroup.name,
                    permlink,
                    this.newResearchGroup.description,
                    parseInt(this.newResearchGroup.quorumPercent),
                    parseInt(this.newResearchGroup.tokensAmount)
                ).then(() => {
                    this.newResearchGroup = {};
                    this.loadResearchGroups();
                }, (err) => {
                    alert(err.message);
                });
            },
            createProposal() {
                // 1 - `{"research_group_id": 0, "title": "quantum break", "abstract":"research for quantum break", "permlink":"quantumbreak108", "review_share_in_percent": 10, "dropout_compensation_in_percent": 5, "disciplines": [2]}`
                // 2 - `{"research_group_id": 0, "name": "alice", "research_group_token_amount": 50}`
                // 3 - `{"research_group_id": 0, "name": "alice"}`
                // 4 - `{"research_group_id": 0, "recipient": "alice", "funds": 1000}`
                // 5 - `{"research_id": 0, "start_time": "2018-04-03T15:15:04" , "end_time": "2018-04-03T16:22:43", "amount_for_sale": 5000, "soft_cap": 1000, "hard_cap": 1500}`
                // 6 - `{"research_group_id": 0, "accounts": [{"account_name": "initdelegate", "amount": 50},{"account_name": "alice", "amount": 60} ]}`
                // 7 - `{"research_group_id": 0, "quorum_percent": 80}`
                // 8 - `{"research_id": 0, "review_share_in_percent": 49}`
                // 9 - "Offer research tokens",
                // 10: "Accept research tokens offer",
                // 11 - `{"research_id": 0, "type": 2, "title": "My title for the milestone", "content": "My milestone for quantum break", "authors": ["initdelegate"], "references": [], "external_references": []}`

                deipRpc.broadcast.createProposalAsync(
					this.user.postingWif,
					this.user.name, 
					this.activeGroup.research_group_id, 
					this.newProposal.data,
                    parseInt(this.newProposal.actionId),
					new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
				).then(() => {
                    this.newProposal = {};
                    this.loadGroupProposals(this.activeGroup.research_group_id);
                }, (err) => {
                    alert(err.message);
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
                    this.activeGroup.research_group_id
                ).then(() => {
                    this.clickGroup(this.activeGroup);
                    alert(this.user.name + " has successfully voted for proposal " + proposal.id + " !");
                }, (err) => {
                    alert(err.message);
                });
            },
            voteResearchContent(content, $event) {
                $event.stopPropagation();
                if(this.newVote.votingDiscipline && this.newVote.votingWeight){
                    deipRpc.broadcast.voteAsync(
                        this.user.postingWif,
                        this.user.name,
                        parseInt(this.newVote.votingDiscipline),
                        parseInt(this.newVote.votingWeight),
                        this.activeResearch.id,
                        content.id
                    ).then(() => {
                        alert(this.user.name + " has successfully voted for content " + content.id + " !");
                    }, (err) => {
                        alert(err.message);
                    });
                }
            },
            loadUserInvites() {
                deipRpc.api.getResearchGroupInvitesByAccountNameAsync(this.user.name)
                    .then((data) => {
                        this.invites = data;
                    })
            },
            approveInvite(invite) {
                var rt_conversion_percent = invite.rt_conversion_percent ? parseInt(invite.rt_conversion_percent) : 0;
                deipRpc.broadcast.approveResearchGroupInviteAsync(
                    this.user.postingWif,
                    invite.id,
                    this.user.name,
                    parseInt(rt_conversion_percent)
                ).then(() => {
                   this.switchUser(this.user); // reload context
                });
            },
            rejectInvite(invite){
                var rt_conversion_percent = invite.rt_conversion_percent ? parseInt(invite.rt_conversion_percent) : 0;
                deipRpc.broadcast.rejectResearchGroupInviteAsync(
                    this.user.postingWif,
                    invite.id,
                    this.user.name,
                    parseInt(rt_conversion_percent)
                ).then(() => {
                   this.switchUser(this.user); // reload context
                });
            },
            switchUser(user) {
                this.user = user;
                this.clear();
                this.loadResearchGroups();
                this.loadUserInvites();
            },
            clear() {
                this.groups = [];
                this.newResearchGroup = {};
                this.proposals = [];
                this.newProposal = {};
                this.researches = [];
                this.activeGroup = undefined;
                this.activeProposal = undefined;
                this.activeResearch = undefined;
                this.activeResearchContent = undefined;
                this.newVote = {
                    votingDiscipline: null,
                    votingWeight: null
                };
                this.invites = [];
            }
        },
        computed: {
            isAddingGroupDisabled() {
                return !this.newResearchGroup.description || !this.newResearchGroup.name
                    || !parseInt(this.newResearchGroup.quorumPercent) > 0 
                    || !parseInt(this.newResearchGroup.tokensAmount) > 0
            },
            isAddingProposalDisabled() {
                return !this.newProposal.data || !parseInt(this.newProposal.actionId) > 0;
            }
        },
        created() {
            deipRpc.api.setOptions({ url: 'ws://206.189.175.10:11011/' });
            deipRpc.config.set('chain_id', '27c7139e3d2b2867f94cd4b53a4894900683aa7581445f3b16ab285dae64bb85');
            this.loadResearchGroups();
            this.loadUserInvites();
        },
        components: {
            "at-input": Input,
            "at-button": Button,
            "at-textarea": Textarea,
            "at-select": Select,
            "at-option": Option,
            "at-option-group": OptionGroup,
            "at-card": Card
        }
    };

    import { Button, ButtonGroup, Tag, Radio, RadioGroup, RadioButton, Checkbox, CheckboxGroup, Input, InputNumber, Textarea,
            Badge, Switch, Slider, Tooltip, Popover, Alert, Progress, LoadingBar, Modal, Select, Option, OptionGroup, Dropdown, 
            DropdownMenu, DropdownItem, Breadcrumb, BreadcrumbItem, Pagination, Menu, MenuItem, MenuItemGroup, Submenu, Table, Card, 
            Collapse, CollapseItem, Steps, Step, Rate, Tabs, TabPane, Timeline, TimelineItem } from 'at-ui';

</script>


<style>
    @import 'at-ui-style';
    
    .at-input  {
        padding: 5px
    }

    .at-textarea {
        padding: 5px
    }

    .at-select {
        padding: 5px
    }

    .propoal-details {
        margin-top: 5px
    }

    .proposal-json {
        background: #fdfded
    }

    .items-list {
        padding-top: 15px;
        padding-bottom: 15px;
    }

    .items-list > div {
        text-align: left;
        padding: 5px;
    }

    .items-list > div:hover {
        text-align: left;
        padding: 5px;
        background: #dddddd;
        cursor: pointer;
    }

    .invites-list > div {
        text-align: left;
        padding: 5px;
    }

    .active-item {
        background: #dddddd;
    }

    .users-panel {
        margin-top: 5px;
        margin-bottom: 20px;
    }

    .empty-content-list {
        margin-top: 50px;
    }


</style>