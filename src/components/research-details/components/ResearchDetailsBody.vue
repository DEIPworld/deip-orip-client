<template>
    <div class="">
        <!-- ### START Research Details Section ### -->
        <div class="c-mt-6">
            <div>
                <div class="row justify-between align-center">
                    <div>
                        <v-icon size="18px">date_range</v-icon>
                        <span>Created on {{ research.created_at | dateFormat('D MMM YYYY', true) }}</span>
                    </div>
                </div>

                <div class="display-1 half-bold c-mt-10">
                    {{ research.title }}
                </div>

                <div class="c-pt-8">
                    {{ research.abstract }}
                </div>
            </div>
        </div>
        <!-- ### END Research Details Section ### -->

        <!-- ### START Research Timeline Section ### -->
        <div class="c-mt-8" v-if="contentList.length">
            <div class="title">Timeline</div>
            <div class="c-pt-6">
                <research-timeline :contentList="contentList" :research="research"></research-timeline>
            </div>
        </div>
        <!-- ### END Research Timeline Section ### -->


        <!-- ### START Grant Applications Section ### -->
        <div class="c-mt-8" v-if="flattenedApplicationsList.length">
            <div class="title">Applications</div>
            <div class="c-pt-6">
                <div v-for="item in flattenedApplicationsList"> 
                    <v-card>
                        <v-card-text>
                            <div class="row-nowrap">
                                <div class="col-8">
                                    <span class="c-pr-3">
                                        <v-avatar size="20px">
                                            <img :src="item.application.foa.agency_name | agencyLogoSrc(160, 160, false)" />
                                        </v-avatar>
                                    </span>
                                    <span class="body-2">
                                        <router-link class="a" 
                                            :to="{ name: 'AgencyProgramDetails', 
                                                params: { 
                                                    agency: item.application.foa.agency_name, 
                                                    foa: item.application.foa.funding_opportunity_number }}">
                                            {{ item.application.foa.funding_opportunity_number }}
                                        </router-link>
                                    </span> 
                                    <span class="c-pl-5">
                                        <router-link v-if="item.isAccessible" class="a" 
                                            :to="{ name: 'ResearchApplicationDetails', 
                                                params: { 
                                                    research_group_permlink: group.permlink, 
                                                    research_permlink: research.permlink,
                                                    application_id: item.application.id }}">
                                            {{ item.application.title}}
                                        </router-link>
                                        <span v-else>{{ item.application.title }}</span>
                                    </span>
                                </div> 
                                <div class="col-1">
                                    <div class="text-align-center">
                                        <span class="green--text text--darken-2" v-if="isApplicationApproved(item.application)">Approved</span>
                                        <span class="red--text text--darken-2" v-if="isApplicationRejected(item.application)">Rejected</span>
                                        <span class="grey--text" v-if="isApplicationPending(item.application)">Pending</span>
                                    </div>
                                </div>
                                <div class="col-2">
                                    <div class="text-align-center">
                                        <span class="caption grey--text">($ {{fromAssetsToFloat(item.application.total_amount)}} requested)</span>
                                    </div>
                                </div>
                                <div class="col-1">
                                    <router-link v-if="item.isAccessible" class="a" 
                                        :to="{ name: 'ResearchApplicationDetails', 
                                            params: { 
                                                research_group_permlink: group.permlink, 
                                                research_permlink: research.permlink,
                                                application_id: item.application.id }}">
                                        {{ item.application.letterHash.slice(0, 8)}}
                                    </router-link>
                                    <span v-else>{{item.application.letterHash.slice(0, 8) }}</span>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </div>
            </div>
        </div>
        <!-- ### END Grant Applications Section ### -->


        <!-- ### START Research Content Section ### -->
        <div class="c-mt-8">
            <div class="title">Research results</div>

            <div v-if="!contentList.length" class="c-pt-8">
                There is no content posted in the research yet. 
                <span v-if="isResearchGroupMember">Please use the form below to upload your pdf files and images or add them manually with the Editor.</span>
            </div>

            <div class="c-mt-6">
                <v-expansion-panel>
                    <v-expansion-panel-content v-for="(content, index) in contentList" :key="index">
                        <div slot="header">
                            <div v-on:click.stop>
                                <span class="bold">{{getContentType(content.content_type).text}}</span>
                                <span class="bold c-pl-4"> 
                                    <router-link class="a" 
                                        :to="{
                                            name: 'ResearchContentDetails',
                                            params: {
                                                research_group_permlink: encodeURIComponent(research.group_permlink), 
                                                research_permlink: encodeURIComponent(research.permlink), 
                                                content_permlink: encodeURIComponent(content.permlink) 
                                            }
                                        }"
                                    >{{content.title}}</router-link>
                                </span>
                                <div class="c-pr-10 right" v-show="contentHasReviews(content)">
                                    <v-icon size="12px">chat_bubble</v-icon>
                                    <span class="bold display-inline-flex">
                                        <span v-show="contentHasPositiveReviews(content)" class="green--text text--darken-2">{{ countContentReviews(content, true) }}</span>
                                        <span v-show="contentHasPositiveReviews(content) && contentHasNegativeReviews(content)">/</span>
                                        <span v-show="contentHasNegativeReviews(content)" class="red--text text--darken-2">{{ countContentReviews(content, false) }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <v-card>
                            <v-card-text class="pt-0">
                                <div class="c-ph-2">
                                    <div class="caption grey--text c-pt-2"> {{contentAuthorsStr(content.authors)}}</div>
                                    <div class="c-pt-2 half-bold"></div>
                                    <div>
                                        <div class="row-nowrap">
                                            <div v-for="(eci, index) in getContentEciList(content)" class="grey--text">
                                                <span>
                                                    <span class="c-pr-1">
                                                        <span>{{ eci.disciplineName}}</span>
                                                    </span>

                                                    <span class="c-pr-4 bold">
                                                        <span>{{ eci.value }}</span>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="row-nowrap c-mt-3">
                                            <!-- <div class="c-pr-10">
                                                <v-icon size="18px">visibility</v-icon> <span>1999</span>
                                            </div> -->
                                            <div class="c-pr-10">
                                                <v-icon size="18px">event</v-icon>
                                                <span>{{ content.created_at | dateFormat('D MMM YYYY', true) }}</span>
                                            </div>

                                        <!-- <div class="c-pr-10">
                                                <v-icon size="18px">chat_bubble</v-icon>
                                                <span class="bold display-inline-flex">
                                                    <span class="green--text text--darken-2">{{ countContentReviews(content, true) }}</span>
                                                    <span>/</span>
                                                    <span class="red--text text--darken-2">{{ countContentReviews(content, false) }}</span>
                                                </span>
                                            </div> -->
                                        </div>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </div>
        </div>
        <!-- ### END Research Content Section ### -->

        <!-- ### START Research Drafts Section ### -->
        <div v-if="isResearchGroupMember && !research.is_finished" class="c-pt-8 title">Work in progress</div>

        <div class="c-mt-6" v-if="isResearchGroupMember && !research.is_finished">
            <v-expansion-panel>
                <v-expansion-panel-content v-for="(draft, index) in contentRefsList.filter(d => !draftIsApproved(d))" :key="index">
                    <div slot="header">
                        <div v-on:click.stop>
                            <span class="bold">Draft {{index + 1}}</span>
                            <span class="bold c-pl-4"> 
                                <a @click="openDarDraft(draft)" class="a">
                                    {{draft.title || draft._id}}
                                </a>
                            </span>
                            <span v-if="draftIsProposed(draft)" class="c-pl-2 italic orange--text">(proposed)</span>
                        </div>
                    </div>
                    <v-card>
                        <v-card-text class="pt-0">
                            <div class="c-ph-2">
                                <div class="row">
                                    <div class="col-8">
                                        <div class="c-pt-2">
                                            <span>
                                                <v-icon size="18px">date_range</v-icon> 
                                                <span>{{draft.updated_at | dateFormat('D MMM YYYY HH:mm', true)}}</span>
                                            </span>
                                            <span class="c-pl-2">
                                                <v-icon size="18px">note_add</v-icon> 
                                                <span>{{draft.type}}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-4 c-pr-8">
                                        <div>
                                            <div class="right">
                                                <v-btn @click="openDarDraft(draft)" outline small depressed color="primary lighten-1">
                                                    View
                                                </v-btn>
                                            </div>
                                            <div v-if="draftIsInProgress(draft)" class="right">
                                                <v-btn
                                                    @click="deleteDraft(draft)" :loading="isDeletingDraft" 
                                                    :disabled="isDeletingDraft" outline small depressed color="red lighten-1">
                                                    Delete
                                                </v-btn>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <!-- ### END Research Drafts Section ### -->
            
            <div v-if="isResearchGroupMember && !research.is_finished">
                <upload-research-content-file-dialog></upload-research-content-file-dialog>
                <v-btn @click="createDarDraft()" :loading="isCreatingDraft" :disabled="isCreatingDraft" block outline color="primary" dark>Use Editor</v-btn>
            </div>
        </div>
        <div v-if="fundingContractsList.length" class="c-mt-8 title">Grants: {{fundingContractsList.length}}</div>

        <div v-if="fundingContractsList.length" class="c-pt-6 c-pb-6">
            <div v-for="(contract, contractIdx) in fundingContractsList">
                <div :key="'contract-' + contractIdx" :class="contractIdx != fundingContractsList.length - 1 ? 'c-pb-3' : ''">
                    <v-divider class="c-mb-3"></v-divider>
                    <div class="row c-pl-10">

                        <div class="col-9">
                            <div class="row">
                                <span class="col-12">
                                    <router-link class="a" style="text-decoration: none"
                                        :to="{  name: 'AgencyProgramDetails', 
                                                params: { 
                                                    agency: decodeURIComponent(contract.foa.agency_name),
                                                    foa: decodeURIComponent(contract.foa.funding_opportunity_number) 
                                                }}">
                                            {{ contract.foa.funding_opportunity_title }}
                                    </router-link>
                                </span>
                            </div>
                            <div class="row c-pt-3">
                                <div class="col-4">
                                    <span class="grey--text c-pr-2">Posted Date:</span>
                                    <span class="bold grey--text">
                                        {{new Date(`${contract.relation.milestones[0].deadline}Z`).toDateString()}}
                                    </span>
                                </div>
                                <div class="col-4">
                                    <span class="grey--text c-pr-2">Closing Date:</span>
                                    <span class="bold grey--text">
                                        {{new Date(`${contract.relation.milestones[contract.relation.milestones.length -1].deadline}Z`).toDateString()}}
                                    </span>
                                </div>
                                <div class="col-4">
                                    <span class="bold grey--text"># {{contract.foa.funding_opportunity_number}}</span>
                                </div>
                            </div>
                        </div>
                            <div class="col-3 text-align-center">
                                <div class="bold grey--text">Available to withdraw</div>
                                <div class="bold">$ {{activeMilestoneData(contract)}}</div>
                                <div class="caption grey--text" v-if="activeMilestoneData(contract)">(Total Funding: ${{getTotalFundingAmount(contract.relation)}})</div>
                            </div>
                        </div>
                    </div>
                    <v-divider class="c-mt-2"></v-divider>
                    <div class="row c-pt-4 c-pb-5">      
                        <div class="col-12 text-align-right">
                            <v-btn flat color="primary" @click="toggleWithdrawal(contract.relation)">
                              Funding History
                            </v-btn>
                            <v-btn v-if="isResearchGroupMember" color="primary" @click="selectContractToWithdraw(contract)">
                                Withdraw Request
                            </v-btn>
                        </div>
                    </div>
                <div>

                <div v-if="contract.relation.isExpanded">
                    <div class="row">
                        <div class="col-10">
                          <GChart
                              type="BarChart"
                              :settings="{ packages: ['corechart', 'bar'] }"
                              :data="fundingMilestonesChartData(contract.relation)"
                              :options="fundingMilestonesChartOptions(contract.relation)"
                          />
                        </div>
                        <div class="col-2"></div>
                      </div>
                      <div v-for="(expense, expenseIdx) in contract.relation.researchExpenses" :key="'funding-' + contractIdx + '-exp-' + expenseIdx">
                          <div class="row c-pl-4">
                              <div class="col-2">
                                  <div class="body-2 c-pt-4">{{expense.title}}</div>
                              </div>
                              <div class="col-4">
                                  <GChart
                                    type="BarChart"
                                    :settings="{ packages: ['corechart', 'bar'] }"
                                    :data="fundingExpenseChartData(contract.relation, expense)"
                                    :options="fundingExpenseChartOptions(contract.relation, expense)"
                                      />
                              </div>
                              <div class="col-2">
                                  <div class="c-pt-4 body-2">${{fromAssetsToFloat(expense.amount)}}</div>
                              </div>
                              <div class="col-4"></div>
                          </div>
                      </div>
                      <div class="row c-pl-4 c-pb-2">
                          <div class="col-2">
                              <div class="body-2 c-pt-4">Total spent:</div>
                          </div>
                          <div class="col-2">
                              <div class="subheading bold c-pt-4 c-pl-2">
                                  ${{getTotalCurrentExpensesAmount(contract.relation)}}
                              </div>
                          </div>
                          <div class="col-6"></div>
                      </div>
          
                      <div class="c-pb-10" v-if="getApprovedWithdrawals(contract.relation).length">
                          <div class="c-pt-6 c-pb-8 c-pl-4 bold subheading">Payment History</div>
                          <div class="row c-pl-4 c-pt-2 c-pb-2" v-for="(withdrawal, withdrawalsIdx) in getApprovedWithdrawals(contract.relation)" :key="'funding-' + contractIdx + '-'+ withdrawalsIdx">
                              <div class="col-6">{{withdrawal.description}}</div>
                              <div class="col-2 body-2">{{withdrawal.purpose == 1 ? 'Salary' : withdrawal.purpose == 2 ? 'Equipment' : 'Business Travel'}}</div>
                              <div class="col-2 grey--text bold">{{new Date().toDateString()}}</div>
                              <div class="col-2 bold text-align-right c-pr-4">$ {{fromAssetsToFloat(withdrawal.amount)}}</div>
                          </div>
                      </div>
                  </div>
                  <v-divider class="c-mb-3"></v-divider>
                </div>
              </div>
            </div>
            <confirm-action-dialog 
                v-if="isResearchGroupMember && selectedContractToWithdrawMeta.contract"
                :meta="universityAgreement" 
                :title="``" 
                :text="`The University charges grantees for providing them with research facilities: laboratories, equipment, data processing services, administrative personnel and others. You will be charged ${this.convertToPercent(selectedContractToWithdrawMeta.contract.relation.university_overhead)} % over-head fee.`" 
                @confirmed="openContractWithdrawDialog(); universityAgreement.isShown = false"  
                @canceled="universityAgreement.isShown = false">
            </confirm-action-dialog>
            <withdraw-funding-request-dialog 
                v-if="selectedContractToWithdrawMeta.contract" 
                :meta="selectedContractToWithdrawMeta">
            </withdraw-funding-request-dialog>
        </div>

        <!-- <div class="c-pt-4 title">Grants: 4</div>

        <div class="c-pt-6">
            <v-card>
                <div class="info-card-list">
                    <div class="list-line">
                        <div class="list-header-cell col-3">Organization</div>
                        <div class="list-header-cell col-5">Project</div>
                        <div class="list-header-cell col-2 text-align-center">Date</div>
                        <div class="list-header-cell col-2 text-align-right">Amount</div>
                    </div>
                    <div class="list-line" v-for="i in 5" :key="i">
                        <div class="col-3 list-body-cell a">JJHK</div>
                        <div class="col-5 list-body-cell">General Support</div>
                        <div class="col-2 list-body-cell text-align-center">20 Jan 2018</div>
                        <div class="col-2 list-body-cell text-align-right">$50 000</div>
                    </div>
                </div>
            </v-card>
        </div>-->

    <!--    <div class="c-pt-8 title">References: 2</div>

        <div class="c-pt-6">
            <div>
                1. Crawford, Lynn. (2007). Global body of project management knowledge and standards. 
                In Jeffrey K. Pinto & Peter W.G. Morris (Eds.): The Wiley Guide to Managing Projects (1st ed., pp. 206-252). 
                Hoboken, N.J.: Wiley & Sons, Inc.
            </div>
            <div class="c-pt-2">
                2. Kwak, Young Hoon, and Frank T. Anbari. (2009). Analysing project management research: Perspectives 
                from top management journals. International Journal of Project Management, 27(5), 435-446.
            </div>
        </div>  -->
    </div>
