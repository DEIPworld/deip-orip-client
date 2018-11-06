<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout>
            <div class="c-m-auto page-container">
                <div class="text-align-center display-1 bold">Grants distribution</div>

                <div class="row c-pt-12">
                    <div class="col-grow c-pr-8">
                        <v-btn block color="primary"
                            class="ma-0"
                            :to="{ name: 'CreateDisciplineGrant' }"
                        >Discipline supply grant</v-btn>

                        <div class="c-pt-8 text-align-right">
                            <div class="bold">Indirect Grant is</div>
                            Phosfluorescently strategize user friendly portals before high-payoff process improvements. 
                            Dynamically fashion functional action items through real-time functionalities. Interactively 
                            exploit wireless ROI rather than backward-compatible niche markets.
                        </div>
                    </div>

                    <div class="vertical-devider"></div>

                    <div class="col-grow c-pl-8">
                        <v-btn block color="primary" class="ma-0" :to="{ name: 'CreateDirectGrant' }">Direct grant</v-btn>

                        <div class="c-pt-8 text-align-left">
                            <div class="bold">Direct Grant is</div>
                            Phosfluorescently strategize user friendly portals before high-payoff process improvements.
                            Dynamically fashion functional action items through real-time functionalities. Interactively
                            exploit wireless ROI rather than backward-compatible niche markets.
                        </div>
                    </div>
                </div>
            </div>
        </v-layout>
    </v-container>   
</template>

<script>
    export default {
        name: "GrantStartCreating",
        data() { 
            return {} 
        }
    };
</script>

<style lang="less" scoped>
    @import '../../styles/colors.less';

    .page-container {
        width: 600px;
    }

    .vertical-devider {
        width: 1px;
        background-color: @black-lighter;
    }
</style>
