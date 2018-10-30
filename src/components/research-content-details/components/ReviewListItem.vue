<template>
    <v-card class="review-container hidden-last-child">
        <div class="row-nowrap c-p-6">
            <div class="review-left-block text-align-center">
                <v-avatar size="90px">
                    <img v-if="review.author.profile" v-bind:src="review.author.profile.avatar | avatarSrc(90, 90, false)" />
                    <v-gravatar v-else :title="review.author.account.name" :email="review.author.account.name + '@deip.world'" />
                </v-avatar>
                <div class="bold c-pt-2">{{ review.author | fullname }}</div>
            </div>
            <div class="column c-ml-6">
                <div>
                    <span class="grey--text">{{ review.created_at | dateFormat('D MMM YYYY', true) }}</span>
                    <span class="half-bold c-pl-2">
                        <span class="green--text text--darken-2" v-if="review.is_positive">Positive</span>
                        <span class="red--text text--darken-2" v-if="!review.is_positive">Negative</span>
                    </span>
                </div>

                <div class="c-pt-4 col-grow review-preview" @click="goToReviewPage()">
                    <span v-html="extractPreview(review)"></span>
                </div>

                <div class="row-nowrap">
                    <div v-for="tvo in disciplines">
                        <span class="c-pr-1">
                            <span class="bold green--text text--darken-2">{{ tvo.disciplineName }}</span>
                        </span>
                        <span class="c-pr-4">
                            <span>{{tvo.totalWeight}}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <v-divider></v-divider>
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-rpc-client';

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
            disciplines() {
                const out = [];
                const review = this.review;
                const tvoList = [];

                for (var i = 0; i < review.disciplines.length; i++) {
                    const discipline = review.disciplines[i];
                    const weight = review.weight_per_discipline.find(arr => arr[0] === discipline.id);
                    const tvo = {
                        disciplineName: discipline.name,
                        totalWeight: weight !== undefined ? weight[1] : 0
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
                temp.innerHTML = this.review.content;
                if (temp.children.length) {
                    let headers = [...temp.children].filter((child) => isHeader(child) && child.innerText);
                    let headerText = headers[0]
                        ? headers[0].innerText 
                        : `Reviewed by ${this.$options.filters.fullname(this.review.author)}`;
                    
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

            goToReviewPage() {
                const params = { review_id: this.review.id };
                deipRpc.api.getResearchContentByIdAsync(this.review.research_content_id)
                    .then((content) => {
                        params.content_permlink = content.permlink;
                        return deipRpc.api.getResearchByIdAsync(content.research_id)
                    })
                    .then((research) => {
                        params.research_permlink = research.permlink;
                        return deipRpc.api.getResearchGroupByIdAsync(research.research_group_id)
                    })
                    .then((group) => {
                        params.research_group_permlink = group.permlink;
                        this.$router.push({ name: 'ResearchContentReview', params });
                    });
            }
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
