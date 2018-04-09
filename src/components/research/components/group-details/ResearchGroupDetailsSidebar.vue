<template>
    <div>
        <div class="sm-title bold">Group Members: 3</div>

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
        <div class="c-mv-6">
            <span class="clickable-label">3 JOIN REQUESTS</span>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
            <div class="row-nowrap">
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">123<br>Folowers</div>
                </div>
                <div class="vertical-devider"></div>
                <!-- <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">Follow</div>
                </div> -->
            </div>
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Group Info</div>

        <div class="c-pt-4 c-pb-6">
            <div>DEIP tokens 12345</div>
            <div>Physcis 23432</div>
            <div>Quantum physics 333</div>
            <div>Quantum optics 5234</div>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>
        
        <div class="sm-title bold c-pt-6">Research Token Holders</div>

        <div class="c-pt-4 c-pb-6">
            <div>Research group <span class="deip-blue-color">80%</span></div>
            <div>Investor1 <span class="deip-blue-color">15%</span></div>
            <div>Investor2 <span class="deip-blue-color">5%</span></div>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ResearchGroupDetailsSidebar",
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
</style>
