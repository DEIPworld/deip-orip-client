<template>
    <div class="column full-height">
        <div class="c-mb-4 legacy-col-grow column">
            <div class="step-title">Select Program Officers</div>

            <div class="legacy-col-grow overflow-y-auto">

                <div class="c-mh-auto program-officers-max-width">
                    <v-card class="c-ph-12 c-pv-6">
                        <v-text-field
                            label="Start typing for suggestion"
                            append-icon="search"
                        ></v-text-field>

                    <!--    <v-radio-group>
                            <div class="row">
                                <div class="width-8">
                                    <v-radio
                                        label="By name"
                                        value="by-name"
                                    ></v-radio>
                                </div>

                                <div class="width-8">
                                    <v-radio
                                        label="By keywords"
                                        value="by-keywords"
                                    ></v-radio>
                                </div>
                            </div>
                        </v-radio-group> -->

                        <div>
                            <div class="legacy-row-nowrap legacy-align-items-center c-mt-2" v-for="(member, i) in members">
                                <v-avatar size="40px">
                                    <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" />
                                    <v-gravatar v-else :title="member.account.name" :email="member.account.name + '@deip.world'" />
                                </v-avatar>
                                <div class="c-pl-4 legacy-col-grow">
                                    <router-link :to="{ name: 'UserDetails', params: { account_name: member.account.name } }" class="a c-pl-3">
                                        {{member | fullname}}
                                    </router-link>
                                </div>
                                <div>
                                    <input id="checkbox"
                                        type="checkbox"
                                        :checked="isSelected(member)"
                                        v-on:input="setOpportunityOfficer($event, member)"/>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </div>

            </div>
        </div>
        
        <div class="row legacy-justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            
            <v-btn color="primary" @click.native="nextStep()" :disabled="isNextDisabled()">Next</v-btn>
        </div>
    </div>
</template>

<script>
    import deipRpc from '@deip/deip-rpc-client';
    import { getEnrichedProfiles } from './../../../utils/user';
    import { mapGetters } from 'vuex';
    import _ from 'lodash';

    export default {
        name: "FundingOpportunityProgramOfficers",

        props: {
            opportunity: { type: Object, required: true }
        },

        data() { 
            return {
                members: []
            } 
        },
        computed: {
            ...mapGetters({
                user: 'auth/user'
            })
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            },

            isSelected(member) {
                return this.opportunity.officers.some(a => a == member.account.name);
            },
            setOpportunityOfficer($event, member) {
                event.preventDefault();
                event.stopPropagation();
                const checked = event.target.checked;
                this.opportunity.officers = checked
                    ? [...this.opportunity.officers, member.account.name]
                    : this.opportunity.officers.filter(a => a !== member.account.name);
            },
            isNextDisabled() {
                return false;
            }
        },
        created() {
            deipRpc.api.getAllAccountsAsync()
                .then(accounts => getEnrichedProfiles(accounts.map(account => account.name)))
                .then(users => {
                    this.members = _.filter(users, user => {
                        if (_.isEmpty(user.profile)) {
                            return false;
                        }

                        return !!_.find(user.profile.agencies, agency => agency.name === window.env.TENANT && agency.role === 'officer');
                    });
                });
        },
    };
</script>

<style lang="less" scoped>
    .program-officers-max-width {
        max-width: 800px;
    }
</style>
