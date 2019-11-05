<template>
    <v-card class="review-container hidden-last-child">
        <div class="legacy-row-nowrap c-p-6 clickable" @click="goToReviewPage()">
            <div style="width: 10%" class="legacy-column text-align-center" @click="goToReviewerProfilePage($event, review.author.account.name)">
                <v-avatar size="90px">
                    <img v-if="review.author.profile" v-bind:src="review.author.profile.avatar | avatarSrc(90, 90, false)" />
                    <v-gravatar v-else :title="review.author.account.name" :email="review.author.account.name + '@deip.world'" />
                </v-avatar>
                <div class="bold c-pt-2">
                    <span class="a">
                        {{ review.author | fullname }}
                    </span>
                </div>
            </div>
            <div class="legacy-col-grow c-ml-6">
                <div>
                    <span class="grey--text">{{ review.created_at | dateFormat('D MMM YYYY', true) }}</span>
                    <span class="half-bold c-pl-2">
                        <span class="green--text text--darken-2" v-if="review.is_positive">Approving</span>
                        <span class="red--text text--darken-2" v-if="!review.is_positive">Rejecting</span>
                    </span>
                </div>

                <div class="c-pt-2 review-preview">
                    <span v-html="extractPreview(review)"></span>
                </div>

                <div class="legacy-row-nowrap">
                    <div v-for="tvo in disciplines" class="grey--text">
                   <!-- <span class="c-pr-1">
                            <span>{{ tvo.disciplineName }}</span>
                        </span>
                       <span class="c-pr-4 bold">
                            <span>{{tvo.totalWeight}}</span>
                        </span> -->
                    </div>
                </div>
            </div>

            <div class="legacy-column" style="width: 5%">
                <div class="right">
                    <v-avatar size="40px">
                        <img :src="review.program.agency_name | agencyLogoSrc(160, 160, false)" />
                    </v-avatar>
                </div>
            </div>
        </div>
        <v-divider></v-divider>
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-oa-rpc-client';

    export default {
        name: "ApplicationReviewListItem",
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
                    const tvo = {
                        disciplineName: discipline.name,
                        totalWeight: 0
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

            goToReviewerProfilePage($event, reviewer) {
                $event.preventDefault();
                $event.stopPropagation();
                this.$router.push({ name: 'UserDetails', params: { account_name: reviewer }});
            },

            goToReviewPage() {
                const params = { review_id: this.review.id, application_id: this.review.grant_application_id };
                deipRpc.api.getGrantApplicationAsync(this.review.grant_application_id)
                    .then((application) => {
                        return deipRpc.api.getResearchByIdAsync(application.research_id)
                    })
                    .then((research) => {
                        params.research_permlink = encodeURIComponent(research.permlink);
                        return deipRpc.api.getResearchGroupByIdAsync(research.research_group_id)
                    })
                    .then((group) => {
                        params.research_group_permlink = encodeURIComponent(group.permlink);
                        this.$router.push({ name: 'ResearchApplicationReview', params });
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
