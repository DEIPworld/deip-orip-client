<template>
    <v-container fluid fill-height class="pa-0 column-page">

        <div class="content-column">
            <div class="filling">
                <research-group-details-body></research-group-details-body>
            </div>
        </div>

        <v-card height="100%" class="sidebar">
            <research-group-details-sidebar></research-group-details-sidebar>
        </v-card>

    </v-container>   
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "ResearchGroupDetails",
        computed: {
            ...mapGetters({
                user: 'user',
                userGroups: 'userGroups'
            })
        },
        data() { 
            return {} 
        },
        created() {
            const group_permlink = this.$route.params.research_group_permlink;
            this.$store.dispatch('researchGroup/loadResearchGroup', group_permlink);
        }
    };
</script>

<style lang="less" scoped>
</style>
