<template>
    <page-container>
        <contentbar>
            <research-content-add-review-body></research-content-add-review-body>
        </contentbar>
        
        <sidebar>
            <research-content-add-review-sidebar></research-content-add-review-sidebar>
        </sidebar>
    </page-container>  
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "ResearchContentAddReview",

        data() { 
            return {} 
        },

        created() {
            const permlinks = {
                group_permlink: decodeURIComponent(this.$route.params.research_group_permlink),
                research_permlink: decodeURIComponent(this.$route.params.research_permlink),
                content_permlink: decodeURIComponent(this.$route.params.content_permlink),
                ref: this.$route.query.ref
            };

            this.$store.dispatch('rcd/loadResearchContentDetails', permlinks);
        }
    };
</script>

<style lang="less" scoped>
</style>