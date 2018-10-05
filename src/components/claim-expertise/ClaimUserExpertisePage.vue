<template>
    <v-container fluid fill-height class="pa-0 column-page">

        <div class="content-column">
            <div class="filling">
                <claim-user-expertise-body></claim-user-expertise-body>
            </div>
        </div>

        <v-card height="100%" class="sidebar">
            <claim-user-expertise-sidebar></claim-user-expertise-sidebar>
        </v-card>

    </v-container>   
</template>

<script>
    export default {
        name: 'ClaimUserExpertisePage',
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
