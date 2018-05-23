<template>
    <div>
        <div class="sm-title bold">Group Members: {{ groupShares.length }}</div>

        <div class="row-nowrap justify-between align-center c-pt-4"
            v-for="(member, index) in groupShares" :key="index"
        >
            <div>
                <v-avatar size="40px">
                    <v-gravatar :email="member.owner + '@deip.world'" />
                </v-avatar>
                <router-link to="/userDetails" class="a c-pl-3">{{ member.owner }}</router-link>
            </div>
            <div class="grey--text">{{ convertToPercent(member.amount) }}%</div>
        </div>
        <div class="c-mv-6">
            <span class="deip-label">2 JOIN REQUESTS</span>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
            <div class="row-nowrap">
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">15<br>Folowers</div>
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
            <div>
                <span class="half-bold">DEIP tokens</span>
                <span class="right">2 345</span>
            </div>
            <div>
                <span class="half-bold">Physcis</span>
                <span class="right">432</span>
            </div>
            <div>
                <span class="half-bold">Quantum physics</span>
                <span class="right">1 333</span>
            </div>
            <div>
                <span class="half-bold">Quantum optics</span>
                <span class="right">4 234</span>
            </div>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>
        
        <div class="sm-title bold c-pt-6">Research Token Holders</div>

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

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    
    export default {
        name: "ResearchGroupDetailsSidebar",
        data() {
            return {};
        },
        computed: {
            ...mapGetters({
                groupShares: 'researchGroup/groupShares'
            })
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
