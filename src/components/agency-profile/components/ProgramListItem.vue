<template>
    <div>
        <div v-if="isFirst" class="program-divider"><v-divider></v-divider></div>
        <v-layout row wrap class="c-pl-5 c-pb-2">
            <v-flex xs9>
            <div class="c-pl-5 c-pt-3 subheading a">{{program.title}}</div>
                <div class="row c-pl-5 c-pt-2 c-pb-3">
                    <div class="col-grow caption grey--text">
                        <span class="c-pr-2">Posted Date:</span>
                        <v-icon color="grey" small>event</v-icon>
                        <span>{{program.postedDate.toDateString()}}</span>
                    </div>
                    <div class="col-grow caption grey--text">
                        <span class="c-pr-2">Closing Date:</span>
                        <v-icon color="grey" small>event</v-icon>
                        <span>{{program.closingDate.toDateString()}}</span>
                    </div>
                    <div class="col-grow caption grey--text">
                        <span>#{{program.number}}</span>
                    </div>
                </div>
            </v-flex>
            <v-flex xs1 offset-xs1 text-xs-center>
                <div class="grey--text c-pt-4 body-2">AWARD</div>
                <div class="sm-title c-pt-2 bold">$ {{program.award}}</div>
            </v-flex>
            <v-flex xs1></v-flex>
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
