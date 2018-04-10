<template>
    <v-container fluid fill-height class="pa-0 two-column-page">

        <div class="content-column">
            <div class="filling">
                <research-details-body></research-details-body>
            </div>
        </div>

        <v-card height="100%" class="sidebar">
            <research-details-sidebar></research-details-sidebar>
        </v-card>
    </v-container>   
</template>

<script>
    export default {
        name: "ResearchDetails",
        data() { 
            return {
            } 
        }
    };
</script>

<style lang="less" scoped>
</style>
