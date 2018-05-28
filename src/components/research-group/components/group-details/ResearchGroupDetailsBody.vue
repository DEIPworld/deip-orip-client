<template>
    <div>
        <div>
            <v-icon small>date_range</v-icon>
            <span>Created 20 Jan 2018</span>
        </div>
        <div class="display-1 half-bold c-mt-10">{{ group ? group.name : '' }}</div>

        <div class="c-pt-8">{{ group ? group.description : '' }}</div>
        
        <div class="c-pt-8 title">Grants: 2</div>

        <div class="c-pt-6">
            <v-card>
                <div class="info-card-list">
                    <div class="list-line">
                        <div class="list-header-cell col-4">Researcher</div>
                        <div class="list-header-cell col-2">Expertise</div>
                        <div class="list-header-cell col-2 text-align-center">Group weight</div>
                        <div class="list-header-cell col-2 text-align-center">Member since</div>
                        <div class="list-header-cell col-2 text-align-center">Location</div>
                    </div>

                    <v-divider></v-divider>

                    <div class="list-line">
                        <div class="row-nowrap col-4 list-body-cell">
                            <v-avatar size="40px">
                                <v-gravatar :email="'initdelegate' + '@deip.world'" />
                            </v-avatar>
                            <div class="col-grow c-pl-4">
                                <router-link to="/userDetails" class="a subheading">initdelegate</router-link>
                                <div class="caption c-pt-1">Belarusian State University of Informatics and Radioelectronics</div>
                            </div>
                        </div>
                        <div class="col-2 list-body-cell">
                            <div>
                                <span class="uppercase bold">Phys:</span> 234
                            </div>
                            <div>
                                <span class="uppercase bold">Quant. Phys:</span> 322
                            </div>
                            <div>
                                <span class="uppercase bold">Quant. Opt:</span> 3 223
                            </div>
                        </div>
                        <div class="col-2 text-align-center list-body-cell">60%</div>
                        <div class="col-2 text-align-center list-body-cell">20 Jan 2018</div>
                        <div class="col-2 text-align-center list-body-cell">Belarus</div>
                    </div>

                    <v-divider></v-divider>

                    <div class="list-line">
                        <div class="row-nowrap col-4 list-body-cell">
                            <v-avatar size="40px">
                                <v-gravatar :email="'alice' + '@deip.world'" />
                            </v-avatar>
                            <div class="col-grow c-pl-4">
                                <router-link to="/userDetails" class="a subheading">alice</router-link>
                                <div class="caption c-pt-1">Belarusian State University</div>
                            </div>
                        </div>
                        <div class="col-2 list-body-cell">
                            <div>
                                <span class="uppercase bold">Phys:</span> 32
                            </div>
                            <div>
                                <span class="uppercase bold">Quant. Phys:</span> 934
                            </div>
                            <div>
                                <span class="uppercase bold">Quant. Opt:</span> 223
                            </div>
                        </div>
                        <div class="col-2 text-align-center list-body-cell">23%</div>
                        <div class="col-2 text-align-center list-body-cell">3 Feb 2018</div>
                        <div class="col-2 text-align-center list-body-cell">Russia</div>
                    </div>

                    <v-divider></v-divider>
                </div>

                <div class="c-pv-4 c-ph-6">
                    <v-btn outline icon color="primary" class="ma-0">
                        <v-icon small>add</v-icon>
                    </v-btn>
                    <span class="c-pl-2 deip-blue-color">Invite researchers</span>
                </div>
            </v-card>
        </div>

        <div class="c-pt-7">
            <state-research-list
                :research-list="researchList"
            ></state-research-list>
        </div>

        <div class="c-pt-8">
            <research-group-details-proposals></research-group-details-proposals>
        </div>
    </div>   
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "ResearchGroupDetailsBody",
        props: {
        },
        data() { 
            return {} 
        },
        computed: {
            ...mapGetters({
                group: 'researchGroup/group',
                researchList: 'researchGroup/researchList'
            })
        }
    };
</script>

<style lang="less" scoped>
</style>
