<template>
    <div>
        <div v-if="isFirst"><v-divider></v-divider></div>
        <v-layout row wrap class="c-pb-2">
            <v-flex xs12>
                <div class="c-pl-5 c-pt-5">
                    <router-link class="a subheading" :to="{}">
                        Energisticaly maximize Blockchain quality vectors befor progressive functionalities.
                    </router-link>
                </div>
            </v-flex>
            <v-flex xs12>
                <div class="row c-pl-5 c-pt-2 c-pb-2">
                    <div class="col-grow caption">
                        <router-link class="a body-2" :to="{}">
                           {{application.researchGroup}}
                        </router-link>
                    </div>
                    <div class="col-grow body-1 grey--text" v-for="author in application.authors" :key="author">
                        <span>{{author}}</span>
                    </div>
                    <div class="col-grow bold caption grey--text">
                        <span>+10 more</span>
                    </div>
                </div>
            </v-flex>

            <v-flex xs12>
                <div class="row c-pl-5 c-pb-2">
                    <div class="col-grow body-1 grey--text" v-for="exp in application.expertise" :key="exp.name">
                        <span>{{exp.name}}</span>
                        <span class="c-pl-3 bold">{{exp.amount}}</span>
                    </div>
                </div>
            </v-flex>
        </v-layout>
        <div><v-divider></v-divider></div>
    </div>
</template>

<script>
    export default {
        name: "ProgramListItem",
        props: {
            application: { required: true, default: undefined },
            isFirst: { default: false }
        },
        data() { 
            return {}
        }
    };
</script>


<style lang="less" scoped>

</style>
