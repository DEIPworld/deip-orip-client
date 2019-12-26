<template>
    <v-card class="pa-4">
        <v-layout row>

            <v-flex xs2 text-xs-center>
                <v-layout column fill-height justify-space-between>
                    <div @click="goToReviewerProfilePage($event, _review.author.account.name)">
                        <v-avatar size="90px">
                            <img v-if="review.author.profile" v-bind:src="review.author.profile.avatar | avatarSrc(180, 180, false)" />
                            <v-gravatar v-else :title="review.author.account.name" :email="review.author.account.name + '@deip.world'" />
                        </v-avatar>
                        <div class="bold c-pt-2">
                            <span class="a">
                                {{ review.author | fullname }}
                            </span>
                        </div>
                    </div>

                    <v-btn small outline @click="goToReviewPage()">See Review</v-btn>
                </v-layout>
            </v-flex>
     
            <v-flex xs6>
                <div class="pl-4">
                    <div>
                        <span class="grey--text">{{ _review.created_at | dateFormat('D MMM YYYY', true) }}</span>
                        <span class="half-bold c-pl-2">
                            <span class="green--text text--darken-2" v-if="_review.is_positive">Approving</span>
                            <span class="red--text text--darken-2" v-if="!_review.is_positive">Rejecting</span>
                        </span>
                    </div>

                    <div class="py-2">
                        <span v-html="extractPreview(_review)"></span>
                    </div>

                    <div>
                        <div v-for="(tvo, i) in disciplines" class="grey--text half-bold" :key="'discipline-' + i">
                            <span class="pr-2">
                                <span>{{ tvo.disciplineName }}:</span>
                            </span>
                        </div>
                    </div>
                </div>
            </v-flex>
            
            <v-flex xs4 px-2>
                <v-layout align-end column class="">
                <v-layout row justify-space-between align-center class="pb-2 full-width">
                    <div class="text-xs-left">Novelty:</div>
                    <squared-rating class="pl-4" readonly v-model="_review.ratings.novelty" />
                </v-layout>
                <v-layout row justify-space-between align-center class="pb-2 full-width">
                    <div class="text-xs-left">Technical Quality:</div>
                    <squared-rating class="pl-4" readonly v-model="_review.ratings.technicalQuality" />
                </v-layout>
                <v-layout row justify-space-between align-center class="full-width">
                    <div class="text-xs-left">Methodology:</div>
                    <squared-rating class="pl-4" readonly v-model="_review.ratings.methodology" />
                </v-layout>
                </v-layout>
            </v-flex>
        </v-layout>

    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-oa-rpc-client';

    export default {
        name: "ReviewListItem",
        props: {
            review: { required: true }
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userExperise: 'auth/userExperise'
            }),
            _review() {
              const reviewContent = this.$options.filters.reviewContent(this.review.content);
              const reviewRatings = this.$options.filters.reviewRatings(this.review.content);

              return {
                ...this.review,
                content: reviewContent,
                ratings: reviewRatings,
              };
            },
            disciplines() {
                const out = [];
                const review = this._review;
                const tvoList = [];

                for (var i = 0; i < review.disciplines.length; i++) {
                    const discipline = review.disciplines[i];
                    const tvo = {
                        disciplineName: discipline.name
                    }
                    out.push(tvo)
                }
                return out;
            }
        },
        data() {
            return {
            };
        },

        methods: {
            extractPreview() {
                let temp = document.createElement('span');
                temp.innerHTML = this._review.content;
                if (temp.children.length) {
                    let headers = [...temp.children].filter((child) => isHeader(child) && child.innerText);
                    let headerText = headers[0]
                        ? headers[0].innerText 
                        : `Reviewed by ${this.$options.filters.fullname(this._review.author)}`;
                    
                    let paragraphs = [...temp.children].filter((child) => isParagraph(child) && child.innerText);
                    let paragraphText = paragraphs[0] 
                        ? paragraphs[0].innerText
                        : ``;

                    let titleText = headerText.length > 100 ? `${headerText.substring(0, 100)}...` : headerText;
                    let bodyText = paragraphText.length > 300 ? `${paragraphText.substring(0, 300)}...` : paragraphText;
                    return `<div><h3>${titleText}</h3><p>${bodyText}</p></div>`
                }

                function isHeader(el) {
                    return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].some(h => h === el.nodeName);
                }
                function isParagraph(el) {
                     return el.nodeName === 'P';
                }
            },

            goToReviewerProfilePage($event, reviewer) {
                $event.preventDefault();
                $event.stopPropagation();
                this.$router.push({ name: 'UserDetails', params: { account_name: reviewer }});
            },

            goToReviewPage() {
                const params = { review_id: this._review.id };
                
                deipRpc.api.getResearchContentByIdAsync(this._review.research_content_id)
                    .then((content) => {
                        params.content_permlink = encodeURIComponent(content.permlink);
                        return deipRpc.api.getResearchByIdAsync(content.research_id)
                    })
                    .then((research) => {
                        params.research_permlink = encodeURIComponent(research.permlink);
                        return deipRpc.api.getResearchGroupByIdAsync(research.research_group_id)
                    })
                    .then((group) => {
                        params.research_group_permlink = encodeURIComponent(group.permlink);
                        this.$router.push({ name: 'ResearchContentReview', params });
                    });
            }
        },

        created() {
        }
    };
</script>

<style lang="less" scoped>
    .expand-btn {
        right: 24px;
        bottom: 12px;
    }
    .review-container {
        margin-bottom: 5px;
    }
    .review-preview {
        cursor: pointer;
    }
</style>
