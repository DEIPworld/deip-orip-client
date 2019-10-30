<template>
    <div>
        <div v-if="isFirst" class="program-divider"><v-divider></v-divider></div>
        <v-layout row wrap class="c-pl-5 c-pb-2">
            <v-flex xs9>
                <div class="c-pl-5 c-pt-3">
                    <router-link class="a subheading" :to="{ name: 'AgencyProgramDetails', params: { agency: program.agency_name, foa: program.funding_opportunity_number }}">
                        {{program.funding_opportunity_title}}
                    </router-link>
                </div>
                <div class="row c-pl-5 c-pt-2 c-pb-3">
                    <div class="legacy-col-grow caption grey--text">
                        <span class="c-pr-2">Posted Date:</span>
                        <v-icon color="grey" small>event</v-icon>
                        <span>{{new Date(`${program.posted_date}Z`).toDateString()}}</span>
                    </div>
                    <div class="legacy-col-grow caption grey--text">
                        <span class="c-pr-2">Closing Date:</span>
                        <v-icon color="grey" small>event</v-icon>
                        <span>{{new Date(`${program.close_date}Z`).toDateString()}}</span>
                    </div>
                    <div class="legacy-col-grow caption grey--text">
                        <span>#{{program.funding_opportunity_number}}</span>
                    </div>
                </div>
            </v-flex>
            <v-flex xs2 offset-xs1 text-xs-center>
                <div class="grey--text c-pt-4 body-2">FUNDING</div>
                <div class="sm-title c-pt-2 bold">$ {{fromAssetsToFloat(program.amount)}}</div>
            </v-flex>
        </v-layout>
        <div class="program-divider"><v-divider></v-divider></div>
    </div>
</template>

<script>
    export default {
        name: "ProgramListItem",
        props: {
            program: { required: true, default: undefined },
            isFirst: { default: false }
        },
        data() { 
            return {}
        }
    };
</script>


<style lang="less" scoped>
    .program-divider {
        padding-left: 3%;
        padding-right: 3%;
    }
</style>
