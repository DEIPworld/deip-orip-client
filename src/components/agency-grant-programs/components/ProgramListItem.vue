<template>
    <div>
        <div v-if="isFirst" class="program-divider"><v-divider></v-divider></div>
        <v-layout row wrap class="pl-4 pb-2">
            <v-flex xs9>
                <div class="pl-4 pt-2">
                    <router-link class="a subheading" :to="{ name: 'GrantProgramDetails', params: { agency: program.organization_name, foa: program.funding_opportunity_number }}">
                        {{program.additional_info.funding_opportunity_title}}
                    </router-link>
                </div>
                <v-layout row pl-4 pt-2 pb-2>
                    <v-flex caption grey--text>
                        <span class="pr-2">Posted Date:</span>
                        <v-icon color="grey" small>event</v-icon>
                        <span>{{new Date(`${program.posted_date}Z`).toDateString()}}</span>
                    </v-flex>
                    <v-flex caption grey--text>
                        <span class="pr-2">Closing Date:</span>
                        <v-icon color="grey" small>event</v-icon>
                        <span>{{new Date(`${program.close_date}Z`).toDateString()}}</span>
                    </v-flex>
                    <v-flex caption grey--text>
                        <span>#{{program.funding_opportunity_number}}</span>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs2 offset-xs1 text-xs-center>
                <div class="grey--text pt-3 body-2">FUNDING</div>
                <div class="title pt-2 font-weight-bold">$ {{fromAssetsToFloat(program.amount)}}</div>
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
