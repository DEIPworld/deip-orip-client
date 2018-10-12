<template>
    <page-container>

        <contentbar>
            <research-group-details-body></research-group-details-body>
        </contentbar>

        <sidebar>
            <research-group-details-sidebar></research-group-details-sidebar>
        </sidebar>

    </page-container>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "ResearchGroupDetails",
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userGroups: 'auth/userGroups'
            })
        },
        data() { 
            return {} 
        },
        created() {
            const groupPermlink = this.$route.params.research_group_permlink;
            this.$store.dispatch('researchGroup/loadResearchGroup', groupPermlink);
        }
    };
</script>

<style lang="less" scoped>
</style>
