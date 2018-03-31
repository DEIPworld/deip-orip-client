<template>
    <v-container fluid fill-height class="pa-0">

        <v-layout class="d-block pa-4">
            <research-details-body></research-details-body>
        </v-layout>

        <v-layout shrink class="d-block">
            <v-card width="300px" height="100%" class="px-4 pb-3">
                <research-details-sidebar></research-details-sidebar>
            </v-card>
        </v-layout>
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
