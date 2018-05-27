<template>
    <div class="c-p-6 pos-relative">
        <router-link :to="`/${research.group_permlink}/research/${research.permlink}`" class="a subheading">
            {{research.title}}
        </router-link>

        <div class="caption grey--text c-pt-2" v-if="research.authors">
            {{ research.authors.join("  ·  ") }}
        </div>
        
        <div v-show="isCollapsable === undefined || !research.isCollapsed">
            <div class="c-pt-4 half-bold">
                {{ research.abstract }}
            </div>

            <div class="c-pt-6">
                <div class="row-nowrap">
                    <div v-for="(discipline, index) in disciplines" :key="index">
                        <div class="c-pr-10">
                            <div class="bold green--text text--darken-2">{{ discipline.name }}</div>
                        </div>

                        <div class="c-pr-10">
                            <div>{{discipline.votes}}</div>
                        </div>
                    </div>

                    <div class="c-pr-10">
                        <v-icon size="18px">visibility</v-icon> <span>1999</span>
                    </div>

                    <div class="c-pr-10">
                        <v-icon size="18px">chat_bubble</v-icon> <span>23</span>
                    </div>

                    <div>
                        <v-icon size="18px">date_range</v-icon> <span>Upd 13 Mar 2018</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="pos-absolute expand-btn" v-if="isCollapsable !== undefined">
            <v-btn flat small icon color="grey" class="ma-0" @click="toggleItem()">
                <v-icon v-show="research.isCollapsed">keyboard_arrow_down</v-icon>
                <v-icon v-show="!research.isCollapsed">keyboard_arrow_up</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "ResearchListItem",
        props: {
            research: { required: true, default: undefined },
            isCollapsable: { required: false, default: undefined }
        },
        computed: {
            disciplines() {
                return this.research.disciplines 
                    ? this.research.disciplines.map(discipline => {
                        return {
                            name: discipline.name,
                            votes: this.research.totalVotes.reduce(
                                (accumulator, value) => value.discipline_id === discipline.id 
                                    ? accumulator + value.total_research_reward_weight 
                                    : accumulator,
                                0
                            )
                        };
                    })
                    : [];
            }
        },
        data() {
            return {};
        },
        methods: {
            toggleItem() {
                // todo: unbind from certain state matanager space
                this.$store.dispatch('feed/toggleFeedItem', this.research.research_id)
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
