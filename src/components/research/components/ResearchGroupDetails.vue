<template>
    <v-container fluid fill-height class="pa-0">

        <v-layout class="d-block c-p-10">
            <research-group-details-body></research-group-details-body>
        </v-layout>

        <v-layout shrink class="d-block">
            <v-card width="300px" height="100%" class="c-pt-10 c-ph-6">
                <research-group-details-sidebar></research-group-details-sidebar>
            </v-card>
        </v-layout>

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
