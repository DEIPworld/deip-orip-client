<template>
    <div>
        <div class="row justify-between align-center">
            <div>
                <v-icon size="18px">date_range</v-icon> 
                <span>Created 20 Jan 2018</span>
            </div>
            <v-btn small color="primary" class="ma-0">Vote</v-btn>
        </div>

        <div class="display-1 half-bold c-mt-10">
            {{research.title}}
        </div>

        <div class="c-pt-8">
            {{research.abstract}}
        </div>

        <div class="c-pt-8 title">Timeline</div>

        <div class="c-pt-6">
            <research-timeline></research-timeline>
        </div>

        <div class="c-pt-8 title">Research</div>

        <div class="c-pt-6">
            <v-expansion-panel>
                <v-expansion-panel-content v-for="(content, i) in contentList" :key="i">
                    <div slot="header">
                        <span class="bold">Chapter {{i + 1}}</span>
                        <span class="deip-blue-color bold c-pl-4"><a :href="`http://146.185.140.12:8181/${content.research_id}/${content.content}`" target="_blank">{{content.title}} </a></span>
                    </div>
                    <v-card>
                        <v-card-text class="pt-0">
                            <div class="c-ph-2">
                                <div class="caption grey--text c-pt-2"> {{content.authors.join("  ·  ")}}</div>
                                <div class="c-pt-4 half-bold">
                                </div>
                                <div class="c-pt-6">
                                    <div class="row-nowrap">
                                        <div class="c-pr-10">
                                            <div class="bold green--text text--darken-2">Quantum optics</div>
                                        </div>
                                        <div class="c-pr-10">
                                            <div>900 tokens</div>
                                        </div>
                                        <div class="c-pr-10">
                                            <v-icon size="18px">visibility</v-icon> <span>1999</span>
                                        </div>
                                        <div class="c-pr-10">
                                            <v-icon size="18px">chat_bubble</v-icon> <span>23</span>
                                        </div>
                                        <div>
                                            <v-icon size="18px">date_range</v-icon> <span>Upd 13 Mar 2018</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>

        <div class="c-pt-8 title">Reviews: 2</div>

        <div class="c-pt-6">
            <v-card>
                <div class="row-nowrap c-p-6">
                    <div class="review-left-block text-align-center">
                        <v-avatar size="90px">
                            <img src="http://deip.world/static/ashkor.7ff44c16.png" alt="User">
                        </v-avatar>
                        <div class="bold c-pt-2">Serge Dzeranov</div>
                        <v-btn class="ma-0 mt-2" block color="primary">Vote</v-btn>
                    </div>
                    <div class="c-ml-6">
                        <div>
                            <span class="grey--text">20 Jan 2018</span>
                            <span class="c-pl-2 green--text text--darken-3">Positive</span>
                        </div>
                        <div class="c-pt-4">
                            Collaboratively brand bricks-and-clicks services for clicks-and-mortar bandwidth. Intrinsicly 
                            underwhelm state of the art infrastructures via premier methods of empowerment. Holisticly 
                            procrastinate exceptional metrics for market positioning human capital. Monotonectally 
                            syndicate turnkey total linkage and cost effective portals. Competently e-enable professional 
                            markets and premier testing procedures. seamless ROI. Authoritatively monetize leading-edge 
                            users through dynamic core competencies. Quickly drive error-free data with premium benefits. 
                            Credibly simplify B2C content rather than magnetic catalysts for change.
                        </div>
                        <div class="c-pt-4 grey--text">
                            Quantum Optics 21 |  Physics  8787    
                        </div>
                    </div>
                </div>

                <v-divider></v-divider>

                <div class="row-nowrap c-p-6">
                    <div class="review-left-block text-align-center">
                        <v-avatar size="90px">
                            <img src="http://deip.world/static/aermolaev.bf4059ea.png" alt="User">
                        </v-avatar>
                        <div class="bold c-pt-2">Serge Dzeranov</div>
                        <v-btn class="ma-0 mt-2" block color="primary">Vote</v-btn>
                    </div>
                    <div class="c-ml-6">
                        <div>
                            <span class="grey--text">20 Jan 2018</span>
                            <span class="c-pl-2 green--text text--darken-3">Positive</span>
                        </div>
                        <div class="c-pt-4">
                            Collaboratively brand bricks-and-clicks services for clicks-and-mortar bandwidth. Intrinsicly 
                            underwhelm state of the art infrastructures via premier methods of empowerment. Holisticly 
                            procrastinate exceptional metrics for market positioning human capital. Monotonectally 
                            syndicate turnkey total linkage and cost effective portals. Competently e-enable professional 
                            markets and premier testing procedures. seamless ROI. Authoritatively monetize leading-edge 
                            users through dynamic core competencies. Quickly drive error-free data with premium benefits. 
                            Credibly simplify B2C content rather than magnetic catalysts for change.
                        </div>
                        <div class="c-pt-4 grey--text">
                            Quantum Optics 21 |  Physics  8787    
                        </div>
                    </div>
                </div>
            </v-card>
        </div>

        <div class="row c-pt-4 justify-end">
            <v-btn class="ma-0" color="primary">
                <v-icon>add</v-icon> Add a review
            </v-btn>
        </div>

        <div class="c-pt-4 title">Grants: 4</div>

        <div class="c-pt-6">
            <v-card>
                <div class="info-card-list">
                    <div class="list-line">
                        <div class="list-header-cell col-3">Organization</div>
                        <div class="list-header-cell col-5">Project</div>
                        <div class="list-header-cell col-2 text-align-center">Date</div>
                        <div class="list-header-cell col-2 text-align-right">Amount</div>
                    </div>
                    <div class="list-line" v-for="i in 5" :key="i">
                        <div class="col-3 list-body-cell a">JJHK</div>
                        <div class="col-5 list-body-cell">General Support</div>
                        <div class="col-2 list-body-cell text-align-center">20 Jan 2018</div>
                        <div class="col-2 list-body-cell text-align-right">$50 000</div>
                    </div>
                </div>
            </v-card>
        </div>
        
        <div class="c-pt-8 title">References: 4</div>

        <div class="c-pt-6">
            <div>
                1. Crawford, Lynn. (2007). Global body of project management knowledge and standards. 
                In Jeffrey K. Pinto & Peter W.G. Morris (Eds.): The Wiley Guide to Managing Projects (1st ed., pp. 206-252). 
                Hoboken, N.J.: Wiley & Sons, Inc.
            </div>
            <div class="c-pt-2">
                2. Kwak, Young Hoon, and Frank T. Anbari. (2009). Analysing project management research: Perspectives 
                from top management journals. International Journal of Project Management, 27(5), 435-446.
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ResearchDetailsBody", 
        props: {
            research: { required: true, default: undefined },
            contentList: { required: true, default: [] }
        },
        data() {  
            return {

            }
        }
    };
</script>

<style lang="less" scoped>
    .review-left-block {
        width: 160px;
        min-width: 160px;
    }
</style>
