<template>
    <v-container fluid fill-height class="pa-0">

        <div class="c-p-10">
            <div class="row">
                <v-avatar size="120px">
                    <img src="http://deip.world/static/nignatiev.5ab584fd.png" alt="User">
                </v-avatar>
                <div class="col-grow c-pl-12">
                    <div class="display-1 half-bold c-pt-4">Nikolay Ignatiev</div>
                    <div class="c-pt-4">
                        <v-icon small>location_on</v-icon>
                        <span class="half-bold"> Minsk, Belarus</span>
                        <span> - 11:43 am local time</span>
                        <v-icon small color="grey lighten-1">mode_edit</v-icon>
                    </div>
                    <div class="c-pt-2">Belarusian State University of Informatics and Radioelectronics</div>
                </div>
            </div>
            <div class="c-pt-8">
                Short description here.  Short description here.  Short description here.  benefits. Monotonectally 
                innovate bleeding-edge functionalities whereas strategic paradigms. Dramatically utilize open-source 
                manufactured products before go forward technology. Quickly develop maintainable methods of empowerment 
                vis-a-vis cross functional supply chains. Competently monetize process-centric solutions with synergistic 
                initiatives. Holisticly productivate economically sound best practices rather than 2.0
            </div>

            <div class="c-pt-7">
                <state-research-list></state-research-list>
            </div>

            <div class="c-pt-8">
                <div class="title">Research</div>
            </div>

            <v-card class="c-mt-6">
                <div class="c-p-6">
                    <router-link to="/researchGroupDetails" class="research-group-title">Dream team</router-link>
                    <div class="research-group-authors c-pt-2">Alex Shkor  ·  Artyom Ruseckiy  ·  Egor Tsaryk</div>
                </div>
                <v-divider></v-divider>
                <div class="c-p-6">
                    <router-link to="/researchGroupDetails" class="research-group-title">Energistically maximize Blockchain quality vectors before progressive functionalities</router-link>
                    <div class="research-group-authors c-pt-2">Alex Shkor  ·  Artyom Ruseckiy  ·  Egor Tsaryk · Alex Shkor  ·  Artyom Ruseckiy  ·  Egor Tsaryk</div>
                </div>
                <v-divider></v-divider>
                <div class="c-p-6">
                    <router-link to="/researchGroupDetails" class="research-group-title">Dream team</router-link>
                    <div class="research-group-authors c-pt-2">Alex Shkor  ·  Artyom Ruseckiy  ·  Egor Tsaryk</div>
                </div>
            </v-card>

            <div class="c-pt-8">
                <div class="title">Education</div>
            </div>

            <v-card class="c-mt-6">
                <div class="c-p-6">
                    <div class="subheading half-bold">Belarusian State University</div>
                    <div class="subheading">
                        Doctor of Philosophy (Ph.D.), Differential Equations, Dynamical Systems & Optimal Control 2014 – 2018
                    </div>
                </div>
                <v-divider></v-divider>
                <div class="c-p-6">
                    <div class="subheading half-bold">Belarusian State University</div>
                    <div class="subheading">
                        Doctor of Philosophy (Ph.D.), Differential Equations, Dynamical Systems & Optimal Control 2014 – 2018
                    </div>
                </div>
            </v-card>
        </div>

        <v-layout shrink class="display-block">
            <v-card width="300px" height="100%" class="c-pv-10 c-ph-6">
                <user-details-sidebar></user-details-sidebar>
            </v-card>
        </v-layout>

    </v-container>   
</template>

<script>
    export default {
        name: 'UserDetails',
        data() {
            return {}
        }
    }
</script>

<style lang="less" scoped>
    .research-group-title {
        font-size: 16px;
        color: #2F80ED;
        font-weight: 500;

        text-decoration: none;
    }
    .research-group-authors {
        font-size: 12px;
        color: #888888;
    }
</style>
