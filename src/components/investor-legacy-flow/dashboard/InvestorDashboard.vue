<template>
    <page-container>
        
        <sidebar>
            <investor-dashboard-sidebar></investor-dashboard-sidebar>
        </sidebar>

        <contentbar>
            <investor-dashboard-body></investor-dashboard-body>
        </contentbar>

        <sidebar>
            <investor-dashboard-item-details-sidebar></investor-dashboard-item-details-sidebar>
        </sidebar>

    </page-container>
</template>

<script>
    export default {
        name: 'InvestorDashboard',

        data() {
            return {
            }
        },

        methods: {
        },
        
        created() {
        }
    }
</script>

<style lang="less" scoped>
</style>
