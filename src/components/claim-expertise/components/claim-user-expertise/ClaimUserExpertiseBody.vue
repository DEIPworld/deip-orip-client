<template>
    <div class="">
        <div class="row">
            <v-avatar size="160px" class="">
                <img v-if="claimerInfo.profile" v-bind:src="claimerInfo.profile.avatar | avatarSrc(160, 160, false)" />
                <v-gravatar v-if="!claimerInfo.profile && claimerInfo.account" :email="claimerInfo.account.name + '@deip.world'" />
            </v-avatar>

            <div class="col-grow c-pl-12">
                <div class="display-1 half-bold c-pt-4">
                    <router-link class="a" :to="{ name: 'UserDetails', params: { account_name: claimerInfo.account.name }}">
                        {{ claimerInfo | fullname }}
                    </router-link>
                </div>

                <div class="c-pt-4">
                    <div class="row half-bold">
                        <span class="c-mt-1">
                            <v-icon small>location_on</v-icon> {{ locationString }}
                        </span>
                    </div>
                </div>

                <div v-if="claimerInfo.profile" class="c-pt-2">{{ claimerInfo | employmentOrEducation}}</div>
            </div>
        </div>

        <div class="bold title c-pt-8">Discipline: {{ claim.discipline.label }}</div>
        <div class="bold title c-pt-8">Motivation letter</div>

        <div class="c-pt-4">{{ claim.coverLetter }}</div>
        
        <div class="bold title c-pt-8">Publications</div>

        <v-card class="c-mt-6 hidden-last-child">
            <template v-for="publicationUrl in claim.publications">
                <div class="c-p-6">
                    <v-icon color="primary" class="c-mr-3">mdi-note-text</v-icon>
                    <a class="a" :href="publicationUrl" target="_blank">{{ publicationUrl }}</a>
                </div>

                <v-divider></v-divider>
            </template>
        </v-card>

        <div class="c-mt-8">
            <v-btn color="primary" class="ma-0" @click="isAllocationDialogShown = true">Create a proposal</v-btn>
        </div>

        <claim-user-expertise-allocation-dialog
            :is-shown="isAllocationDialogShown"
            @close="isAllocationDialogShown = false"
        ></claim-user-expertise-allocation-dialog>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'ClaimUserExpertiseBody',
        data() {
            return {
                isAllocationDialogShown: false
            }
        },
        computed: {
            ...mapGetters({
                claimerInfo: 'claimExpertise/claimerInfo',
                claim: 'claimExpertise/claim'
            }),
            locationString() {
                const profile = this.claimerInfo ? this.claimerInfo.profile : null;
                let location = "";

                if (profile) {
                    location += profile.location.city ? profile.location.city : '';
                    location += profile.location.city && profile.location.country ? ', ' : '';
                    location += profile.location.country ? profile.location.country : '';
                }

                return location;
            }
        },
        methods: {
        },
        created() {
        }
    }
</script>

<style lang="less" scoped>

</style>
