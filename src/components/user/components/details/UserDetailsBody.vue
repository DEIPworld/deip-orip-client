<template>
    <div>
        <div class="row" v-if="userInfo">
            <v-avatar size="120px">
                <v-gravatar :title="userInfo.name" :email="userInfo.name + '@deip.world'" />
            </v-avatar>

            <div class="col-grow c-pl-12">
                <div class="display-1 half-bold c-pt-4">{{ userInfo.name }}</div>

                <div class="c-pt-4">
                    <v-icon small>location_on</v-icon>
                    <span class="half-bold"> Minsk, Belarus</span>
                    <span> - 11:43 am local time</span>
                    <v-icon small>mode_edit</v-icon>

                    <!-- <v-btn flat small icon color="grey" class="ma-0">
                        <v-icon small>mode_edit</v-icon>
                    </v-btn> -->
                </div>

                <div class="c-pt-2">Belarusian State University of Informatics and Radioelectronics</div>
            </div>
        </div>

        <div class="c-pt-8">
            Founder of DEIP – decentralized research platform which fairly rewards scientists corresponding to 
            their contribution to global science.
            Alex is blockchain architect and an expert in scalable distributed systems. He had been working as a 
            Chief Technical Officer and a member of the board of directors at Paralect company for 4 years, but decided 
            to leave to focus on most challenging academic problems and try to solve them by applying Blockchain 
            technology and introducing strong economic models, that will maintain protocol of new society.
        </div>

        <div class="c-pt-7" v-if="false">
            <state-research-list></state-research-list>
        </div>

        <div class="c-pt-8">
            <div class="title">Research Groups: {{ groups.length }}</div>
        </div>

        <v-card class="c-mt-6 hidden-last-child">
            <template v-for="group in groups">
                <div class="c-p-6">
                    <router-link to="/researchGroupDetails" class="research-group-title">{{ group.name }}</router-link>
                    <span v-if="group.is_personal" class="grey--text caption">(personal group)</span>
                        
                    <div class="caption grey--text c-pt-2 hidden-last-child" v-if="!group.is_personal">
                        <template v-for="share in group.shares">
                            <span>{{ share.owner }}</span>
                            <span> · </span>
                        </template>
                    </div>
                </div>

                <v-divider></v-divider>
            </template>
        </v-card>

        <div class="c-pt-8">
            <div class="title">Education</div>
        </div>

        <v-card class="c-mt-6">
            <div class="c-p-6">
                <div class="subheading half-bold">Belarusian State University of Informatics and Radioelectronics</div>
                <div class="">
                    Doctor of Philosophy (Ph.D.), Differential Equations, Dynamical Systems & Optimal Control 2014 – 2018
                </div>
            </div>

            <v-divider></v-divider>

            <div class="c-p-6">
                <div class="subheading half-bold">Belarusian State University</div>
                <div class="">
                    Master degree, Blockchain Technologies
                </div>
            </div>
        </v-card>

        <div class="c-pt-12">
            <v-btn @click="$emit('showEditEducation')">Edit Education</v-btn>
            <v-btn @click="$emit('showEditEmployment')">Edit Employment</v-btn>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'UserDetailsBody',
        data() {
            return {}
        },
        computed: {
            ...mapGetters({
                userInfo: 'userDetails/userInfo',
                groups: 'userDetails/groups',
            })
        },
    }
</script>

<style lang="less" scoped>
    .research-group-title {
        font-size: 16px;
        color: #2F80ED;
        font-weight: 500;
        text-decoration: none;
    }
</style>