</template>

<script>

    import { mapGetters } from 'vuex'
    import contentHttpService from './../../../services/http/content'
    import { getContentType } from './../../../services/ResearchService'
    import { WITHDRAWAL_APPROVED } from './../../../services/FundingService'

    export default {
        name: "ResearchDetailsBody",
        data() {
            return {
                isCreatingDraft: false,
                isDeletingDraft: false,
                isExpanded: false,

                selectedContractToWithdrawMeta: { isOpen: false, contract: null },
                universityAgreement: { isShown: false, item: null, index: null }
            }
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userExperise: 'auth/userExperise',
                research: 'rd/research',
                group: 'rd/group',
                contentList: 'rd/contentList',
                applicationsList: 'rd/applicationsList',
                contentRefsList: 'rd/contentRefsList',
                applicationsRefsList: 'rd/applicationsRefsList',
                disciplinesList: 'rd/disciplinesList',
                totalVotesList: 'rd/totalVotesList',
                contentWeightByDiscipline: 'rd/contentWeightByDiscipline',
                membersList: 'rd/membersList',
                fundingContractsList: 'rd/fundingContractsList'
            }),
            isResearchGroupMember() {
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
            },
            flattenedApplicationsList() {
                const tenant = window.env.TENANT.toLowerCase();
                const flattened = [];
                for (let i = 0; i < this.applicationsList.length; i++) {
                    const application = this.applicationsList[i];
                    flattened.push({ 
                        isAccessible: tenant == application.foa.agency_name.toLowerCase(), 
                        application: application 
                    });
                }
                return flattened;
            },

            // flattenedApplicationsList() {
            //     const tenant = window.env.TENANT.toLowerCase();
            //     const flattened = [];
            //     for (let i = 0; i < this.applicationsList.length; i++) {
            //         const application = this.applicationsList[i];
            //         if (!flattened.some(item => application.application_hash == item.application.application_hash && 
            //                 application.foa.agency_name.toLowerCase() == item.application.foa.agency_name.toLowerCase())) {

            //             flattened.push({ 
            //                 isAccessible: tenant == application.foa.agency_name.toLowerCase(), 
            //                 application: application 
            //             });
            //         }
            //     }
            //     return flattened;
            // }
        },
        methods: {
            countContentReviews(content, isPositive) {
                return content.reviews.reduce(
                    (acc, review) => review.is_positive && isPositive || !review.is_positive && !isPositive ? acc + 1 : acc,
                    0
                );
            },
            contentHasReviews(content) {
                return content.reviews.length;
            },
            contentHasPositiveReviews(content) {
                return content.reviews.some(r => r.is_positive);
            },
            contentHasNegativeReviews(content) {
                return content.reviews.some(r => !r.is_positive);
            },
            isApplicationApproved(application) {
                return application.status === 'application_approved';
            },
            isApplicationRejected(application) {
                return application.status === 'application_rejected';
            },
            isApplicationPending(application) {
                return application.status === 'application_pending';
            },
            getContentEciList(content) {
                return this.disciplinesList.map(discipline => {
                    const eciObj = content.eci_per_discipline.find(item => item[0] === discipline.id);

                    return {
                        disciplineName: discipline.name,
                        value: eciObj ? eciObj[1] : 0
                    }
                });
            },
            openDarDraft(draft) {
                if (draft.type === 'dar' && draft.status === 'in-progress') {
                    // we have to do it this way as Texture InMemory buffer is getting flushed after the first saving
                    // and doesn't persist new changes for several instances during the current session
                    window.location.replace(`${window.location.href}/!draft?ref=${draft._id}`);
                    location.reload()
                } else {
                    const params = {
                        group_permlink: this.$route.params.research_group_permlink,
                        research_permlink: this.$route.params.research_permlink,
                        content_permlink: `!draft`
                    };
                    const query = { 'ref': draft._id };
                    this.$router.push({ name: 'ResearchContentDetails', params, query });
                }
            },
            createDarDraft() {
                this.isCreatingDraft = true;
                contentHttpService.createDarContent(this.research.id)
                    .then((res) => {
                        // we have to load page this way as Texture InMemoryBuffer is getting flushed after the first saving
                        // and doesn't persist new changes for several instances during the current session
                        window.location.replace(`${window.location.href}/!draft?ref=${res.draft._id}`);
                        location.reload()
                    }, (err) => {console.log(err)})
                    .finally(()=> {
                        this.isCreatingDraft = false;
                    })
            },
            deleteDraft(draft) {
                this.isDeletingDraft = true;
                contentHttpService.deleteContentDraft(draft._id)
                    .then(() => {
                        this.$store.dispatch('rd/loadResearchContentRefs', { researchId: draft.researchId });
                    })
                    .finally(() => {
                        this.isDeletingDraft = false;
                    })
            },
            draftIsApproved(draft) {
                return this.contentList.some(c => c.content == `${draft.type}:${draft.hash}`);
            },
            draftIsProposed(draft) {
                return draft.status === 'proposed'
            },
            draftIsInProgress(draft) {
                return draft.status === 'in-progress'
            },
            contentAuthorsStr(authors) {
                return this.membersList
                    .filter(m => authors.some(a => a == m.account.name))
                    .map(m => this.$options.filters.fullname(m))
                    .join("  ·  ");
            },

            selectContractToWithdraw(contract) {
                this.selectedContractToWithdrawMeta.contract = contract;
                if (contract.relation.withdrawals.length) {
                    this.openContractWithdrawDialog();
                } else {
                    this.openConfirmContractWithdrawDialog();
                }
            },

            openContractWithdrawDialog() {
                this.selectedContractToWithdrawMeta.isOpen = true;
            },
            
            openConfirmContractWithdrawDialog() {
                this.universityAgreement.isShown = true;
            },

            getTotalFundingAmount(funding) {
                return funding.research_expenses.reduce((acc, exp) => {
                    let amount = this.fromAssetsToFloat(exp[1]);
                    return acc += amount;
                }, 0);
            },

            getTotalCurrentExpensesAmount(funding) {
                return funding.current_expenses.reduce((acc, exp) => {
                    let amount = this.fromAssetsToFloat(exp[1]);
                    return acc += amount;
                }, 0);
            },

            getApprovedWithdrawals(relation) {
                return relation.withdrawals.filter(r => r.status == WITHDRAWAL_APPROVED);
            },

            getOrderedMilestones(milestones) {
              let orderedMilestones = [];
              for (let i = 0; i < milestones.length; i++){
                let milestone = milestones[i];
                if (milestone.status == 2) {
                  orderedMilestones.push(milestone)
                }
              }
              for (let i = 0; i < milestones.length; i++){
                let milestone = milestones[i];
                if (milestone.status == 1) {
                  orderedMilestones.push(milestone)
                }
              }
              for (let i = 0; i < milestones.length; i++){
                let milestone = milestones[i];
                if (milestone.status == 4) {
                  orderedMilestones.push(milestone)
                }
              }
              for (let i = 0; i < milestones.length; i++){
                let milestone = milestones[i];
                if (milestone.status == 3) {
                  orderedMilestones.push(milestone)
                }
              }
              return orderedMilestones;
            },

            fundingMilestonesChartOptions(funding) {
                // TODO: Revise this algo after we implement milestone finalization
                let totalCurrentExpencesAmount = this.getTotalCurrentExpensesAmount(funding);
                let totalExpencesAmount = this.getTotalFundingAmount(funding);
                let spentPercent = parseFloat(((totalCurrentExpencesAmount / totalExpencesAmount) * 100)).toFixed(2);
                spentPercent = parseFloat(spentPercent);
                let amount = [];
                let spentPercentReached = false;
                let orderedMilestones = this.getOrderedMilestones(funding.milestones);

                let accumulated = 0;
                for (let i = 0; i < orderedMilestones.length; i++) {
                let current = orderedMilestones[i];
                let milestonePercent = this.convertToPercent(current.amount);
                if (!spentPercentReached && ((accumulated + milestonePercent) >= spentPercent)) {

                  if (milestonePercent != spentPercent) {
                    amount.push(milestonePercent - (milestonePercent - spentPercent));
                    amount.push(milestonePercent - spentPercent)
                  } else {
                    amount.push(milestonePercent);
                  }
                  spentPercentReached = true;

                  } else {
                    if ((accumulated + milestonePercent) > spentPercent) {
                      amount.push((milestonePercent > spentPercent) ? milestonePercent : ((accumulated + milestonePercent) - spentPercent));
                    } else if (!spentPercentReached) {
                      amount.push(spentPercent);
                      spentPercentReached = true;
                    }
                  }

                  accumulated += milestonePercent;
                }

                let colors = amount.map((a, i) => i == 0 ? '#8dc2f9' : '#e0e0e0');

                return {
                    isStacked: 'percent',
                    height: 50,
                    legend: { position: 'top', maxLines: 1, textStyle: {fontSize: 12, bold: true} },
                    chartArea: { width: '95%', height:'100%' , top: 20, /* left: 0 */},
                    hAxis: {                    
                        minValue: 0,
                        ticks: [0],
                        textPosition: 'none',
                        baselineColor: '#FFFFFF'
                    },
                    colors: [...colors]
                }
              },

          fundingMilestonesChartData(funding) {
              // TODO: Revise this algo after we implement milestone finalization
              let totalCurrentExpencesAmount = this.getTotalCurrentExpensesAmount(funding);
              let totalExpencesAmount = this.getTotalFundingAmount(funding);
              let spentPercent = parseFloat(((totalCurrentExpencesAmount / totalExpencesAmount) * 100)).toFixed(2);
              spentPercent = parseFloat(spentPercent);

              let names = [];
              let amount = [];
              let spentPercentReached = false;
              let orderedMilestones = this.getOrderedMilestones(funding.milestones);
        
              let accumulated = 0;
              for (let i = 0; i < orderedMilestones.length; i++) {
                let current = orderedMilestones[i];
                let milestonePercent = this.convertToPercent(current.amount);

                if (!spentPercentReached && ((accumulated + milestonePercent) >= spentPercent)) {
      
                  if (milestonePercent != spentPercent) {
                    names.push(`Spent - ${spentPercent}%`);
                    amount.push(milestonePercent - (milestonePercent - spentPercent));
                    names.push(`Milestone ${i + 1} - ${milestonePercent}%`);
                    amount.push(milestonePercent - spentPercent);
                  } else {
                    names.push(`Milestone ${i + 1} - ${milestonePercent}%`);
                    amount.push(milestonePercent);
                  }
                  spentPercentReached = true;

                } else {
                    if ((accumulated + milestonePercent) > spentPercent) {
                      names.push(`Milestone ${i + 1} - ${milestonePercent}%`);
                      amount.push((milestonePercent > spentPercent) ? milestonePercent : ((accumulated + milestonePercent) - spentPercent));
                    } else if (!spentPercentReached) {
                      names.push(`Spent - ${spentPercent}%`);
                      amount.push(spentPercent);
                      spentPercentReached = true;
                    }
                }

                accumulated += milestonePercent;
              }
              return [
                  ['Milestone', ...names, { role: 'annotation' } ],
                  ['', ...amount, '']
              ];
          },

          fundingExpenseChartOptions(funding, maxExpense) {
            let currentExpense = funding.current_expenses.find(e => e[0] == maxExpense.type);
            let currentExpenseAmount = currentExpense[1] ? this.fromAssetsToFloat(currentExpense[1]) : 0;
            let colors = currentExpenseAmount == 0 ? ['#e0e0e0', '#e0e0e0'] : ['#8dc2f9', '#e0e0e0'];

            return {
              isStacked: 'percent',
              height: 50,
              legend: { position: 'none' },
              chartArea: { width: '95%', height: '50%'},
              hAxis: {                    
                minValue: 0,
                ticks: [0],
                textPosition: 'none',
                baselineColor: '#FFFFFF'
              },
              colors: [...colors]
            }
          },

          fundingExpenseChartData(funding, maxExpense) {
            let currentExpense = funding.current_expenses.find(e => e[0] == maxExpense.type);
            let currentExpenseAmount = currentExpense[1] ? this.fromAssetsToFloat(currentExpense[1]) : 0;
            let maxExpenseAmount = this.fromAssetsToFloat(maxExpense.amount);

            let percent = currentExpenseAmount == 0 ? 0 : (currentExpenseAmount / maxExpenseAmount) * 100;

            let names = percent == 0 ? ['', ''] : [`Spent: $${currentExpenseAmount}`, ''];
            let amount = percent == 0 ? [0, 100] : [percent, 100 - percent];

            return [
              ['Milestone', ...names, { role: 'annotation' } ],
              ['', ...amount, '']
            ];
          },

          toggleWithdrawal(relation) {
              this.$store.dispatch('rd/toggleRelationHistory', { relation_id: relation.id });
          },

          activeMilestoneData(contract) {
            if (!contract || !contract.relation) return null;
            let totalAmount = this.getTotalFundingAmount(contract.relation);
            let currentExpenses = this.getTotalCurrentExpensesAmount(contract.relation);
            let availableToWithdraw = totalAmount - currentExpenses;
            return availableToWithdraw > 0 ? availableToWithdraw : 0;
          },

          getContentType
        }
    };
</script>

<style lang="less">
</style>