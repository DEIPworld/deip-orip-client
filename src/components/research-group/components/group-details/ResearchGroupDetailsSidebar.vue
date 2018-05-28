<template>
    <div>
        <div class="sm-title bold">Group Members: {{ groupShares.length }}</div>

        <div class="row-nowrap justify-between align-center c-pt-4"
            v-for="(member, index) in groupShares" :key="index"
        >
            <div>
                <v-avatar size="40px">
                    <v-gravatar :title="member.owner" :email="member.owner + '@deip.world'" />
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
            <div v-for="(item, i) in groupExpertise" :key="i">
                <span class="half-bold">{{ item.disciplineName }}</span>
                <span class="right">{{ item.value }}</span>
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
    import _ from 'lodash';
    
    export default {
        name: "ResearchGroupDetailsSidebar",
        data() {
            return {};
        },
        computed: {
            ...mapGetters({
                groupShares: 'researchGroup/groupShares',
                members: 'researchGroup/members'
            }),
            groupExpertise() {
                return _.chain(this.members)
                    .map('expertise')
                    .flatten()
                    .groupBy('discipline_id')
                    .mapValues(item => {
                        return { 
                            value: item.reduce((acc, val) => acc + val.amount, 0),
                            disciplineName: item[0].discipline_id
                        }
                    })
                    .values()
                    .value();
            }
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
