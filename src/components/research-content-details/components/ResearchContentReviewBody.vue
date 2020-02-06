<template>
    <div class="review-content-container">

        <div class="legacy-row-nowrap c-pb-4">
            <div class="text-align-center">
                <platform-avatar 
                    :user="review.author"
                    :size="120"
                ></platform-avatar>
            </div>
            
            <div class="legacy-column c-ml-10">
                <div class="c-pt-4">
                    <router-link class="a title" :to="{ name: 'UserDetails', params: { account_name: review.author.account.name }}">
                        {{ review.author | fullname }}
                    </router-link>
                </div>

                <div v-if="review.author.profile" class="c-pt-2 c-pb-1">
                    <span class="caption bold">{{review.author | employmentOrEducation}}</span>
                </div>

                <div v-if="hasLocation" class="c-pb-1">
                    <v-icon small>location_on</v-icon><span class="caption"> {{review.author | userLocation}}</span>
                </div>
            </div>
        </div>


        <div class="c-pt-5 c-pb-4 reviewed-content-container">
            <div>
                <span>
                    <span style="color: green" v-if="review.is_positive">Approved</span>
                    <span style="color: red" v-if="!review.is_positive">Rejected</span>
                    review for
                </span>
            </div>

            <div class="c-pt-2 c-pb-2">
                <router-link class="a title" 
                    :to="{
                        name: 'ResearchContentDetails',
                        params: {
                            research_group_permlink: encodeURIComponent(research.group_permlink),
                            research_permlink: encodeURIComponent(research.permlink),
                            content_permlink: encodeURIComponent(content.permlink)
                        }
                    }"
                >{{ content.title }}</router-link>
            </div>
        </div>

        <div v-html="reviewContent"></div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-oa-rpc-client';

    export default {
        name: "ResearchContentReviewBody",

        data() {
            return {
            };
        },

        computed: {
            ...mapGetters({
                user: 'auth/user',
                userExperise: 'auth/userExperise',
                content: 'rcd/content',
                research: 'rcd/research',
                contentReviewsList: 'rcd/contentReviewsList'
            }),
            review() {
                return this.contentReviewsList.find(r => r.id == this.$route.params.review_id)
            },

            hasLocation() {
                return this.review && this.review.author.profile && 
                    this.review.author.profile.location && 
                    (this.review.author.profile.location.country || this.review.author.profile.location.city);
            }

        },

        methods: {

        },
        
        created() {
          this.reviewContent = this.$options.filters.reviewContent(this.review.content);
        }
    };
</script>

<style lang="less">

    .review-content-container {
        margin-left: 5%;
        margin-right: 5%;
    }

    .review-content-container h1, h2, h3 {
        margin-top: 3%;
        margin-bottom: 3%;
    }
    
    .review-content-container h4, h5, h6 {
        margin-top: 2%;
        margin-bottom: 2%;
    }

    .review-content-container p, img {
        margin-top: 1%;
        margin-bottom: 1%;
    }

    .reviewed-content-container {
        border-top: 1px solid #e4e4e4;
        border-bottom: 1px solid #e4e4e4;
    }

</style>
