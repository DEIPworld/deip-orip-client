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
    export default {
        name: "ResearchGroupDetails",
        data() { 
            return {} 
        }
    };
</script>

<style lang="less" scoped>
</style>
