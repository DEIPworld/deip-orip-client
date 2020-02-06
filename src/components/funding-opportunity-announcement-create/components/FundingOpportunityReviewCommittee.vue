<template>
	<div class="legacy-column full-height">
		<div class="c-mb-4 legacy-col-grow legacy-column">
			<div class="step-title">Select Review Committee</div>
			<div class="legacy-col-grow overflow-y-auto">
				<div class="c-mh-auto review-comitee-max-width">
					<v-card class="c-ph-12 c-pv-6">
						<div class="legacy-row-nowrap legacy-align-items-center">
								<div class="legacy-col-12">
									<v-autocomplete
										:items="allGroupList"
										:filter="committeesFilter"
										v-model="opportunity.reveiwCommittee"
										item-text="name"
										label="Reveiw committee"
									></v-autocomplete>
								</div>
						</div>

						<div v-if="opportunity.reveiwCommittee">
							<div class="legacy-row-nowrap legacy-align-items-center c-mt-2" v-for="(member, i) in opportunity.reveiwCommittee.enrichedMembers" :key="`${i}-member`">
								<platform-avatar 
									:user="member"
									:size="40"
									link-to-profile
									link-to-profile-class="px-1"
								></platform-avatar>
							</div>
						</div>
					</v-card>
				</div>
			</div>
		</div>
		<div class="legacy-row legacy-justify-center align-center">
			<v-btn flat small @click.native="prevStep()">
					<v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
			</v-btn>
			<v-btn color="primary" @click.native="nextStep()" :disabled="isNextDisabled()">Next</v-btn>
		</div>
	</div>
</template>

<script>
    import deipRpc from '@deip/deip-oa-rpc-client';
    import { getEnrichedProfiles } from './../../../utils/user';
    import { mapGetters } from 'vuex';

    export default {
        name: "FundingOpportunityReviewCommittee",
        props: {
					opportunity: { type: Object, required: true }
        },
        data() { 
					return {
						allGroupList: []
					} 
        },
        computed: {
					...mapGetters({
						user: 'auth/user',
						userGroups: 'auth/userGroups'
					})
        },
        methods: {
					nextStep() {
						this.$emit('incStep');
					},
					prevStep() {
						this.$emit('decStep');
					},
					committeesFilter(item, queryText, itemText) {
						if (item && item.is_personal) {
							return false;
						}
						const hasValue = val => val != null ? val : 'review';
						const text = hasValue(item.name);
						const query = hasValue(queryText);

						return text.toString()
								.toLowerCase()
								.indexOf(query.toString().toLowerCase()) > -1;
					},
					isNextDisabled() {
						return this.opportunity.reveiwCommittee == null;
					}
        },
        created() {

					deipRpc.api.getAllResearchGroupsAsync(false)
            .then((groups) => {
              this.allGroupList = groups;
              const membersLists = this.allGroupList.map(group =>
                deipRpc.api.getResearchGroupTokensByResearchGroupAsync(group.id)
                  .then(researchGroupTokens => getEnrichedProfiles(researchGroupTokens.map(t => t.owner)))
              )
							return Promise.all(membersLists);
        		})
						.then((membersLists) => {
							this.allGroupList.forEach((g, i) => {
                g.enrichedMembers = membersLists[i]
							})
						})

        }
    };
</script>

<style lang="less" scoped>
    .review-comitee-max-width {
        max-width: 800px;
    }
</style>
