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
        }
    };
</script>

<style lang="less" scoped>
</style>