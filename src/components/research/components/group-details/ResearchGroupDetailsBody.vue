<template>
    <div>
        <div>
            <v-icon small>date_range</v-icon>
            <span>Created 20 Jan 2018</span>
        </div>
        <div class="display-1 half-bold c-mt-10">Research Group 1</div>

        <div class="c-pt-8">
            Short description here.  Short description here.  Short description here. Or maybe some announcement: 
            looking for high level math jedi. Excited to announce our new member... Maybe some group news feed (optional)?
            Holisticly productivate economically sound best practices rather than 2.0 benefits. Monotonectally 
            innovate bleeding-edge functionalities whereas strategic paradigms. Dramatically utilize open-source 
            manufactured products before go forward technology. Quickly develop maintainable methods of empowerment 
            vis-a-vis cross functional supply chains. Competently monetize process-centric solutions with synergistic 
            initiatives.
        </div>
        
        <div class="c-pt-8 title">Grants: 4</div>

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
                                <img src="http://deip.world/static/ashkor.7ff44c16.png" alt="User">
                            </v-avatar>
                            <div class="col-grow c-pl-4">
                                <router-link to="/userDetails" class="a subheading">Nikolay Ignatiev</router-link>
                                <div class="caption c-pt-1">Belarusian State University of Informatics and Radioelectronics</div>
                            </div>
                        </div>
                        <div class="col-2 list-body-cell">
                            <div>
                                <span class="uppercase bold">Phys:</span> 32234
                            </div>
                            <div>
                                <span class="uppercase bold">Quant. Phys:</span> 32234
                            </div>
                            <div>
                                <span class="uppercase bold">Quant. Opt:</span> 32234
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
                                <img src="http://deip.world/static/akastsiushkina.ce4ec45f.png" alt="User">
                            </v-avatar>
                            <div class="col-grow c-pl-4">
                                <router-link to="/userDetails" class="a subheading">Anastasiya Kastsiushkina</router-link>
                                <div class="caption c-pt-1">Belarusian State University</div>
                            </div>
                        </div>
                        <div class="col-2 list-body-cell">
                            <div>
                                <span class="uppercase bold">Phys:</span> 32234
                            </div>
                            <div>
                                <span class="uppercase bold">Quant. Phys:</span> 32234
                            </div>
                            <div>
                                <span class="uppercase bold">Quant. Opt:</span> 32234
                            </div>
                        </div>
                        <div class="col-2 text-align-center list-body-cell">146%</div>
                        <div class="col-2 text-align-center list-body-cell">21 Jan 2018</div>
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
            <state-research-list></state-research-list>
        </div>

        <div class="c-pt-8">
            <research-group-details-proposals></research-group-details-proposals>
        </div>
    </div>   
</template>

<script>
    export default {
        name: "ResearchGroupDetailsBody",
        data() { 
            return {} 
        }
    };
</script>

<style lang="less" scoped>
</style>
