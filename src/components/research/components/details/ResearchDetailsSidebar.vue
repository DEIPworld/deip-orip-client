<template>
    <div class="full-width">
        <div class="section-title pt-3">Research Group</div>

        <div class="pt-2 pb-3">
            <v-layout justify-space-between align-center class="pt-1">
                <v-flex shrink>
                    <v-avatar size="32px">
                        <img src="http://deip.world/static/ashkor.7ff44c16.png" alt="User">
                    </v-avatar>
                    <span class="bold pl-1">Alex Shkor</span>
                </v-flex>
                <v-flex shrink class="user-stake">65%</v-flex>
            </v-layout>
            <v-layout justify-space-between align-center class="pt-1">
                <v-flex shrink>
                    <v-avatar size="32px">
                        <img src="http://deip.world/static/ashkor.7ff44c16.png" alt="User">
                    </v-avatar>
                    <span class="bold pl-1">Alex Shkor</span>
                </v-flex>
                <v-flex shrink class="user-stake">65%</v-flex>
            </v-layout>
            <v-layout align-center class="py-3">
                <v-flex shrink>
                    <v-btn outline icon color="deip-blue" class="ma-0">
                        <v-icon>add</v-icon>
                    </v-btn>
                </v-flex>
                <v-flex shrink class="pl-2 deip-blue-color">Join research group</v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout align-center class="pt-3">
                <v-flex xs6 class="text-align-center">123<br>Folowers</v-flex>
                <v-flex xs6 class="deip-blue-color text-align-center border-left">Follow<br>Research</v-flex>
            </v-layout>
        </div>

        <v-divider></v-divider>
        <div class="section-title pt-3">Votes: 1034</div>

        <div class="pt-2 pb-3">
            <v-layout align-center justify-space-between class="vote-btn-area mt-1">
                <v-btn small color="primary" dark class="ma-0">Vote</v-btn>
                <div class="deip-blue-color pr-2">Phys. 11223</div>
            </v-layout>
            <v-layout align-center justify-space-between class="vote-btn-area mt-1">
                <v-btn small color="primary" dark class="ma-0">Vote</v-btn>
                <div class="deip-blue-color pr-2">Phys. 11223</div>
            </v-layout>
            <v-layout align-center justify-space-between class="vote-btn-area mt-1">
                <v-btn small color="primary" dark class="ma-0">Vote</v-btn>
                <div class="deip-blue-color pr-2">Phys. 11223</div>
            </v-layout>
        </div>

        <v-divider></v-divider>
        <div class="section-title pt-3">Reviews: 2</div>

        <div class="pt-2 pb-3">
            <v-btn dark round outline color="deip-blue" class="full-width ma-0">
                <v-icon dark size="20px" class="">add</v-icon>
                <div class="col-grow add-review-label">
                    Add a review
                    <span>reward 15%</span>
                </div>
            </v-btn>
        </div>
        
        <v-divider></v-divider>
        <div class="section-title pt-3">Citations: 10</div>
        <div class="section-title pb-3">References: 2</div>
        
        <v-divider></v-divider>
        <div class="section-title pt-3">Research Info</div>
        
        <div class="pt-2 pb-3">
            <div class="bold">
                <span>Review reward</span>
                <span class="deip-blue-color">15%</span>
            </div>
            <div class="bold">
                <span>Total views</span>
                <span class="deip-blue-color">222</span>
            </div>
        </div>
        
        <v-divider></v-divider>
        <div class="section-title pt-3">Total Earned</div>
        
        <div class="pt-2 pb-3">
            <div class="bold">
                <span>DEIP Tokens</span>
                <span class="deip-blue-color">12345</span>
            </div>
            <div class="bold">
                <span>Physics</span>
                <span class="deip-blue-color">2212</span>
            </div>
            <div class="bold">
                <span>Quantum physics</span>
                <span class="deip-blue-color">666</span>
            </div>
            <div class="bold">
                <span></span>
                <span class="deip-blue-color"></span>
            </div>
        </div>
        
        <v-divider></v-divider>
        <div class="section-title pt-3">Research token holders</div>
        
        <div class="pt-2 pb-3">
            <div class="bold">
                <span>Research group</span>
                <span class="deip-blue-color">80%</span>
            </div>
            <div class="bold">
                <span>Inverstor1</span>
                <span class="deip-blue-color">15%</span>
            </div>
            <div class="bold">
                <span>Investor2</span>
                <span class="deip-blue-color">5%</span>
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

<style lang="less">
    .section-title {
        font-size: 16px;
        color: #2F80ED;
        font-weight: bold;
        text-decoration: underline;
    }
    .user-stake {
        color: #2F80ED;
        opacity: 0.5;
    }
    .border-left {
        border-left: 1px solid #ddd;
    }
    .vote-btn-area {
        border: 1px solid #2F80ED;
        border-radius: 3px;
    }
    .add-review-label {
        text-transform: none;
        span {
            font-size: 12px;
            color: #ccc;
        }
    }
</style>
