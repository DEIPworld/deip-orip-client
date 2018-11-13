<template>
    <div class="c-p-6 pos-relative">
        <router-link :fto="`/${research.group_permlink}/research/${research.permlink}`" class="a subheading"
            :to="{
                name: 'research-details',
                params: {
                    research_group_permlink: encodeURIComponent(research.group_permlink),
                    research_permlink: encodeURIComponent(research.permlink)
                }
            }"
        >{{research.title}}</router-link>

        <div class="c-pt-2">
            <router-link class="a c-pr-2 caption" 
                :to="{
                    name: 'ResearchGroupDetails',
                    params: { research_group_permlink: encodeURIComponent(research.group_permlink) }
                }"
            >{{ research.group.name }}:</router-link>

            <span class="caption grey--text hidden-last-child">
                <template v-for="author in research.enrichedAuthors">
                    <span>{{ author | fullname}}</span>
                    <span> · </span>
                </template>
            </span>
        </div>

        <div v-show="!research.isCollapsed" class="c-pt-2">
            <v-divider></v-divider>
            <div class="c-pv-2 half-bold">{{ research.abstract }}</div>
            <v-divider></v-divider>
        </div>

        <div class="row c-pt-2">
            <div v-for="eci in eciList" class="grey--text">
                <span class="c-pr-1">
                    <span class="">{{ eci.disciplineName }}</span>
                </span>

                <span class="c-pr-4 bold">
                    <span>{{ eci.value }}</span>
                </span>
            </div>
        </div>

        <div class="row-nowrap c-pt-1" v-show="!research.isCollapsed">
            <div class="c-pr-8 grey--text" v-if="research.created_at">
                <v-icon color="grey" size="18px">event</v-icon> Created
                <span class="half-bold">{{ research.created_at | dateFormat('D MMM, YYYY', true) }}</span>
            </div>

            <div class="c-pr-8 grey--text" v-if="research.owned_tokens">
                <v-icon color="grey" size="18px">timelapse</v-icon> Owned tokens
                <span class="half-bold">{{ convertToPercent(research.owned_tokens) }}%</span>
            </div>

            <div class="c-pr-8 grey--text" v-if="research.review_share_in_percent">
                <v-icon color="grey" size="18px">pie_chart</v-icon> Review award
                <span class="half-bold">{{ convertToPercent(research.review_share_in_percent) }}%</span>
            </div>

            <div class="c-pr-8 grey--text" v-if="tokenSaleStr">
                <v-icon color="grey" size="18px">attach_money</v-icon>
                <span class="">{{ tokenSaleStr }}</span>
            </div>

            <div class="c-pr-8">
                <v-icon color="grey" size="18px">chat_bubble</v-icon>
                
                <span class="bold display-inline-flex">
                    <span class="green--text text--darken-2">{{ countReviews(true) }}</span>
                    <span>/</span>
                    <span class="red--text text--darken-2">{{ countReviews(false) }}</span>
                </span>
            </div>
        </div>

        <div class="pos-absolute expand-btn">
            <v-btn flat small icon color="grey" class="ma-0" @click="toggleItem()">
                <v-icon v-show="research.isCollapsed">keyboard_arrow_down</v-icon>
                <v-icon v-show="!research.isCollapsed">keyboard_arrow_up</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import moment from 'moment';

    export default {
        name: "ResearchFeedListItem",
        props: {
            research: { required: true, default: undefined }
        },
        computed: {
            disciplines() {
                return this.research.disciplines && this.research.totalVotes
                    ? this.research.disciplines.map(discipline => {
                        return {
                            disciplineName: discipline.name,
                            totalWeight: this.research.totalVotes.reduce(
                                (accumulator, value) => value.discipline_id === discipline.id 
                                    ? accumulator + value.total_weight
                                    : accumulator,
                                0
                            )
                        };
                    })
                    : [];
            },
            eciList() {
                return this.research.disciplines.map(discipline => {
                    const eciObj = this.research.eci_per_discipline.find(item => item[0] === discipline.id);

                    return {
                        disciplineName: discipline.name,
                        value: eciObj ? eciObj[1] : 0
                    }
                });
            },
            tokenSaleStr() {
                if (!this.research.tokenSale) {
                    return undefined;
                }

                const now = moment().valueOf();
                const startTime = moment.utc(this.research.tokenSale.start_time).local().valueOf();
                const endTime = moment.utc(this.research.tokenSale.end_time).local().valueOf();
                const dateFormat = 'D MMM YYYY';

                if (now < startTime) {
                    return `Starts on ${moment(startTime).format(dateFormat)}`;
                } else if (now < endTime) {
                    return `Ends on ${moment(endTime).format(dateFormat)}`;
                } else {
                    return undefined;
                }
            }
        },
        data() {
            return {};
        },
        methods: {
            toggleItem() {
                this.$store.dispatch('feed/toggleFeedItem', this.research.research_id)
            },
            countReviews(isPositive) {
                return this.research.reviews.reduce(
                    (acc, review) => review.is_positive && isPositive || !review.is_positive && !isPositive ? acc + 1 : acc,
                    0
                );
            },
        }
    };
</script>

<style lang="less" scoped>
    .expand-btn {
        right: 24px;
        bottom: 12px;
    }
</style>
