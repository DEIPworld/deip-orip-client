<template>
    <div v-if="isLoadingResearchContentPage === false">
        <div class="c-mb-8" v-if="research">
            <router-link class="a sm-title" 
                :to="{ name: 'ResearchContentDetails', params: { research_group_permlink: research.group_permlink, research_permlink: research.permlink, content_permlink: content.permlink } }"
            >{{ content.title }}</router-link>
        </div>

        <div class="row justify-center">
            <div>
                <span class="c-pr-2">
                    <v-btn class="ma-0" 
                        :dark="isPositive === true" 
                        :color="isPositive === true ? 'green darken-2' : undefined" 
                        small depressed
                        @click="isPositive = true"
                    >Approve</v-btn>
                </span>
                <span>
                    <v-btn class="ma-0" 
                        :dark="isPositive === false" 
                        :color="isPositive === false ? 'red darken-2' : undefined" 
                        small depressed
                        @click="isPositive = false"
                    >Reject</v-btn>
                </span>
            </div>
        </div>
        
        <div class="row justify-center c-mt-10 c-mb-10">
            <div>
                <v-btn color="primary" class="width-9"
                        @click="publishReview()"
                        :loading="isLoading"
                >Publish</v-btn>
            </div>
        </div>

        <div class="c-mt-5">
            <v-card class="c-p-8">
                <div class="bold subheading c-pb-2">Related expert tokens:</div>
                <div class="c-pt-4" v-for="(exp, index) in relatedExpertise" :key="index">
                    <span>{{exp.discipline_name}}</span>
                    <span class="right half-bold">{{exp.amount}}</span>
                </div>
            </v-card>
            <div class="orange--text c-pt-4 text-align-center">
                <v-icon color="orange">warning</v-icon>
                100% of your expert tokens will be locked for 24 hours after you've published the review
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';

    export default {
        name: "ResearchContentAddReviewSidebar",
        data() {
            return {
                isPositive: true,
                isLoading: false
            };
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userExperise: 'auth/userExperise',
                content: 'rcd/content',
                research: 'rcd/research',
                isLoadingResearchContentPage: 'rcd/isLoadingResearchContentPage'
            }),
            relatedExpertise() {
                return this.userExperise != null && this.research != null
                    ?  this.userExperise.filter(exp => 
                            this.research.disciplines.find(d => d.id == exp.discipline_id))
                    : false
            }
        },

        methods: {
            publishReview() {
                const reviewEditor = this.$store.getters['rcd/reviewEditor'];
                this.isLoading = true;
                reviewEditor.save()
                    .then((reviewHtmlContent) => {
                        return deipRpc.broadcast.makeReviewAsync(
                            this.user.privKey,
                            this.user.username,
                            this.content.id,
                            reviewHtmlContent,
                            this.isPositive,
                            10000)
                    }).then((data) => {
                        this.$store.dispatch('layout/setSuccess', {
                            message: "Your review has been published successfully !"
                        });
                        // TODO: redirect to content page
                        this.$router.push({ name: 'research-details', params: this.$route.params });
                    })
                    .catch((err) => {
                        this.$store.dispatch('layout/setError', {
                            message: "An error occurred while adding review, please try again later"
                        });
                        console.log(err)
                    })
                    .finally(() => {
                        this.isLoading = false
                    });
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
