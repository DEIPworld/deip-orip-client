<template>
    <div>
        <div class="row-nowrap justify-between">
            <div class="subheading bold c-mt-4">Quorum size</div>

            <div class="c-mt-3" v-if="isResearchGroupMember">
                <v-btn slot="activator" @click="isEditMode = !isEditMode" flat small icon color="grey" class="ma-0">
                    <v-icon small>{{ !isEditMode ? 'mode_edit' : 'close' }}</v-icon>
                </v-btn>
            </div>
        </div>

        <div class="c-pt-4 c-pb-4">
            <div v-if="!isResearchGroupMember || !isEditMode">
                <div v-for="(proposalBlock, i) in proposalOrderMap" :class="{ 'c-pt-2': i !== 0 }">
                    <div v-for="proposalData in proposalBlock">
                        <div class="row-nowrap justify-between align-items-center">
                            <div class="half-bold line-height-1">{{ proposalLabels[proposalData.key] }}</div>
                            <div class="width-3 text-align-right">{{ proposalData.value }}%</div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else>
                <div v-for="(proposalBlock, i) in proposalOrderMap" :class="{ 'c-pt-3': i !== 0 }">
                    <div v-for="proposalData in proposalBlock">
                        <div class="row-nowrap align-items-center">
                            <div class="col-grow half-bold line-height-1">{{ proposalLabels[proposalData.key] }}</div>

                            <v-text-field class="percent-input"
                                v-model="proposalData.value"
                                mask="###"
                                suffix="%"
                                hide-details
                            ></v-text-field>
                        </div>
                    </div>
                </div>

                <div class="row c-pt-4 justify-end">
                    <v-btn class="ma-0" flat
                        color="primary"
                        :disabled="isChangeBtnDisabled || isLoading"
                        :loading="isLoading"
                        @click="sendChangeQuorumProposal()"
                    >Change quorum</v-btn>
                </div>

                <div class="c-pt-2 caption line-height-1 text-align-right blue--text text--lighten-3">
                    The proposal will be sent to the other group members and since it’s approved quorum will be changed
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import _ from 'lodash';
    import deipRpc from '@deip/deip-rpc-client';
    import * as proposalService from './../../../services/ProposalService';

    export default {
        name: "QuorumSizeSidebarSection",

        data() {
            return {
                isLoading: false,
                isEditMode: false,
                proposalLabels: _.cloneDeep(proposalService.labels),

                proposalOrderMap: [
                    [
                        { key: proposalService.types.START_RESEARCH, value: undefined }, 
                        { key: proposalService.types.CREATE_RESEARCH_MATERIAL, value: undefined }, 
                        { key: proposalService.types.CHANGE_RESEARCH_REVIEW_SHARE_PERCENT, value: undefined }
                    ], [
                        { key: proposalService.types.INVITE_MEMBER, value: undefined }, 
                        { key: proposalService.types.DROPOUT_MEMBER, value: undefined }
                    ], [
                        { key: proposalService.types.START_RESEARCH_TOKEN_SALE, value: undefined },
                        { key: proposalService.types.OFFER_RESEARCH_TOKENS, value: undefined },
                        { key: proposalService.types.SEND_FUNDS, value: undefined }
                    ], [
                        { key: proposalService.types.CHANGE_QUORUM, value: undefined },
                        { key: proposalService.types.REBALANCE_RESEARCH_GROUP_TOKENS, value: undefined }
                    ]
                ],

                shadowProposalOrderMap: undefined
            };
        },

        computed: {
            ...mapGetters({
                group: 'researchGroup/group',
            }),

            isResearchGroupMember() {
                return this.group != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.group.id) 
                    : false
            },

            isChangeBtnDisabled() {
                return _.isEqual(this.proposalOrderMap, this.shadowProposalOrderMap)
                    || _.some(this.proposalOrderMap, proposalBlock =>
                            _.some(proposalBlock, proposalData => 
                                proposalService.validateQuorumValue(proposalData.value))
                        );
            }
        },

        methods: {
            fillValues() {
                this.proposalOrderMap.forEach(proposalsBlock => {
                    proposalsBlock.forEach(proposalData => {
                        const intValue = this.convertToPercent(this.group.proposal_quorums[proposalData.key - 1][1]);
                        proposalData.value = intValue.toString(); // input works with string values
                    });
                });

                this.shadowProposalOrderMap = _.cloneDeep(this.proposalOrderMap);
            },

            sendChangeQuorumProposal() {
                this.isLoading = true;
                const promises = [];

                this.proposalOrderMap.forEach((proposalBlock, i) => {
                    proposalBlock.forEach((proposalData, j) => {
                        if (proposalData.value !== this.shadowProposalOrderMap[i][j].value) {
                            const promise = proposalService.createChangeQuorumProposal(
                                this.group.id,
                                proposalData.key,
                                // change on deip percents
                                // this.toDeipPercent(proposalData.value)
                                parseInt(proposalData.value)
                            );

                            promises.push(promise);
                        }
                    });
                });

                Promise.all(promises)
                    .then(() => {
                        this.$store.dispatch('layout/setSuccess', {
                            message: "Proposal has been sent successfully!"
                        });

                        this.$store.dispatch('researchGroup/loadResearchGroupProposals', { groupId: this.group.id });

                        this.proposalOrderMap = _.cloneDeep(this.shadowProposalOrderMap);
                        this.isEditMode = false;
                    })
                    .catch(err => {
                        console.log(err);

                        this.$store.dispatch('layout/setError', {
                            message: "An error occurred during proposal sending"
                        });
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            }
        },

        created() {
            this.fillValues();
        }
    };
</script>

<style lang="less">
    .percent-input.input-group {
        max-width: 45px;
        padding-top: 0px;
    }
</style>
