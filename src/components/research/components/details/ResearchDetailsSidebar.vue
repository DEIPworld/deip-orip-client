<template>
    <div>
        <div class="sm-title bold">Research Group</div>

        <div class="row-nowrap justify-between align-center c-pt-4">
            <div>
                <v-avatar size="40px">
                    <img src="http://deip.world/static/akulik.39060d33.png" alt="User">
                </v-avatar>
                <router-link to="/userDetails" class="a c-pl-3">Alex Shkor</router-link>
            </div>
            <div class="grey--text">15%</div>
        </div>
        <div class="row-nowrap justify-between align-center c-pt-4">
            <div>
                <v-avatar size="40px">
                    <img src="http://deip.world/static/ashkor.7ff44c16.png" alt="User">
                </v-avatar>
                <router-link to="/userDetails" class="a c-pl-3">Alex Shkor</router-link>
            </div>
            <div class="grey--text">15%</div>
        </div>
        <div class="c-pt-4 c-pb-6">
            <v-btn outline icon color="primary" class="ma-0">
                <v-icon small>add</v-icon>
            </v-btn>
            <span class="deip-blue-color c-pl-3">Join research group</span>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
            <div class="row-nowrap">
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">123<br>Folowers</div>
                </div>
                <div class="vertical-devider"></div>
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">Follow</div>
                </div>
            </div>
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Votes: 1034</div>

        <div class="c-pb-6 c-pt-4">
            <div class="row align-center justify-between vote-btn-area">
                <v-btn small color="primary" dark class="ma-0">Vote</v-btn>
                <div class="deip-blue-color pr-2">Phys. 11223</div>
            </div>
            <div class="row align-center justify-between vote-btn-area c-mt-1">
                <v-btn small color="primary" dark class="ma-0">Vote</v-btn>
                <div class="deip-blue-color pr-2">Phys. 11223</div>
            </div>
            <div class="row align-center justify-between vote-btn-area c-mt-1">
                <v-btn small color="primary" dark class="ma-0">Vote</v-btn>
                <div class="deip-blue-color pr-2">Phys. 11223</div>
            </div>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Reviews: 2</div>

        <div class="c-pt-4 c-pb-6">
            <v-btn dark round outline color="primary" class="full-width ma-0">
                <v-icon small>add</v-icon>
                <div class="col-grow add-review-label">
                    Add a review
                    <span class="caption grey--text">reward 15%</span>
                </div>
            </v-btn>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Citations: 10</div>
        <div class="sm-title bold c-pb-6">References: 2</div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Research Info</div>
        
        <div class="c-pt-4 c-pb-6">
            <div>
                <span class="half-bold">Review reward</span>
                <span class="deip-blue-color right">15%</span>
            </div>
            <div>
                <span class="half-bold">Total views</span>
                <span class="deip-blue-color right">222</span>
            </div>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Total Earned</div>
        
        <div class="c-pt-4 c-pb-6">
            <div>
                <span class="half-bold">DEIP tokens</span>
                <span class="right">12345</span>
            </div>
            <div>
                <span class="half-bold">Physcis</span>
                <span class="right">23432</span>
            </div>
            <div>
                <span class="half-bold">Quantum physics</span>
                <span class="right">333</span>
            </div>
            <div>
                <span class="half-bold">Quantum optics</span>
                <span class="right">5234</span>
            </div>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Research token holders</div>
        
        <div class="c-pt-4 c-pb-6">
            <div>
                <span class="half-bold">Research group</span>
                <span class="deip-blue-color right">80%</span>
            </div>
            <div>
                <span class="half-bold">Investor1</span>
                <span class="deip-blue-color right">15%</span>
            </div>
            <div>
                <span class="half-bold">Investor2</span>
                <span class="deip-blue-color right">5%</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ResearchDetailsSidebar",
        data() {
            return {};
        }
    };
</script>

<style lang="less" scoped>
    .vertical-devider {
        background-color: rgba(0,0,0,0.12);
        width: 1px;
        margin: 12px 0;
    }
    .vote-btn-area {
        border: 1px solid #2F80ED;
        border-radius: 3px;
    }
    .add-review-label {
        text-transform: none;
    }
</style>
